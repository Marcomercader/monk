import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { userId, text, notificationType, notificationId } = await req.json()

  if (!userId || !text) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Save as a monk_memory entry with input_type = 'notification_reply'
  const { error: entryError } = await supabase.from('entries').insert({
    user_id: userId,
    content: text,
    input_type: 'notification_reply',
    notification_type: notificationType,
    notification_id: notificationId,
  })

  if (entryError) {
    return NextResponse.json({ error: entryError.message }, { status: 500 })
  }

  // Mark answered_at on notification_log for question-type notifications
  if (notificationId && (notificationType === 'easy_question' || notificationType === 'reckoning')) {
    await supabase
      .from('notification_log')
      .update({ answered_at: new Date().toISOString() })
      .eq('id', notificationId)
  }

  return NextResponse.json({ ok: true })
}
