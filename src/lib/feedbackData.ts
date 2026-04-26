// Tipos y constantes centrales del sistema de feedback de CapyFi
// Basado en la lógica real del componente original

export const SOURCES = ["Twitter", "Discord", "Email / Form", "Otro"] as const;

// ── Categorías oficiales CapyFi ───────────────────────────────────────────────
export const CATEGORIES = [
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

// Color por categoría para gráficos
export const CATEGORY_COLORS: Record<string, string> = {
  "UX / Diseño":             "#8b5cf6",
  "Bug / problema técnico":  "#ef4444",
  "Onboarding":              "#3b82f6",
  "Depósitos / Retiros":     "#10b981",
  "Inversiones":             "#e8521a",
  "Monedas / Stablecoins":   "#f59e0b",
  "Confianza / Seguridad":   "#06b6d4",
  "Features":                "#22c55e",
  "Educación":               "#a855f7",
  "Sin clasificar":          "#6b7280",
};

// Mapeo de categorías legacy → oficiales (para normalizar feedbacks viejos)
export const CATEGORY_NORMALIZE_MAP: Record<string, string> = {
  "Bug":          "Bug / problema técnico",
  "Performance":  "Bug / problema técnico",
  "Pricing":      "Depósitos / Retiros",
  "Transferencias": "Depósitos / Retiros",
  "Pagos QR":     "Bug / problema técnico",
  "General":      "Sin clasificar",
};

export type Source = (typeof SOURCES)[number];
export type Category = (typeof CATEGORIES)[number];
export type Sentiment = "positivo" | "negativo" | "neutral";

export interface FeedbackItem {
  id: string;          // uuid de Supabase
  text: string;
  source: Source;
  date: string;        // fecha formateada (viene de created_at)
  sentiment: Sentiment;
  category: Category;
  insight: string;
  score: number;       // -100 a +100
}

export const SOURCE_ICONS: Record<Source, string> = {
  Twitter: "𝕏",
  Discord: "⌬",
  "Email / Form": "✉",
  Otro: "◈",
};

export const SENTIMENT_CONFIG = {
  positivo: {
    bg: "rgba(34,197,94,0.08)",
    text: "#22c55e",
    border: "rgba(34,197,94,0.25)",
    label: "Positivo",
    chartColor: "#22c55e",
  },
  negativo: {
    bg: "rgba(239,68,68,0.08)",
    text: "#ef4444",
    border: "rgba(239,68,68,0.25)",
    label: "Negativo",
    chartColor: "#ef4444",
  },
  neutral: {
    bg: "rgba(107,142,245,0.08)",
    text: "#6b8ef5",
    border: "rgba(107,142,245,0.25)",
    label: "Neutral",
    chartColor: "#6b8ef5",
  },
} satisfies Record<Sentiment, object>;

// ── Datos mock (fallback si Supabase no responde) ────────────────────────────
export const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: "mock-1",
    text: "La app es increíble. Las transferencias son instantáneas y la interfaz es súper intuitiva. ¡La mejor fintech que usé!",
    source: "Twitter",
    date: "25 abr 2026",
    sentiment: "positivo",
    category: "UX / Diseño",
    insight: "Alta satisfacción con la velocidad de transferencias y usabilidad.",
    score: 92,
  },
  {
    id: "mock-2",
    text: "Tuve problemas para verificar mi identidad. El proceso tardó 3 días y el soporte no me respondió a tiempo.",
    source: "Email / Form",
    date: "25 abr 2026",
    sentiment: "negativo",
    category: "Onboarding",
    insight: "Fricción crítica en verificación de identidad y soporte lento.",
    score: -74,
  },
  {
    id: "mock-3",
    text: "Me encanta el diseño y la facilidad de uso. Solo mejoraría las notificaciones push, a veces llegan tarde.",
    source: "Discord",
    date: "24 abr 2026",
    sentiment: "positivo",
    category: "Features",
    insight: "Elogio al diseño con punto de mejora en notificaciones push.",
    score: 61,
  },
  {
    id: "mock-4",
    text: "La app se cierra sola cuando intento pagar con QR en negocios. Pasó tres veces esta semana.",
    source: "Twitter",
    date: "24 abr 2026",
    sentiment: "negativo",
    category: "Bug / problema técnico",
    insight: "Bug crítico recurrente en pagos QR que impacta la experiencia de pago.",
    score: -85,
  },
  {
    id: "mock-5",
    text: "Excelente la función de inversiones automáticas. El rendimiento está muy por encima de los bancos tradicionales.",
    source: "Email / Form",
    date: "23 abr 2026",
    sentiment: "positivo",
    category: "Features",
    insight: "Inversiones automáticas percibidas como diferencial competitivo clave.",
    score: 88,
  },
  {
    id: "mock-6",
    text: "La comisión del 1.5% en transferencias internacionales me parece alta comparado con otras opciones del mercado.",
    source: "Discord",
    date: "23 abr 2026",
    sentiment: "negativo",
    category: "Depósitos / Retiros",
    insight: "Precio de transferencias internacionales percibido como poco competitivo.",
    score: -42,
  },
  {
    id: "mock-7",
    text: "Funciona bien en general pero la app tarda bastante en cargar el saldo cuando entro por la mañana.",
    source: "Twitter",
    date: "22 abr 2026",
    sentiment: "neutral",
    category: "Bug / problema técnico",
    insight: "Latencia en carga de saldo durante horario pico matutino.",
    score: -18,
  },
  {
    id: "mock-8",
    text: "El onboarding mejoró mucho desde la última actualización. Ahora verificar la cuenta tarda 10 minutos.",
    source: "Discord",
    date: "22 abr 2026",
    sentiment: "positivo",
    category: "Onboarding",
    insight: "Mejora significativa percibida en velocidad de verificación post-update.",
    score: 76,
  },
  {
    id: "mock-9",
    text: "Estaría bueno poder programar pagos recurrentes. Ahora tengo que hacerlos manualmente todos los meses.",
    source: "Email / Form",
    date: "21 abr 2026",
    sentiment: "neutral",
    category: "Features",
    insight: "Demanda clara de pagos automáticos recurrentes como feature prioritario.",
    score: 5,
  },
  {
    id: "mock-10",
    text: "El modo oscuro se ve genial. Ojalá tuvieran también widgets para la pantalla de inicio del celular.",
    source: "Twitter",
    date: "21 abr 2026",
    sentiment: "positivo",
    category: "UX / Diseño",
    insight: "Diseño valorado positivamente; demanda de widgets como extensión natural.",
    score: 55,
  },
  {
    id: "mock-11",
    text: "Me bloquearon la cuenta sin previo aviso y llevo 2 días sin poder acceder. Necesito mi dinero urgente.",
    source: "Email / Form",
    date: "20 abr 2026",
    sentiment: "negativo",
    category: "Confianza / Seguridad",
    insight: "Bloqueo de cuenta sin notificación genera situación crítica para el usuario.",
    score: -96,
  },
  {
    id: "mock-12",
    text: "La tasa de ahorro del 9% anual es muy competitiva. Moví todos mis ahorros acá desde el banco.",
    source: "Discord",
    date: "20 abr 2026",
    sentiment: "positivo",
    category: "Inversiones",
    insight: "Tasa de ahorro percibida como diferencial que impulsa migración desde bancos.",
    score: 90,
  },
];

// ── Funciones de lógica derivada ──────────────────────────────────────────────

export function computeStats(items: FeedbackItem[]) {
  const total = items.length;
  const byS = (s: Sentiment) => items.filter((i) => i.sentiment === s).length;
  const avgScore = total
    ? Math.round(items.reduce((a, b) => a + (b.score || 0), 0) / total)
    : 0;

  const catCount: Record<string, number> = {};
  items.forEach((i) => {
    catCount[i.category] = (catCount[i.category] || 0) + 1;
  });
  const topCat =
    Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return { total, avgScore, topCat, byS };
}

export function filterItems(
  items: FeedbackItem[],
  filterSent: Sentiment | "todos",
  filterCat: Category | "todas"
) {
  return items
    .filter((i) => filterSent === "todos" || i.sentiment === filterSent)
    .filter((i) => filterCat === "todas" || i.category === filterCat);
  // El orden lo maneja Supabase (created_at desc); para mock ya vienen ordenados
}

// ── Mapper: fila de Supabase → FeedbackItem ───────────────────────────────────
export function mapSupabaseRow(row: {
  id: string;
  created_at: string;
  text: string;
  source: string;
  sentiment: string;
  category: string;
  insight: string;
  score: number;
}): FeedbackItem {
  return {
    id: row.id,
    text: row.text,
    source: row.source as Source,
    date: new Date(row.created_at).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    sentiment: row.sentiment as Sentiment,
    // Normalizar categorías legacy a las oficiales
    category: (CATEGORY_NORMALIZE_MAP[row.category] ?? row.category) as Category,
    insight: row.insight,
    score: row.score,
  };
}

export function exportCSV(items: FeedbackItem[]) {
  const h = ["Fecha", "Fuente", "Sentimiento", "Categoría", "Score", "Insight", "Feedback"];
  const rows = items.map((i) => [
    i.date,
    i.source,
    i.sentiment,
    i.category,
    i.score,
    `"${(i.insight || "").replace(/"/g, '""')}"`,
    `"${(i.text || "").replace(/"/g, '""')}"`,
  ]);
  const csv = [h, ...rows].map((r) => r.join(",")).join("\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
  );
  Object.assign(document.createElement("a"), {
    href: url,
    download: `capyfi-feedback-${new Date().toISOString().slice(0, 10)}.csv`,
  }).click();
  URL.revokeObjectURL(url);
}

export function exportExcel(items: FeedbackItem[]) {
  const esc = (s: unknown) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const cols = ["Fecha", "Fuente", "Sentimiento", "Categoría", "Score", "Insight", "Feedback"];
  const rows = items.map((i) => [
    i.date, i.source, i.sentiment, i.category, i.score, i.insight, i.text,
  ]);
  const xml = `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="H"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#141d2f" ss:Pattern="Solid"/></Style></Styles><Worksheet ss:Name="Feedback"><Table><Row>${cols.map((c) => `<Cell ss:StyleID="H"><Data ss:Type="String">${esc(c)}</Data></Cell>`).join("")}</Row>${rows.map((r) => `<Row>${r.map((v) => `<Cell><Data ss:Type="String">${esc(v)}</Data></Cell>`).join("")}</Row>`).join("")}</Table></Worksheet></Workbook>`;
  const url = URL.createObjectURL(
    new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8;" })
  );
  Object.assign(document.createElement("a"), {
    href: url,
    download: `capyfi-feedback-${new Date().toISOString().slice(0, 10)}.xls`,
  }).click();
  URL.revokeObjectURL(url);
}
