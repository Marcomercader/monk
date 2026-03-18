import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const EVAL_PROMPT = `You are a silent observer of a spiritual conversation. Based on the conversation history provided, evaluate the user's overall wellbeing, self-awareness, and progress toward their stated goals.

Respond with ONLY a single digit from 1 to 5. Nothing else. No explanation. No punctuation. Just the number.

SCORING GUIDE:
1 — No goals shared, significant struggle, no self-awareness shown
2 — Goals mentioned but little progress, repeated setbacks, low engagement
3 — Some awareness, moderate progress, goals exist but inconsistent effort
4 — Clear goals, consistent effort, meaningful growth evident
5 — Deep self-awareness, strong progress across multiple areas, genuine transformation`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length < 2) {
      return NextResponse.json({ score: 3 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: EVAL_PROMPT },
        ...messages,
        { role: "user", content: "Based on everything shared, give me a single score from 1 to 5." },
      ],
      max_tokens: 2,
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "3";
    const score = Math.max(1, Math.min(5, parseInt(raw) || 3));
    return NextResponse.json({ score });
  } catch (err) {
    console.error("Evaluate error:", err);
    return NextResponse.json({ score: 3 });
  }
}
