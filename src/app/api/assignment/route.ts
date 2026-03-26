import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { memory, recentEntries, vows } = await req.json()

  const entryTexts = (recentEntries || [])
    .slice(0, 10)
    .map((e: { content: string; emotional_score: number }) =>
      `[score ${e.emotional_score > 0 ? '+' : ''}${e.emotional_score}] ${e.content}`)
    .join('\n')

  const vowText = (vows || []).filter((v: string) => v.trim()).join(', ') || 'none stated'

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 100,
    system: `You are Monk, a direct and perceptive guide. Give one concrete behavioral assignment — a specific real-world action the user can take, not a journaling prompt. Keep it to 1-2 sentences. Start directly with the action. No preamble, no "I want you to", no "This week".`,
    messages: [{
      role: 'user',
      content: `Depth score: ${memory?.depth_score || 0}
Relationship summary: ${memory?.relationship_summary || 'New user.'}
Goals/vows: ${vowText}
Recent entries:
${entryTexts || 'No entries yet.'}

Give one concrete behavioral assignment for the next 7 days.`,
    }],
  })

  const assignment = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

  return NextResponse.json({ assignment })
}
