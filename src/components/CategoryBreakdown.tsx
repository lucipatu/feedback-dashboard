"use client";

import { useMemo } from "react";
import { CATEGORY_COLORS, type FeedbackItem } from "@/lib/feedbackData";

const MONO: React.CSSProperties = { fontFamily: "var(--font-dm-mono, 'DM Mono', monospace)" };

interface CategoryBreakdownProps {
  items: FeedbackItem[];
}

export function CategoryBreakdown({ items }: CategoryBreakdownProps) {
  // Calcular stats por categoría desde los items reales
  const catStats = useMemo(() => {
    const map: Record<string, { total: number; positivos: number }> = {};

    for (const item of items) {
      if (!map[item.category]) {
        map[item.category] = { total: 0, positivos: 0 };
      }
      map[item.category].total++;
      if (item.sentiment === "positivo") {
        map[item.category].positivos++;
      }
    }

    return Object.entries(map)
      .map(([name, { total, positivos }]) => ({
        name,
        total,
        pct: total > 0 ? Math.round((positivos / total) * 100) : 0,
        color: CATEGORY_COLORS[name] ?? "#6b7280",
      }))
      .sort((a, b) => b.total - a.total); // ordenar por cantidad de feedbacks desc
  }, [items]);

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}
    >
      {/* Header */}
      <div className="mb-5">
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Satisfacción por Categoría
        </h3>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)", ...MONO }}>
          % de feedback positivo · {items.length} registros totales
        </p>
      </div>

      {/* Estado vacío */}
      {catStats.length === 0 ? (
        <div
          className="rounded-xl border border-dashed py-10 text-center"
          style={{ borderColor: "var(--color-border-2)", color: "var(--color-text-muted)" }}
        >
          <div className="text-3xl mb-2">📂</div>
          <p className="text-sm" style={MONO}>
            Sin datos todavía. Agregá feedback para ver el desglose.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {catStats.map((cat) => (
            <div key={cat.name} className="group">
              {/* Fila de labels */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {cat.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: "var(--color-text-muted)", ...MONO }}>
                    {cat.total} {cat.total === 1 ? "resp." : "resp."}
                  </span>
                  <span
                    className="text-sm font-semibold w-10 text-right"
                    style={{ color: cat.color, ...MONO }}
                  >
                    {cat.pct}%
                  </span>
                </div>
              </div>

              {/* Barra de progreso */}
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--color-border)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${cat.pct}%`,
                    backgroundColor: cat.color,
                    boxShadow: `0 0 8px ${cat.color}60`,
                    minWidth: cat.pct > 0 ? "4px" : "0",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
