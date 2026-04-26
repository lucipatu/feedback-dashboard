import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const VALID_SENTIMENTS = ["positivo", "negativo", "neutral"] as const;
const VALID_CATEGORIES = [
  "UX / Diseño",
  "Bug / problema técnico",
  "Onboarding",
  "Depósitos / Retiros",
  "Inversiones",
  "Monedas / Stablecoins",
  "Confianza / Seguridad",
  "Features",
  "Educación",
  "Sin clasificar",
] as const;

export async function POST(req: NextRequest) {
  const TAG = "[/api/analyze]";

  // ── 1. Validar input ────────────────────────────────────────────────────────
  let text: string;
  try {
    const body = await req.json();
    text = String(body?.text ?? "").trim();
  } catch (e) {
    console.error(TAG, "Body JSON inválido:", e);
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  if (!text) {
    return NextResponse.json({ error: "El campo 'text' es requerido" }, { status: 400 });
  }

  // ── 2. Verificar API key ────────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Log de diagnóstico: nunca imprime la key real, solo su estado
  console.log(TAG, "ANTHROPIC_API_KEY present:", !!apiKey);
  console.log(TAG, "ANTHROPIC_API_KEY length:", apiKey?.length ?? 0);
  console.log(TAG, "ANTHROPIC_API_KEY prefix:", apiKey?.slice(0, 10) ?? "undefined");

  if (!apiKey) {
    console.error(TAG, "ANTHROPIC_API_KEY no está configurada");
    return NextResponse.json(
      {
        error: "ANTHROPIC_API_KEY no está configurada en el servidor",
        debug: { keyPresent: false },
      },
      { status: 500 }
    );
  }

  // ── 3. Crear cliente dentro del handler (evita problemas de inicialización en Vercel) ──
  const anthropic = new Anthropic({ apiKey });

  // ── 4. Llamar a Claude ──────────────────────────────────────────────────────
  let raw: string;
  try {
    console.log(TAG, "Calling Claude model: claude-3-5-sonnet-20241022");

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Analizá el siguiente feedback de usuario para una app fintech latinoamericana llamada CapyFi. Respondé ÚNICAMENTE con un JSON válido, sin backticks ni texto adicional, con este formato exacto:
{"sentiment":"positivo"|"negativo"|"neutral","category":"UX / Diseño"|"Bug / problema técnico"|"Onboarding"|"Depósitos / Retiros"|"Inversiones"|"Monedas / Stablecoins"|"Confianza / Seguridad"|"Features"|"Educación"|"Sin clasificar","insight":"Una oración corta en español con el insight clave del feedback","score":número entero entre -100 y 100}

Reglas:
- Usá SOLO las categorías listadas arriba, exactamente como están escritas.
- Si el feedback no encaja claramente en ninguna, usá "Sin clasificar".
- No inventes categorías nuevas.
- El score debe ser un entero: -100 (muy negativo) a +100 (muy positivo).

Feedback: "${text.replace(/"/g, "'")}"`,
        },
      ],
    });

    raw = message.content.find((b) => b.type === "text")?.text ?? "{}";
    console.log(TAG, "Claude raw response:", raw.slice(0, 200));

  } catch (err: unknown) {
    // Extraer todos los detalles del error de Anthropic
    const isAnthropicError = err instanceof Anthropic.APIError;
    const status = isAnthropicError ? err.status : undefined;
    const errName = isAnthropicError ? err.name : undefined;
    const msg = err instanceof Error ? err.message : String(err);

    console.error(TAG, "Anthropic API error:", {
      message: msg,
      status,
      name: errName,
      type: isAnthropicError ? err.error : undefined,
    });

    return NextResponse.json(
      {
        error: "Error al llamar a Claude",
        detail: msg,
        anthropicStatus: status,
        anthropicName: errName,
      },
      { status: 502 }
    );
  }

  // ── 5. Parsear respuesta ────────────────────────────────────────────────────
  let analysis: Record<string, unknown>;
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    analysis = JSON.parse(cleaned);
    console.log(TAG, "Parsed analysis:", JSON.stringify(analysis));
  } catch (e) {
    console.error(TAG, "JSON parse error. Raw:", raw, "Error:", e);
    return NextResponse.json(
      {
        error: "Claude devolvió una respuesta que no es JSON válido",
        rawResponse: raw.slice(0, 500),
      },
      { status: 502 }
    );
  }

  // ── 6. Validar y sanear valores ─────────────────────────────────────────────
  const sentiment = VALID_SENTIMENTS.includes(analysis.sentiment as typeof VALID_SENTIMENTS[number])
    ? (analysis.sentiment as string)
    : "neutral";

  const category = VALID_CATEGORIES.includes(analysis.category as typeof VALID_CATEGORIES[number])
    ? (analysis.category as string)
    : "Sin clasificar";

  const insight = String(analysis.insight ?? "").slice(0, 300);
  const score = Math.max(-100, Math.min(100, Math.round(Number(analysis.score) || 0)));

  console.log(TAG, "Final result:", { sentiment, category, score });

  return NextResponse.json({ sentiment, category, insight, score });
}
