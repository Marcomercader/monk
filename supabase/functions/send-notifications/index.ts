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
  type: string;
  sent_at: string;
  message: string;
}

interface Memory {
  depth_score: number;
  relationship_summary: string;
  recurring_themes: Record<string, number>;
}

interface Subscription {
  user_id: string;
  subscription: object;
  preferred_hour: number;
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
  const recentText = entries.slice(0, 5).map((e) => e.content).join(" | ");
  return generateMessage(
    apiKey,
    `You are a monk reaching out to someone you have been watching. Write ONE sentence, maximum 15 words. No greeting. No emoji. No filler. Reference something specific from their recent entries — something unresolved. Make it feel like you already know what's on their mind.`,
    `Recent entries: ${recentText || "none yet"}. Summary: ${mem.relationship_summary || "early relationship"}.`
  );
}

async function buildPatternSurface(apiKey: string, theme: string, entries7d: Entry[], count: number): Promise<string> {
  const examples = entries7d
    .filter((e) => Array.isArray(e.themes) && e.themes.includes(theme))
    .slice(0, 3)
    .map((e) => e.content)
    .join(" | ");
  return generateMessage(
    apiKey,
    `You are a monk who has noticed a repeating pattern. Write ONE sentence, maximum 15 words. Name the theme and the frequency. Be specific. Example: "You've mentioned [thing] four times this week without saying why."`,
    `Theme "${theme}" appeared ${count} times in 7 days. Examples: ${examples}`
  );
}

async function buildAbsenceCall(apiKey: string, entries: Entry[], mem: Memory, daysSince: number): Promise<string> {
  const isClose = mem.depth_score > 20;
  const lastEntry = entries[0]?.content ?? "";
  return generateMessage(
    apiKey,
    isClose
      ? `You are a monk who has noticed someone's absence. You know them well. Write ONE sentence, maximum 12 words. No guilt. No urgency. Acknowledge their absence with the weight of someone who noticed. Example: "I noticed. Come back when you're ready."`
      : `You are a monk who has noticed someone's absence. You barely know them. Write ONE sentence, maximum 8 words. Dry, sparse. Example: "You have been away."`,
    isClose
      ? `Away for ${Math.floor(daysSince)} days. Last entry: "${lastEntry}". Depth: ${mem.depth_score}.`
      : `Away for ${Math.floor(daysSince)} days. Depth score: ${mem.depth_score}.`
  );
}

// ── Main handler ───────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

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

  const currentHour  = new Date().getUTCHours();
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const subsRes = await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?select=*`, { headers: db });
  const subs: Subscription[] = await subsRes.json();
  const results = [];

  for (const sub of subs) {
    const userId = sub.user_id;
    const preferredHour = sub.preferred_hour ?? 8;

    try {
      const [entriesRes, entries7dRes, logsRes, memRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/entries?user_id=eq.${userId}&select=content,emotional_score,created_at,themes&order=created_at.desc&limit=10`, { headers: db }),
        fetch(`${SUPABASE_URL}/rest/v1/entries?user_id=eq.${userId}&created_at=gte.${sevenDaysAgo}&select=content,themes,created_at&order=created_at.desc`, { headers: db }),
        fetch(`${SUPABASE_URL}/rest/v1/notification_log?user_id=eq.${userId}&select=type,sent_at,message&order=sent_at.desc&limit=30`, { headers: db }),
        fetch(`${SUPABASE_URL}/rest/v1/monk_memory?user_id=eq.${userId}&select=depth_score,relationship_summary,recurring_themes&limit=1`, { headers: db }),
      ]);

      const entries: Entry[]   = await entriesRes.json();
      const entries7d: Entry[] = await entries7dRes.json();
      const logs: NotifLog[]   = await logsRes.json();
      const mems: Memory[]     = await memRes.json();
      const mem: Memory        = mems[0] ?? { depth_score: 0, relationship_summary: "", recurring_themes: {} };

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

      // ── Decide what to send ──────────────────────────────────────────────
      let notifType: string | null = null;
      let message = "";

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

      } else if (!morningDone && currentHour >= preferredHour && currentHour < preferredHour + 2) {
        // Morning pulse: only in the 2-hour window around their preferred time
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
        body: JSON.stringify({ user_id: userId, type: notifType, message }),
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
