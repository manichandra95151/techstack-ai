import { jsonrepair } from "jsonrepair";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL_PRIORITY = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "groq/compound-mini",
];

export async function POST(req: Request) {
  try {
    const { projectIdea, stackType, technologies } = await req.json();

    const techList = Object.entries(technologies)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    const prompt = `
You are a senior software architect. Output ONLY valid JSON (no markdown).
If unsure, infer standard SaaS / mobile / AI app architecture.

RULES:
- NEVER leave arrays empty.
- MUST provide a comprehensive Feature List.
- MUST provide a detailed Build Breakdown (step-by-step guide).
- MUST provide a complete list of API Endpoints.
- MUST provide curated Learning Resources (YouTube & Docs).
- MUST provide 5 distinct Mermaid diagrams for the architecture.
- MUST be practical + realistic.
- NEVER invent fake libraries.

MERMAID SYNTAX RULES (CRITICAL):
- Use standard Mermaid syntax.
- **DO NOT** use special characters like '>', '<', '(', ')' inside arrow labels.
- **BAD**: A -->|Request|> B
- **GOOD**: A -->|Request| B
- **BAD**: A[Client (Mobile)]
- **GOOD**: A["Client (Mobile)"]
- Always quote node labels if they contain spaces or special chars.
- Ensure the diagram type (e.g., "graph TD", "sequenceDiagram") is the first line of the string.

RETURN JSON EXACTLY LIKE THIS:

{
  "featureList": [
    {
      "name": "",
      "description": "",
      "complexity": "Low | Medium | High"
    }
  ],
  "buildBreakdown": [
    {
      "step": 1,
      "title": "",
      "description": "",
      "tasks": ["", ""]
    }
  ],
  "apiEndpoints": [
    {
      "method": "GET | POST | PUT | DELETE",
      "endpoint": "/api/...",
      "description": "",
      "requestBody": {},
      "responseBody": {}
    }
  ],
  "resources": {
    "youtube": [
      { "title": "", "url": "" }
    ],
    "docs": [
      { "title": "", "url": "" }
    ]
  },
  "diagrams": {
    "highLevel": "graph TD...",
    "requestFlow": "sequenceDiagram...",
    "deployment": "graph TD...",
    "apiGateway": "graph TD...",
    "databaseErd": "erDiagram..."
  }
}

DIAGRAM INSTRUCTIONS:
1. **highLevel**: High-level system architecture (Client -> CDN -> LB -> App -> DB).
2. **requestFlow**: Sequence diagram of a core user flow (e.g., Login or Create Item).
3. **deployment**: Deployment diagram (Vercel/AWS/Docker containers).
4. **apiGateway**: API Gateway routing logic.
5. **databaseErd**: Entity Relationship Diagram for the core entities.

PROJECT:
Idea: ${projectIdea}
Selected Stack: ${stackType}
Technologies: ${techList}

Generate COMPLETE and ACCURATE technical specification.
`;

    let finalJSON: any = null;

    /* Try all models with retries */
    for (const model of MODEL_PRIORITY) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const resp = await client.chat.completions.create({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
            max_tokens: 8000,
          });

          let content = resp.choices?.[0]?.message?.content ?? "";
          if (!content) continue;

          content = content.replace(/```json/gi, "").replace(/```/g, "").trim();

          const start = content.indexOf("{");
          const end = content.lastIndexOf("}");
          if (start === -1 || end === -1) continue;

          let repaired = "";
          try {
            repaired = jsonrepair(content.slice(start, end + 1));
          } catch {
            continue;
          }

          let parsed: any;
          try {
            parsed = JSON.parse(repaired);
          } catch {
            continue;
          }

          if (!parsed?.featureList?.length) continue;
          if (!parsed?.buildBreakdown?.length) continue;
          if (!parsed?.apiEndpoints?.length) continue;
          if (!parsed?.resources?.youtube?.length) continue;
          if (!parsed?.diagrams?.highLevel) continue;

          finalJSON = parsed;
          break;
        } catch {
          console.log(`Model ${model} attempt ${attempt} failed`);
        }
      }

      if (finalJSON) break;
    }

    if (!finalJSON) {
      return NextResponse.json(
        { error: "All models failed to generate roadmap." },
        { status: 500 }
      );
    }

    return NextResponse.json(finalJSON);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
