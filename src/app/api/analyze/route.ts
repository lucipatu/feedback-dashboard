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
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  const isPlaceholder = !apiKey || apiKey === "tu-api-key-de-anthropic-acá" || apiKey.includes("your-api-key");

  // Log de diagnóstico
  console.log(TAG, "ANTHROPIC_API_KEY state:", isPlaceholder ? "PLACEHOLDER/MISSING" : "CONFIGURED");

  if (isPlaceholder) {
    console.error(TAG, "ANTHROPIC_API_KEY no está configurada correctamente");
    return NextResponse.json(
      {
        error: "Configuración incompleta",
        detail: "La API Key de Anthropic no está configurada en .env.local o es el valor por defecto.",
        code: "MISSING_API_KEY",
      },
      { status: 401 }
    );
  }

  // ── 3. Crear cliente dentro del handler (evita problemas de inicialización en Vercel) ──
  const anthropic = new Anthropic({ apiKey });

  // ── 4. Llamar a Claude ──────────────────────────────────────────────────────
  let raw: string;
  try {
    console.log(TAG, "Calling Claude model: claude-sonnet-4-6");

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Sos un asistente que analiza feedback de usuarios de CapyFi, una app fintech latinoamericana.

Analizá el siguiente feedback y respondé SOLO con un objeto JSON válido, sin texto adicional, sin backticks, sin explicaciones.

Formato de respuesta requerido:
{
  "sentiment": "<uno de: positivo, negativo, neutral>",
  "category": "<una de las categorías listadas abajo>",
  "insight": "<una oración en español con el insight clave, máximo 120 caracteres>",
  "score": <entero entre -100 y 100, donde -100 es muy negativo y 100 es muy positivo>
}

Categorías válidas (usá exactamente este texto, sin cambios):
- UX / Diseño
- Bug / problema técnico
- Onboarding
- Depósitos / Retiros
- Inversiones
- Monedas / Stablecoins
- Confianza / Seguridad
- Features
- Educación
- Sin clasificar

Reglas:
- sentiment debe ser exactamente "positivo", "negativo" o "neutral"
- Si el feedback no encaja en ninguna categoría, usá "Sin clasificar"
- No uses categorías que no estén en la lista
- score debe ser coherente con el sentiment (negativo → score negativo, positivo → score positivo)

Ejemplo de respuesta correcta:
{"sentiment":"negativo","category":"Bug / problema técnico","insight":"La app se cierra al intentar pagar con QR.","score":-80}

Feedback a analizar: "${text.replace(/"/g, "'")}"`,
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
