import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/easy-question?userId=<userId>
// Returns the latest unanswered easy_question for the user, or null
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const supabase = getDb();
  const { data, error } = await supabase
    .from("notification_log")
    .select("id, metadata, sent_at")
    .eq("user_id", userId)
    .eq("type", "easy_question")
    .is("answered_at", null)
    .order("sent_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || !data.metadata) return NextResponse.json({ pending: false });

  return NextResponse.json({
    pending: true,
    id: data.id,
    question: (data.metadata as { question: string; format: string }).question,
    format: (data.metadata as { question: string; format: string }).format,
  });
}

// POST /api/easy-question
// Body: { userId, notificationId, question, answer }
// Saves answer to entries and marks the notification as answered
export async function POST(req: NextRequest) {
  const { userId, notificationId, question, answer } = await req.json();
  if (!userId || !notificationId || !answer) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = getDb();

  const [entryResult, logResult] = await Promise.all([
    supabase.from("entries").insert({
      user_id: userId,
      content: `Q: ${question} | A: ${answer}`,
      emotional_score: 0,
      themes: [],
      input_type: "easy_answer",
    }),
    supabase
      .from("notification_log")
      .update({ answered_at: new Date().toISOString() })
      .eq("id", notificationId)
      .eq("user_id", userId),
  ]);

  if (entryResult.error) {
    return NextResponse.json({ error: entryResult.error.message }, { status: 500 });
  }
  if (logResult.error) {
    return NextResponse.json({ error: logResult.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
