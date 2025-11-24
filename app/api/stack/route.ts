import { jsonrepair } from "jsonrepair";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// FINAL ROBUST MODELS LIST (BEST → fallback)
const MODEL_PRIORITY = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "groq/compound-mini",
];

export async function POST(req: Request) {
  try {
    const { projectIdea, knownTechnologies, scalability, complexity } =
      await req.json();

    const prompt = `
IMPORTANT: ALWAYS return valid JSON only. Never output markdown.
If unsure, infer technologies from typical SaaS, chatbots, AI apps.

RULES:
- NEVER leave frontend/backend/database arrays empty.
- ALWAYS propose at least 2 frontend, 2 backend, and 2 database technologies.
- If idea is vague, infer the closest architecture.
- Incorporate known technologies from the user when possible.
- Always fill pros, cons, cost, difficulty.
- Never output tools that do not exist.

SCHEMA TO FOLLOW EXACTLY:
{
  "beginner": {
    "name": "",
    "technologies": {
      "frontend": [],
      "backend": [],
      "database": [],
      "hosting": [],
      "other": []
    },
    "pros": [],
    "cons": [],
    "estimatedTime": "",
    "estimatedCost": "",
    "difficulty": ""
  },
  "mvp": {...},
  "enterprise": {...},
  "budget": {...}
}

PROJECT DETAILS:
Idea: ${projectIdea}
Known Technologies: ${knownTechnologies.join(", ")}
Scalability: ${scalability}
Complexity: ${complexity}
`;

    let finalJSON: any = null;

    // TRY MODELS IN ORDER (robust mode)
    for (const model of MODEL_PRIORITY) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const resp = await client.chat.completions.create({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
            max_tokens: 4000,
          });

          let content = resp.choices?.[0]?.message?.content ?? "";
          if (!content) continue;

          // Clean content (remove code fences)
          content = content.replace(/```json/gi, "").replace(/```/g, "").trim();

          // Extract JSON safely
          const s = content.indexOf("{");
          const e = content.lastIndexOf("}");
          if (s === -1 || e === -1) continue;

          let repaired = "";
          try {
            repaired = jsonrepair(content.slice(s, e + 1));
          } catch {
            continue;
          }

          let parsed: any;
          try {
            parsed = JSON.parse(repaired);
          } catch {
            continue;
          }

          // VALIDATION: ensure ALL stack arrays have values
          const keys = ["beginner", "mvp", "enterprise", "budget"];
          const requiredArrays = ["frontend", "backend", "database"];

          let valid = true;

          for (const k of keys) {
            for (const arr of requiredArrays) {
              if (!parsed?.[k]?.technologies?.[arr]?.length) {
                valid = false;
                break;
              }
            }
          }

          if (!valid) {
            console.log(`⚠ Model ${model} attempt ${attempt} → INVALID STACK`);
            continue;
          }

          finalJSON = parsed;
          break;
        } catch (e) {
          console.log(`⚠ Model ${model} attempt ${attempt} failed`);
        }
      }

      if (finalJSON) break;
    }

    if (!finalJSON) {
      return NextResponse.json(
        { error: "All models failed to generate valid stacks" },
        { status: 500 }
      );
    }

    return NextResponse.json(finalJSON);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
