"use client";

import { Trash2 } from "lucide-react";
import { SENTIMENT_CONFIG, SOURCE_ICONS, type FeedbackItem } from "@/lib/feedbackData";

const MONO: React.CSSProperties = { fontFamily: "var(--font-dm-mono, 'DM Mono', monospace)" };

interface FeedbackCardProps {
  item: FeedbackItem;
  onDelete: () => void;
}

export function FeedbackCard({ item, onDelete }: FeedbackCardProps) {
  const sc = SENTIMENT_CONFIG[item.sentiment];
  const scoreAbs = Math.abs(item.score || 0);
  const isPositiveScore = item.score >= 0;

  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-3 transition-all duration-200 group"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
        borderLeft: `3px solid ${sc.text}`,
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-base" style={{ color: "var(--color-text-muted)" }}>
            {SOURCE_ICONS[item.source] ?? "◈"}
          </span>
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--color-text-muted)", ...MONO }}
          >
            {item.source}
          </span>
          <span style={{ color: "var(--color-border)" }}>·</span>
          <span className="text-xs" style={{ color: "var(--color-text-muted)", ...MONO }}>
            {item.date}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sentiment badge */}
          <span
            className="text-xs font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, ...MONO }}
          >
            {item.sentiment}
          </span>
          {/* Category badge */}
          <span
            className="text-xs px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: "var(--color-orange-dim)",
              color: "var(--color-orange)",
              border: "1px solid var(--color-orange-border)",
              ...MONO,
            }}
          >
            {item.category}
          </span>
          {/* Delete */}
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:text-red-400"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="Eliminar feedback"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Quote */}
      <p
        className="text-sm leading-relaxed"
        style={{ color: "#cccccc", fontFamily: "'Lora', Georgia, serif", fontStyle: "italic" }}
      >
        &ldquo;{item.text}&rdquo;
      </p>

      {/* Insight box */}
      <div
        className="rounded-lg px-3 py-2 text-xs leading-relaxed"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderLeft: "3px solid var(--color-orange)",
          color: "var(--color-text-secondary)",
          ...MONO,
        }}
      >
        💡 {item.insight}
      </div>

      {/* Score bar */}
      <div className="flex items-center gap-3">
        {/* Bar from center */}
        <div
          className="flex-1 h-1.5 rounded-full relative overflow-hidden"
          style={{ backgroundColor: "var(--color-border)" }}
        >
          <div
            className="h-full rounded-full absolute transition-all duration-500"
            style={{
              width: `${scoreAbs / 2}%`,
              backgroundColor: isPositiveScore ? "#22c55e" : "#ef4444",
              left: isPositiveScore ? "50%" : `${50 - scoreAbs / 2}%`,
            }}
          />
          {/* Center divider */}
          <div className="absolute left-1/2 top-0 w-px h-full bg-slate-600 opacity-50" />
        </div>
        <span
          className="text-xs shrink-0"
          style={{ color: "var(--color-text-muted)", ...MONO }}
        >
          score {item.score > 0 ? "+" : ""}{item.score}
        </span>
      </div>
    </div>
  );
}
