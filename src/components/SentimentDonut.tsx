"use client";

import { useState } from "react";
import { SENTIMENT_CONFIG, type Sentiment } from "@/lib/feedbackData";
import type { FeedbackItem } from "@/lib/feedbackData";

interface SentimentDonutProps {
  items: FeedbackItem[];
}

export function SentimentDonut({ items }: SentimentDonutProps) {
  const [hovered, setHovered] = useState<Sentiment | null>(null);
  const total = items.length;

  const segs = (["positivo", "negativo", "neutral"] as Sentiment[])
    .map((key) => ({
      key,
      value: items.filter((i) => i.sentiment === key).length,
      color: SENTIMENT_CONFIG[key].chartColor,
      label: SENTIMENT_CONFIG[key].label,
    }))
    .filter((s) => s.value > 0);

  if (!total)
    return (
      <div
        className="flex items-center justify-center h-36 text-sm"
        style={{ color: "var(--color-text-muted)", fontFamily: "'DM Mono', monospace" }}
      >
        Sin datos aún
      </div>
    );

  const cx = 75, cy = 75, r = 64, ri = 38;
  let cum = -Math.PI / 2;
  const arcs = segs.map((seg) => {
    const frac = seg.value / total;
    const sa = cum, ea = cum + frac * 2 * Math.PI;
    cum = ea;
    const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
    const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
    const xi1 = cx + ri * Math.cos(sa), yi1 = cy + ri * Math.sin(sa);
    const xi2 = cx + ri * Math.cos(ea), yi2 = cy + ri * Math.sin(ea);
    return {
      ...seg, frac,
      path: `M${xi1} ${yi1}L${x1} ${y1}A${r} ${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${x2} ${y2}L${xi2} ${yi2}A${ri} ${ri} 0 ${frac > 0.5 ? 1 : 0} 0 ${xi1} ${yi1}Z`,
    };
  });
  const hov = hovered ? arcs.find((a) => a.key === hovered) : null;

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)", fontFamily: "'DM Mono', monospace" }}>
        Distribución de sentimiento
      </p>
      <div className="flex items-center gap-5">
        <svg width={150} height={150} viewBox="0 0 150 150" className="shrink-0">
          {arcs.map((a) => (
            <path
              key={a.key}
              d={a.path}
              fill={a.color}
              opacity={hovered && hovered !== a.key ? 0.2 : 1}
              style={{
                cursor: "pointer",
                transition: "opacity 0.2s, transform 0.2s",
                transformOrigin: `${cx}px ${cy}px`,
                transform: hovered === a.key ? "scale(1.06)" : "scale(1)",
              }}
              onMouseEnter={() => setHovered(a.key as Sentiment)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          <circle cx={cx} cy={cy} r={ri - 2} fill="var(--color-bg-card)" />
          <text x={cx} y={cy - 7} textAnchor="middle" style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 800, fill: "var(--color-text-primary)" }}>
            {hov ? hov.value : total}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, fill: "var(--color-text-muted)" }}>
            {hov ? hov.label.toLowerCase() : "total"}
          </text>
        </svg>

        <div className="flex flex-col gap-3 flex-1">
          {arcs.map((seg) => (
            <div
              key={seg.key}
              className="flex items-center gap-2 cursor-default transition-opacity duration-200"
              style={{ opacity: hovered && hovered !== seg.key ? 0.25 : 1 }}
              onMouseEnter={() => setHovered(seg.key as Sentiment)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: "var(--color-text-secondary)", fontFamily: "'DM Mono', monospace" }}>{seg.label}</span>
                  <span className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>{seg.value}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-border)" }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.round(seg.frac * 100)}%`, backgroundColor: seg.color }} />
                </div>
              </div>
              <span className="text-xs w-7 text-right" style={{ color: "var(--color-text-muted)", fontFamily: "'DM Mono', monospace" }}>
                {Math.round(seg.frac * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
