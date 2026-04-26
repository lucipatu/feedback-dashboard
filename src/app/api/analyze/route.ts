import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// El cliente se inicializa con la key del servidor — nunca llega al browser
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const VALID_SENTIMENTS = ["positivo", "negativo", "neutral"] as const;
const VALID_CATEGORIES = [
  "UX / Diseño", "Performance", "Pricing",
  "Onboarding", "Features", "Bug", "General",
] as const;

export async function POST(req: NextRequest) {
  // 1. Validar input
  let text: string;
  try {
    const body = await req.json();
    text = String(body?.text ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  if (!text) {
    return NextResponse.json({ error: "El campo 'text' es requerido" }, { status: 400 });
  }

  // 2. Verificar que la API key esté configurada
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY no está configurada en el servidor" },
      { status: 500 }
    );
  }

  // 3. Llamar a Claude con el mismo prompt del componente original
  let raw: string;
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Analizá el siguiente feedback de usuario para una app fintech llamada CapyFi. Respondé ÚNICAMENTE con un JSON válido, sin backticks ni texto adicional, con este formato exacto:
{"sentiment":"positivo"|"negativo"|"neutral","category":"UX / Diseño"|"Performance"|"Pricing"|"Onboarding"|"Features"|"Bug"|"General","insight":"Una oración corta en español con el insight clave del feedback","score":número entre -100 y 100}
Feedback: "${text.replace(/"/g, "'")}"`,
        },
      ],
    });

    raw = message.content.find((b) => b.type === "text")?.text ?? "{}";
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error desconocido";
    console.error("[/api/analyze] Error llamando a Anthropic:", msg);
    return NextResponse.json(
      { error: `Error al llamar a Claude: ${msg}` },
      { status: 502 }
    );
  }

  // 4. Parsear y sanear la respuesta
  let analysis: Record<string, unknown>;
  try {
    // Limpia posibles backticks que Claude incluya a pesar del prompt
    const cleaned = raw.replace(/```json|```/g, "").trim();
    analysis = JSON.parse(cleaned);
  } catch {
    console.error("[/api/analyze] Respuesta no parseable:", raw);
    return NextResponse.json(
      { error: "Claude devolvió una respuesta que no es JSON válido" },
      { status: 502 }
    );
  }

  // 5. Validar valores antes de enviar al cliente
  const sentiment = VALID_SENTIMENTS.includes(analysis.sentiment as typeof VALID_SENTIMENTS[number])
    ? (analysis.sentiment as string)
    : "neutral";

  const category = VALID_CATEGORIES.includes(analysis.category as typeof VALID_CATEGORIES[number])
    ? (analysis.category as string)
    : "General";

  const insight = String(analysis.insight ?? "").slice(0, 300);

  const score = Math.max(-100, Math.min(100, Math.round(Number(analysis.score) || 0)));

  return NextResponse.json({ sentiment, category, insight, score });
}
