import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Entry {
  content: string;
  emotional_score: number;
  created_at: string;
  themes: string[];
}

interface NotifLog {
  id: string;
  type: string;
  sent_at: string;
  message: string;
  metadata?: { question?: string; format?: string } | null;
  answered_at?: string | null;
}

interface Memory {
  depth_score: number;
  relationship_summary: string;
  recurring_themes: Record<string, number>;
  about?: string;
  vows?: string[];
}

interface Subscription {
  user_id: string;
  subscription: object;
  preferred_hour: number;
  timezone: string;
}

// ── Claude call ────────────────────────────────────────────────────────────
async function generateMessage(apiKey: string, systemPrompt: string, userContext: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 60,
      system: systemPrompt,
      messages: [{ role: "user", content: userContext }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? "";
}

// ── Notification logic ─────────────────────────────────────────────────────

function shouldSendAbsenceCall(entries: Entry[], logs: NotifLog[]): boolean {
  if (entries.length === 0) return false;
  const lastEntryTime = new Date(entries[0].created_at).getTime();
  const daysSince = (Date.now() - lastEntryTime) / 86400000;
  if (daysSince < 3) return false;
  const alreadySent = logs.some(
    (l) => l.type === "absence_call" && new Date(l.sent_at).getTime() > lastEntryTime
  );
  return !alreadySent;
}

function detectPattern(entries7d: Entry[], logs: NotifLog[]): { theme: string; count: number } | null {
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const recentPatternSent = logs.some(
    (l) => l.type === "pattern_surface" && new Date(l.sent_at).getTime() > sevenDaysAgo
  );
  if (recentPatternSent) return null;

  const counts: Record<string, number> = {};
  for (const entry of entries7d) {
    if (Array.isArray(entry.themes)) {
      for (const theme of entry.themes) {
        counts[theme] = (counts[theme] || 0) + 1;
      }
    }
  }
  const hit = Object.entries(counts).find(([, n]) => n >= 4);
  return hit ? { theme: hit[0], count: hit[1] } : null;
}

function wasActiveTodayAlready(entries: Entry[]): boolean {
  if (entries.length === 0) return false;
  const today = new Date().toISOString().split("T")[0];
  return entries[0].created_at.startsWith(today);
}

function notificationsSentToday(logs: NotifLog[]): number {
  const today = new Date().toISOString().split("T")[0];
  return logs.filter((l) => l.sent_at.startsWith(today)).length;
}

function hoursSinceLastNotification(logs: NotifLog[]): number {
  if (logs.length === 0) return 999;
  const sorted = [...logs].sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
  return (Date.now() - new Date(sorted[0].sent_at).getTime()) / 3600000;
}

function morningPulseSentToday(logs: NotifLog[]): boolean {
  const today = new Date().toISOString().split("T")[0];
  return logs.some((l) => l.type === "morning_pulse" && l.sent_at.startsWith(today));
}

// ── Message builders ───────────────────────────────────────────────────────

async function buildMorningPulse(apiKey: string, entries: Entry[], mem: Memory): Promise<string> {
  const vows  = (mem.vows || []).filter(Boolean);
  const about = mem.about || "";
  const hasEntries = entries.length > 0;
  const hasVows    = vows.length > 0;
  const hasAbout   = about.trim().length > 0;

  // Nothing to go on — nudge them to set vows
  if (!hasEntries && !hasVows && !hasAbout) {
    return "You haven't made any vows. Start there.";
  }

  // No entries yet — ground in vows and description only
  if (!hasEntries) {
    const context = `
What they said about themselves: ${hasAbout ? about : "Nothing yet."}
Their vows: ${hasVows ? vows.map(v => `— ${v}`).join(", ") : "None declared."}
`.trim();
    return generateMessage(
      apiKey,
      `You are a monk reaching out to someone you barely know. You have only their vows and self-description. Write ONE cold, short sentence — maximum 10 words. Reference one of their vows directly. No warmth. No greeting. No emoji. Speak as someone watching from a distance.`,
      context
    );
  }

  // Has entries — full context
  const recentEntries = entries.slice(0, 5);
  const arc           = recentEntries.map((e) => e.emotional_score).reverse().join(", ");
  const entryTexts    = recentEntries.map((e, i) => `Entry ${i + 1}: "${e.content}"`).join("\n");

  const context = `
Who this person is: ${mem.relationship_summary || (hasAbout ? about : "early in the relationship")}
Their vows: ${hasVows ? vows.map(v => `— ${v}`).join("\n") : "none declared"}
Their recent entries (newest first):
${entryTexts}
Their emotional arc (oldest to newest, -5 to 5): ${arc || "unknown"}
Recurring themes: ${Object.entries(mem.recurring_themes || {}).sort((a,b) => b[1]-a[1]).slice(0,4).map(([t,n]) => `${t} (${n}x)`).join(", ") || "none yet"}
`.trim();

  return generateMessage(
    apiKey,
    `You are a monk. You have been watching this person closely. You are reaching out with one sentence — not a reminder, not a prompt. A statement from someone who has been paying real attention.

Rules:
— Maximum 15 words
— No greeting, no emoji, no "I hope you're..."
— Speak directly, as if mid-conversation
— Reference something specific and unresolved from their entries — a decision they haven't made, something they said they would do, a feeling they keep returning to
— Do not explain yourself or your observation
— The sentence should make them pause, not feel guilty

Bad examples: "How are you feeling today?" / "Remember to check in!" / "You've been on my mind."
Good examples: "You said you were going to call her. Did you?" / "Three days of the same feeling. What is underneath it?" / "You keep circling this without naming it."`,
    context
  );
}

async function buildPatternSurface(apiKey: string, theme: string, entries7d: Entry[], count: number): Promise<string> {
  const relevantEntries = entries7d
    .filter((e) => Array.isArray(e.themes) && e.themes.includes(theme))
    .slice(0, 4)
    .map((e, i) => `Entry ${i + 1}: "${e.content}"`)
    .join("\n");

  const context = `
The theme "${theme}" has appeared ${count} times across their last 7 days of entries.

The entries where it appears:
${relevantEntries}
`.trim();

  return generateMessage(
    apiKey,
    `You are a monk who has noticed something this person hasn't named yet. Write ONE sentence surfacing the pattern you've observed — maximum 15 words.

Rules:
— Name the theme and how many times it has appeared
— Do not moralize or offer advice
— Do not ask a question
— Speak as someone who has been watching, not analyzing
— The sentence should feel like being seen, not diagnosed

Bad examples: "You seem to be struggling with family issues." / "Have you considered why you keep thinking about this?"
Good examples: "You have mentioned your father four times this week without saying why." / "Work has come up in every entry this week. You haven't said how you actually feel about it."`,
    context
  );
}

async function buildEasyQuestion(
  apiKey: string,
  mem: Memory,
  entries: Entry[]
): Promise<{ question: string; format: "options" | "text" }> {
  const recentTexts = entries
    .slice(0, 3)
    .map((e, i) => `Entry ${i + 1}: "${e.content}"`)
    .join("\n");

  const context = `
Depth score: ${mem.depth_score}
Their summary: ${mem.relationship_summary || "Not available."}
Recent entries:
${recentTexts || "None yet."}
`.trim();

  const question = await generateMessage(
    apiKey,
    `You are a monk. Generate ONE short, direct introspective question for this person — something they can answer with a single word or short phrase. Ground it in what you know about them. Examples: "Did you follow through on what you said yesterday?" / "Are you sleeping enough?" / "Have you spoken to them yet?". Maximum 15 words. No preamble, no emoji, just the question.`,
    context
  );

  const format: "options" | "text" = Math.random() < 0.5 ? "options" : "text";
  return { question, format };
}

function shouldSendEasyQuestion(logs: NotifLog[]): boolean {
  const twoDaysAgo = Date.now() - 48 * 3600000;
  const easyLogs = logs.filter((l) => l.type === "easy_question");

  // Don't send if there is already a pending unanswered question
  if (easyLogs.some((l) => !l.answered_at)) return false;

  // Send if never sent before, or last one was > 48h ago
  if (easyLogs.length === 0) return true;
  const last = [...easyLogs].sort(
    (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
  )[0];
  return new Date(last.sent_at).getTime() < twoDaysAgo;
}

async function buildAbsenceCall(apiKey: string, entries: Entry[], mem: Memory, daysSince: number): Promise<string> {
  const isClose = mem.depth_score > 20;
  const lastEntry = entries[0]?.content ?? "";
  const lastThemes = entries.slice(0, 3).flatMap((e) => e.themes || []).slice(0, 3).join(", ");

  const context = isClose
    ? `Away for ${Math.floor(daysSince)} days. Last entry: "${lastEntry}". What they were thinking about: ${lastThemes || "unclear"}. Depth score: ${mem.depth_score}.`
    : `Away for ${Math.floor(daysSince)} days. Depth score: ${mem.depth_score} — early relationship, not much shared yet.`;

  return generateMessage(
    apiKey,
    isClose
      ? `You are a monk. Someone you know well has been gone for days. You are sending them one sentence — not to guilt them, not to beg, not to escalate. You are simply letting them know you noticed.

Rules:
— Maximum 12 words
— No guilt language, no urgency, no "we miss you"
— You may reference something from their last entry if it feels true
— Speak with the weight of someone who has been paying attention and simply wants them back
— The monk does not beg. Silence after this.

Good examples: "I noticed. Come back when you're ready." / "You left mid-thought. It's still here when you return." / "The light has been low. I've noticed."
Bad examples: "You haven't checked in — don't break your streak!" / "Are you okay? We're worried."`
      : `You are a monk. Someone you barely know has gone quiet. Send them one sentence — dry, sparse, no emotion. You are simply marking their absence. Maximum 8 words. No guilt. No warmth. Just acknowledgment.

Good examples: "You have been away." / "Still here." / "The door is open."`,
    context
  );
}

// ── Main handler ───────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url      = new URL(req.url);
  const testMode = url.searchParams.get("test") === "true";

  const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
  const VAPID_PUBLIC  = Deno.env.get("VAPID_PUBLIC_KEY")!;
  const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY")!;
  const SUPABASE_URL  = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  webpush.setVapidDetails("https://monkapp.vercel.app", VAPID_PUBLIC, VAPID_PRIVATE);

  const db = {
    Authorization: `Bearer ${SERVICE_KEY}`,
    apikey: SERVICE_KEY,
    "Content-Type": "application/json",
  };

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const subsRes = await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?select=*`, { headers: db });
  const subs: Subscription[] = await subsRes.json();
  const results = [];

  for (const sub of subs) {
    const userId       = sub.user_id;
    const preferredHour = sub.preferred_hour ?? 8;
    const timezone      = sub.timezone || "America/New_York";
    // Get the current hour in the user's local timezone
    const currentHour   = parseInt(new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: timezone }).format(new Date()));

    try {
      const [entriesRes, entries7dRes, logsRes, memRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/entries?user_id=eq.${userId}&select=content,emotional_score,created_at,themes&order=created_at.desc&limit=10`, { headers: db }),
        fetch(`${SUPABASE_URL}/rest/v1/entries?user_id=eq.${userId}&created_at=gte.${sevenDaysAgo}&select=content,themes,created_at&order=created_at.desc`, { headers: db }),
        fetch(`${SUPABASE_URL}/rest/v1/notification_log?user_id=eq.${userId}&select=id,type,sent_at,message,metadata,answered_at&order=sent_at.desc&limit=30`, { headers: db }),
        fetch(`${SUPABASE_URL}/rest/v1/monk_memory?user_id=eq.${userId}&select=depth_score,relationship_summary,recurring_themes,about,vows&limit=1`, { headers: db }),
      ]);

      const entries: Entry[]   = await entriesRes.json();
      const entries7d: Entry[] = await entries7dRes.json();
      const logs: NotifLog[]   = await logsRes.json();
      const mems: Memory[]     = await memRes.json();
      const mem: Memory        = mems[0] ?? { depth_score: 0, relationship_summary: "", recurring_themes: {} };

      if (!testMode) {
        // Already checked in today — monk doesn't message people who are present
        if (wasActiveTodayAlready(entries)) {
          results.push({ user: userId, skipped: "active today" });
          continue;
        }

        // Max 2 notifications per day
        if (notificationsSentToday(logs) >= 2) {
          results.push({ user: userId, skipped: "daily limit reached" });
          continue;
        }

        // Min 6 hours between notifications
        if (hoursSinceLastNotification(logs) < 6) {
          results.push({ user: userId, skipped: "too soon" });
          continue;
        }
      }

      // ── Decide what to send ──────────────────────────────────────────────
      let notifType: string | null = null;
      let message = "";
      let notifMetadata: object | null = null;

      const morningDone  = morningPulseSentToday(logs);
      const sentToday    = notificationsSentToday(logs);
      const pattern      = detectPattern(entries7d, logs);

      if (shouldSendAbsenceCall(entries, logs)) {
        const daysSince = (Date.now() - new Date(entries[0].created_at).getTime()) / 86400000;
        notifType = "absence_call";
        message   = await buildAbsenceCall(ANTHROPIC_KEY, entries, mem, daysSince);

      } else if (pattern && (sentToday === 0 || (morningDone && currentHour >= 21))) {
        // Pattern surface: fires any time if it's the only notification, or after 9pm as second
        notifType = "pattern_surface";
        message   = await buildPatternSurface(ANTHROPIC_KEY, pattern.theme, entries7d, pattern.count);

      } else if (shouldSendEasyQuestion(logs)) {
        // Easy question: fires every 48h if no pending unanswered question
        const easyQ = await buildEasyQuestion(ANTHROPIC_KEY, mem, entries);
        notifType    = "easy_question";
        message      = easyQ.question;
        notifMetadata = { question: easyQ.question, format: easyQ.format };

      } else if (testMode || (!morningDone && currentHour >= preferredHour && currentHour < preferredHour + 2)) {
        notifType = "morning_pulse";
        message   = await buildMorningPulse(ANTHROPIC_KEY, entries, mem);
      }

      if (!notifType || !message) {
        results.push({ user: userId, skipped: "not the right time or no applicable type" });
        continue;
      }

      // ── Send ────────────────────────────────────────────────────────────
      await webpush.sendNotification(
        sub.subscription,
        JSON.stringify({ title: "monk", body: message, url: "/think" })
      );

      await fetch(`${SUPABASE_URL}/rest/v1/notification_log`, {
        method: "POST",
        headers: db,
        body: JSON.stringify({
          user_id: userId,
          type: notifType,
          message,
          ...(notifMetadata ? { metadata: notifMetadata } : {}),
        }),
      });

      results.push({ user: userId, type: notifType, message });

    } catch (err) {
      results.push({ user: userId, error: String(err) });
    }
  }

  return new Response(JSON.stringify(results, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
