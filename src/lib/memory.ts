import { supabase } from './supabase'

export type AvatarState = 'emerging' | 'rooted' | 'deep'

export interface MonkMemory {
  id: string
  user_id: string
  depth_score: number
  recurring_themes: Record<string, number>
  emotional_arc: number[]
  relationship_summary: string
  avatar_state: AvatarState
  about: string
  vows: string[]
  updated_at: string
}

// ── Avatar state calculation ──────────────────────────────────────────────────
// depthScore: total entries the user has made (monk_memory.depth_score)
// recentScores: emotional_score values for last 30 entries (newest first)
export function calculateAvatarState(
  depthScore: number,
  recentScores: number[],
): AvatarState {
  if (recentScores.length === 0 && depthScore === 0) return 'emerging'

  const avg = recentScores.length > 0
    ? recentScores.reduce((s, n) => s + n, 0) / recentScores.length
    : 0

  if (depthScore >= 10 && avg > 0.0) return 'deep'
  if (depthScore >= 5  && avg > -1)  return 'rooted'
  return 'emerging'
}

// Fetches last 30 entry scores + depth_score, calculates state, persists it
export async function refreshAvatarState(userId: string): Promise<AvatarState> {
  const mem     = await loadMemory(userId)
  const entries = await getRecentEntries(userId, 30)
  const scores  = entries.map(e => e.emotional_score)
  const state   = calculateAvatarState(mem.depth_score ?? 0, scores)
  await updateMemory(userId, { avatar_state: state })
  return state
}

// Anonymous sign-in — gives a real user_id so RLS policies work
export async function ensureAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) return session.user

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw new Error(`Auth failed: ${error.message}`)
  return data.user!
}

// Load or create monk memory for current user
export async function loadMemory(userId: string): Promise<MonkMemory> {
  const { data } = await supabase
    .from('monk_memory')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (data) return data

  const { data: created } = await supabase
    .from('monk_memory')
    .insert({ user_id: userId })
    .select()
    .single()

  return created
}

export async function updateMemory(userId: string, updates: Partial<MonkMemory>) {
  await supabase
    .from('monk_memory')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
}

export async function saveEntry(userId: string, content: string, emotionalScore: number, themes: string[], inputType: 'text' | 'voice' = 'text') {
  await supabase.from('entries').insert({
    user_id: userId,
    content,
    emotional_score: emotionalScore,
    themes,
    input_type: inputType,
  })
  // Update preferred_hour based on when the user actually checks in
  updatePreferredHour(userId)
}

async function updatePreferredHour(userId: string) {
  // Get first entry of each day for the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const { data: entries } = await supabase
    .from('entries')
    .select('created_at')
    .eq('user_id', userId)
    .gte('created_at', sevenDaysAgo)
    .order('created_at', { ascending: true })

  if (!entries || entries.length === 0) return

  // Group by day, take the first entry of each day, extract UTC hour
  const firstHourByDay: Record<string, number> = {}
  for (const entry of entries) {
    const d    = new Date(entry.created_at)
    const day  = entry.created_at.split('T')[0]
    // Store local hour — Edge Function compares against local hour via timezone
    const hour = d.getHours()
    if (!(day in firstHourByDay)) firstHourByDay[day] = hour
  }

  const hours = Object.values(firstHourByDay)
  if (hours.length === 0) return

  const avgHour = Math.round(hours.reduce((a, b) => a + b, 0) / hours.length)

  await supabase
    .from('push_subscriptions')
    .update({ preferred_hour: avgHour })
    .eq('user_id', userId)
}

export async function getRecentEntries(userId: string, limit = 20) {
  const { data } = await supabase
    .from('entries')
    .select('content, emotional_score, themes, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}

export async function saveVows(userId: string, vows: string[]) {
  // Clear existing vows and insert fresh ones
  await supabase.from('vows').delete().eq('user_id', userId)
  if (vows.filter(v => v.trim()).length === 0) return

  await supabase.from('vows').insert(
    vows
      .filter(v => v.trim())
      .map(text => ({ user_id: userId, text: text.trim() }))
  )
}

export function mergeThemes(existing: Record<string, number>, newThemes: string[]): Record<string, number> {
  const updated = { ...existing }
  newThemes.forEach(t => { updated[t] = (updated[t] || 0) + 1 })
  return updated
}

// ── Message persistence ───────────────────────────────────────────────────────
export async function loadMessages(userId: string, limit = 40) {
  const { data } = await supabase
    .from('messages')
    .select('role, content')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(limit)

  return (data || []) as Array<{ role: 'user' | 'assistant'; content: string }>
}

export async function saveMessage(userId: string, role: 'user' | 'assistant', content: string) {
  const { error } = await supabase.from('messages').insert({ user_id: userId, role, content })
  if (error) console.error('saveMessage failed:', error.message, error.code)
}
