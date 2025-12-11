import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

// Initialize Anthropic with validated API key (optional feature)
const anthropic = env.ai.anthropicApiKey
  ? new Anthropic({
      apiKey: env.ai.anthropicApiKey,
    })
  : null;

export async function POST(req: Request) {
  try {
    // Check if Anthropic API is configured
    if (!anthropic) {
      return NextResponse.json(
        {
          error: "AI item generation is not configured. Please set ANTHROPIC_API_KEY environment variable.",
        },
        { status: 503 }
      );
    }

    // Check for valid session
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { standard, topic, count = 3 } = await req.json();

    // -------------------------------------------------------
    // CLAUDE PROMPT ENGINEERING
    // -------------------------------------------------------
    const systemPrompt = `You are an expert Biology Assessment Developer for Georgia High Schools.
    Your task is to generate valid JSON arrays of multiple-choice questions based on the Georgia Standards of Excellence (GSE).
    Output ONLY raw JSON. Do not include markdown formatting, backticks, or introductory text.`;

    const userPrompt = `Generate ${count} multiple-choice questions for Georgia Standard: "${standard}" covering the topic: "${topic}".

    The JSON structure must be an array of objects with these exact keys:
    - content: The question text (clear, academic language, suitable for High School Biology).
    - options: An array of 4 distinct answer strings.
    - correctAnswer: The string matching the correct option exactly.
    - difficulty_b: A float between -3.0 (Very Easy) and 3.0 (Very Hard) representing estimated IRT difficulty.
    - discrimination_a: A float between 0.5 and 2.5 representing how well it discriminates ability.
    - feedback: A short explanation (1-2 sentences) of why the correct answer is right.`;

    // 3. Call Claude
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2048,
      temperature: 0.2,
      system: systemPrompt,
      messages: [
        { role: "user", content: userPrompt }
      ]
    });

    // 4. Parse Response
    const textBlock = msg.content[0];
    if (textBlock.type !== 'text') {
        throw new Error("Unexpected response from Claude");
    }

    const text = textBlock.text;
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let items;
    try {
        items = JSON.parse(cleanJson);
    } catch (e) {
        console.error("JSON Parse Failed:", text);
        return NextResponse.json({ error: "Failed to generate valid JSON." }, { status: 500 });
    }

    // 5. Save to Database
    const createdItems = [];
    for (const item of items) {
      if (!item.content || !item.options || !item.correctAnswer) continue;

      const newItem = await db.item.create({
        data: {
          standard: standard,
          content: item.content,
          options: JSON.stringify(item.options),
          correctAnswer: item.correctAnswer,
          difficulty_b: item.difficulty_b || 0.0,
          discrimination_a: item.discrimination_a || 1.0,
          guessing_c: 0.25,
          feedback: item.feedback
        }
      });
      createdItems.push(newItem);
    }

    return NextResponse.json({ success: true, count: createdItems.length, items: createdItems });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
