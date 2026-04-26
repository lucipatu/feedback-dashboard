"use client";

import { useState } from "react";
import { Info } from "lucide-react";

const MONO: React.CSSProperties = { fontFamily: "var(--font-dm-mono, 'DM Mono', monospace)" };
const SYNE: React.CSSProperties = { fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" };

interface ScoreGaugeProps {
  avgScore: number;
  topCat: string;
}

export function ScoreGauge({ avgScore, topCat }: ScoreGaugeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const sem =
    avgScore >= 30
      ? { color: "var(--color-green)", bg: "var(--color-green-dim)", border: "var(--color-green-border)", label: "Bueno", dot: "🟢" }
      : avgScore >= -20
      ? { color: "var(--color-orange)", bg: "var(--color-orange-dim)", border: "var(--color-orange-border)", label: "Neutro", dot: "🟡" }
      : { color: "var(--color-red)", bg: "var(--color-red-dim)", border: "var(--color-red-border)", label: "Crítico", dot: "🔴" };

  return (
    <div
      className="rounded-xl border p-5 relative overflow-visible"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
        borderLeft: `3px solid ${sem.color}`,
      }}
    >
      {/* Label + tooltip trigger */}
      <div className="flex items-center gap-2 mb-3">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--color-text-muted)", ...MONO }}>
          Score promedio
        </p>
        <div className="relative">
          <button
            className="w-4 h-4 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: "var(--color-bg-secondary)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label="¿Cómo se calcula el score?"
          >
            <Info size={9} />
          </button>

          {showTooltip && (
            <div
              className="absolute top-full mt-2 left-0 z-50 rounded-xl p-3 w-64 shadow-2xl text-xs"
              style={{
                backgroundColor: "#111",
                border: "1px solid var(--color-border-2)",
                color: "#bbb",
                ...MONO,
                lineHeight: 1.7,
              }}
            >
              <div className="font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>¿Cómo se calcula?</div>
              <div>Claude asigna a cada feedback un score de <span style={{ color: "var(--color-orange)" }}>-100 a +100</span> según la intensidad del sentimiento:</div>
              <div className="mt-2 flex flex-col gap-1">
                <div><span style={{ color: "#22c55e" }}>+100</span> → muy positivo</div>
                <div><span style={{ color: "#f59e0b" }}>   0</span> → completamente neutro</div>
                <div><span style={{ color: "#ef4444" }}>-100</span> → muy negativo</div>
              </div>
              <div className="mt-2 pt-2" style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>
                El promedio es la suma de todos los scores dividido la cantidad de feedbacks.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score value + badge */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-5xl font-extrabold" style={{ color: "var(--color-text-primary)", lineHeight: 1, ...SYNE }}>
          {avgScore > 0 ? "+" : ""}{avgScore}
        </span>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
          style={{ backgroundColor: sem.bg, color: sem.color, border: `1px solid ${sem.border}`, ...MONO }}
        >
          <span style={{ fontSize: 9 }}>{sem.dot}</span>
          {sem.label}
        </span>
      </div>

      <p className="text-xs" style={{ color: "var(--color-text-muted)", ...MONO }}>
        Top tema: <span style={{ color: "var(--color-text-secondary)" }}>{topCat}</span>
      </p>
    </div>
  );
}
