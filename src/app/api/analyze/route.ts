import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const VALID_THEMES = [
  'family', 'work', 'health', 'relationships', 'self-worth',
  'purpose', 'creativity', 'money', 'anxiety', 'grief', 'joy', 'identity',
]

export async function POST(req: NextRequest) {
  const { content, recentEntries, currentSummary, regenerateSummary } = await req.json()

  // ── Entry analysis ──────────────────────────────────────────────────────────
  const analysisResponse = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 120,
    system: 'Analyze journal entries. Respond with valid JSON only, no other text.',
    messages: [{
      role: 'user',
      content: `Return JSON with exactly these fields:
{"emotional_score": <integer -5 to 5>, "themes": <array of 1-3 strings from: ${VALID_THEMES.join(', ')}>}

Entry: "${content}"`,
    }],
  })

  let analysis = { emotional_score: 0, themes: [] as string[] }
  try {
    const text = analysisResponse.content[0].type === 'text' ? analysisResponse.content[0].text : '{}'
    analysis = JSON.parse(text)
  } catch { /* keep defaults */ }

  // ── Relationship summary (every 5 entries) ──────────────────────────────────
  let newSummary = currentSummary || ''
  if (regenerateSummary && recentEntries?.length > 0) {
    const entryTexts = recentEntries
      .slice(0, 20)
      .map((e: { emotional_score: number; content: string }) =>
        `[score ${e.emotional_score > 0 ? '+' : ''}${e.emotional_score}] ${e.content}`)
      .join('\n')

    const summaryResponse = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 250,
      system: `You are writing a private briefing for a monk about someone in their care.
Write 2-3 sentences in third person. Be specific and observational — not therapeutic.
Note what they return to repeatedly, how they speak about themselves, what they sidestep.
Do not offer interpretation. Just describe what you see.`,
      messages: [{
        role: 'user',
        content: `Previous understanding: ${currentSummary || 'None yet.'}

Recent entries (newest first):
${entryTexts}

Write an updated summary.`,
      }],
    })

    newSummary = summaryResponse.content[0].type === 'text'
      ? summaryResponse.content[0].text
      : currentSummary
  }

  return NextResponse.json({ analysis, newSummary })
}
