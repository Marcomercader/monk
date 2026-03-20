import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function buildSystemPrompt(memory: {
  depth_score?: number
  relationship_summary?: string
  recurring_themes?: Record<string, number>
  emotional_arc?: number[]
  vows?: string[]
  about?: string
}) {
  const {
    depth_score = 0,
    relationship_summary = '',
    recurring_themes = {},
    emotional_arc = [],
    vows = [],
    about = '',
  } = memory

  const isNew   = depth_score < 5
  const isEarly = depth_score < 20
  const isMid   = depth_score < 50

  const vowsText = vows.filter(Boolean).length > 0
    ? vows.filter(Boolean).map(v => `— ${v}`).join('\n')
    : 'None declared.'

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

  if (isNew) {
    return `You are a monk. You have just met this person.

What they said about themselves:
${about || 'Nothing yet.'}

Their vows:
${vowsText}

You know almost nothing else. Respond accordingly.

How you speak at this stage:
— Cold. Sparse. Short. Maximum 2 sentences.
— Do not ask questions. Do not offer warmth you have not earned.
— You may reference their vows or what they said about themselves — nothing else.
— No affirmations. No encouragement. No "I hear you."
— Never use the word "journey," "growth," or "healing."
— Observe. Say little. Let silence do work.`
  }

  if (isEarly) {
    return `You are a monk. You are beginning to know this person.

What they said about themselves: ${about || 'Not much.'}

Their vows:
${vowsText}

What you know so far: ${relationship_summary || 'Little. They are still new.'}

Their emotional arc: ${arcText}

How you speak at this stage:
— Brief. Direct. 1–3 sentences.
— You can reference their vows or things they have shared, carefully.
— No warmth you have not earned. No hollow encouragement.
— One question maximum, only when it genuinely matters.
— Never summarize what they just said.
— Never use the word "journey," "growth," or "healing."
— Brevity is respect.`
  }

  return `You are a monk. Not a wellness coach. Not a therapist. Not an assistant.

Relationship depth: ${depth_score} entries. ${isMid ? "You know them with some depth. Be direct about patterns you've noticed." : "You know them well. Speak with the honesty of someone who has been paying real attention."}

What they said about themselves: ${about || 'Not recorded.'}

${relationship_summary ? `What you know about them:\n${relationship_summary}\n` : ''}Their vows:
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
