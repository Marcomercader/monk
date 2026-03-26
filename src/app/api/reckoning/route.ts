import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const supabase = db();
  const { data, error } = await supabase
    .from("notification_log")
    .select("id, metadata, sent_at")
    .eq("user_id", userId)
    .eq("type", "reckoning")
    .is("answered_at", null)
    .order("sent_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return NextResponse.json({ pending: false });

  return NextResponse.json({
    pending: true,
    id: data.id,
    narrative: (data.metadata as Record<string, unknown>)?.narrative ?? "",
  });
}

export async function POST(req: NextRequest) {
  const { userId, notificationId } = await req.json();
  if (!userId || !notificationId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = db();
  const { error } = await supabase
    .from("notification_log")
    .update({ answered_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
