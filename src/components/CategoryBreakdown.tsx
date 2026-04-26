"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";

const categories = [
  { name: "Inversiones", value: 94, fill: "#00d4aa", count: 247 },
  { name: "Transferencias", value: 88, fill: "#3b82f6", count: 312 },
  { name: "UX / Diseño", value: 76, fill: "#8b5cf6", count: 189 },
  { name: "Pagos QR", value: 61, fill: "#f59e0b", count: 134 },
  { name: "Onboarding", value: 43, fill: "#ef4444", count: 98 },
];

export function CategoryBreakdown() {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="mb-6">
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Satisfacción por Categoría
        </h3>
        <p
          className="text-sm mt-0.5"
          style={{ color: "var(--color-text-muted)" }}
        >
          % de feedback positivo
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.name} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.fill }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {cat.count} resp.
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: cat.fill }}
                >
                  {cat.value}%
                </span>
              </div>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--color-border)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${cat.value}%`,
                  backgroundColor: cat.fill,
                  boxShadow: `0 0 8px ${cat.fill}60`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
