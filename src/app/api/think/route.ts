import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY not set" }, { status: 500 });
  }

  const { messages } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a calm, thoughtful thinking partner. The user shares raw ideas, thoughts, and observations. Respond with sharp, minimal insight — one or two sentences at most. No filler. Help them think deeper, not more.",
      },
      ...messages,
    ],
    max_tokens: 200,
  });

  const reply = completion.choices[0]?.message?.content ?? "";
  return NextResponse.json({ reply });
}
