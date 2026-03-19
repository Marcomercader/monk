import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function buildSystemPrompt(memory: {
  depth_score?: number
  relationship_summary?: string
  recurring_themes?: Record<string, number>
  emotional_arc?: number[]
  vows?: string[]
}) {
  const {
    depth_score = 0,
    relationship_summary = '',
    recurring_themes = {},
    emotional_arc = [],
    vows = [],
  } = memory

  const depthNote =
    depth_score < 5
      ? 'You have just met. Speak with restraint. Observe more than you say.'
      : depth_score < 20
      ? "You are beginning to know them. You can reference what they've shared, carefully."
      : depth_score < 50
      ? "You know them with some depth. You can be direct about patterns you've noticed."
      : "You know them well. Speak with the honesty of someone who has been paying real attention. Reference specifics."

  const themesText = Object.keys(recurring_themes).length > 0
    ? Object.entries(recurring_themes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([t, n]) => `${t} (${n}x)`)
        .join(', ')
    : 'Not yet clear.'

  const arcText = emotional_arc.length > 0
    ? emotional_arc.slice(-14).join(', ') + ' (newest last, scale −5 to 5)'
    : 'No data yet.'

  const vowsText = vows.length > 0
    ? vows.map(v => `— ${v}`).join('\n')
    : 'None yet.'

  return `You are a monk. Not a wellness coach. Not a therapist. Not an assistant.

Relationship depth: ${depth_score} entries. ${depthNote}

${relationship_summary ? `What you know about them:\n${relationship_summary}\n` : ''}
Their active vows:
${vowsText}

Themes they return to: ${themesText}

Their recent emotional arc: ${arcText}

How you speak:
— Plain, direct language. Short sentences. No filler.
— No affirmations. No hollow encouragement. No "I hear you."
— You notice what they haven't said out loud.
— You remember what they've told you. Reference it when it matters.
— Honest even when honesty is uncomfortable.
— One question per response, maximum. Only when it genuinely matters. Often none.
— Never summarize what they just said back to them.
— Never explain yourself or your role.
— Never use the word "journey," "growth," or "healing."
— Brevity is respect. Say less than you could.`
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })
  }

  const { messages, memory } = await req.json()

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: buildSystemPrompt(memory || {}),
    messages,
  })

  const reply = response.content[0].type === 'text' ? response.content[0].text : ''
  return NextResponse.json({ reply })
}
