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
You are a principal software architect.

Your job is to generate **deep, production-grade technical documentation** including
multiple architecture diagrams using **accurate and strict Mermaid syntax**.

RETURN ONLY VALID JSON.
NO markdown.
NO commentary.

=========================
STRICT RULES
=========================

RULES:
- NEVER leave arrays empty.
- MUST provide a comprehensive Feature List.
- MUST provide a detailed Build Breakdown (step-by-step guide).
- MUST provide a complete list of API Endpoints.
- MUST provide curated Learning Resources (YouTube & Docs).
- MUST be practical + realistic.
- NEVER invent fake libraries.

▶ DIAGRAM QUALITY REQUIREMENTS
- All diagrams MUST be detailed + multi-layered.
- Use correct Mermaid syntax ONLY.
- All nodes must be labeled clearly.
- Use quotes for any node with spaces: A["API Gateway"]
- Avoid forbidden characters in arrows: NO >, <, (), {}
- Prefer multi-node chains over simple 2-box diagrams.
- Use 8–20 nodes per diagram (rich detail).

▶ DIAGRAM TYPES REQUIRED
You MUST generate **all 5 diagrams**, each detailed:

1. **highLevel**  
   - System architecture with multiple layers: Client layer, Delivery layer (CDN), Routing layer (API Gateway), Service layer (multiple services), Data layer (DB, Cache, Search).

2. **requestFlow** (sequenceDiagram)  
   - Show a complete request lifecycle (e.g., login, create item, submit form).
   - Include at least 5 actors: User → Client → API Gateway → Service → DB.

3. **deployment**  
   - Cloud deployment layout (Vercel, AWS Lambda, S3, RDS, Redis, Container cluster).
   - Show scaling groups, regions, replicas.

4. **apiGateway**  
   - Explain routing to different microservices.
   - Show request validation, rate limiting, auth middleware.

5. **databaseErd** (erDiagram)  
   - Include 5–10 tables.
   - Show relations: 1–N, N–N.
   - Include attributes + indexes.

=========================
STRUCTURE TO RETURN
=========================
{
  "featureList": [
    { "name": "", "description": "", "complexity": "Low | Medium | High" }
  ],
  "buildBreakdown": [
    { "step": 1, "title": "", "description": "", "tasks": ["", ""] }
  ],
  "apiEndpoints": [
    {
      "method": "",
      "endpoint": "",
      "description": "",
      "requestBody": {},
      "responseBody": {}
    }
  ],
  "resources": {
    "youtube": [{ "title": "", "url": "" }],
    "docs": [{ "title": "", "url": "" }]
  },
  "diagrams": {
    "highLevel": "",
    "requestFlow": "",
    "deployment": "",
    "apiGateway": "",
    "databaseErd": ""
  }
}

=========================
PROJECT INPUT
=========================
Idea: ${projectIdea}
Selected Stack: ${stackType}
Technologies: ${techList}

Generate a COMPLETE, ACCURATE, PRODUCTION-READY specification.
Ensure ALL diagrams are detailed, correct, and deeply structured.
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
