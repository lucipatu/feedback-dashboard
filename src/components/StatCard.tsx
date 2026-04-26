"use client";

import { TrendingUp, TrendingDown, MessageSquare, ThumbsUp, Star, AlertCircle } from "lucide-react";

const iconMap = {
  MessageSquare,
  ThumbsUp,
  Star,
  AlertCircle,
} as const;

export type IconName = keyof typeof iconMap;

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  iconName: IconName;
  accentColor: string;
  bgGradient: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  iconName,
  accentColor,
  bgGradient,
}: StatCardProps) {
  const isPositive = change >= 0;
  const Icon = iconMap[iconName];

  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Background gradient glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: bgGradient }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p
              className="text-sm font-medium tracking-wide uppercase"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {title}
            </p>
            <h2
              className="text-3xl font-bold mt-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              {value}
            </h2>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            <Icon size={22} />
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          {isPositive ? (
            <TrendingUp size={14} className="text-emerald-400" />
          ) : (
            <TrendingDown size={14} className="text-red-400" />
          )}
          <span
            className={`text-sm font-semibold ${
              isPositive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
          <span
            className="text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            {changeLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
