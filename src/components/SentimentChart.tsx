"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Lun", positive: 42, neutral: 18, negative: 8 },
  { day: "Mar", positive: 58, neutral: 22, negative: 12 },
  { day: "Mié", positive: 51, neutral: 19, negative: 6 },
  { day: "Jue", positive: 67, neutral: 25, negative: 14 },
  { day: "Vie", positive: 73, neutral: 21, negative: 9 },
  { day: "Sáb", positive: 89, neutral: 30, negative: 11 },
  { day: "Dom", positive: 94, neutral: 28, negative: 7 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl border p-3 shadow-xl text-sm"
        style={{
          backgroundColor: "#1a2540",
          borderColor: "#1e2d45",
          color: "#f1f5f9",
        }}
      >
        <p className="font-semibold mb-2">{label}</p>
        {payload.map(
          (entry: { name: string; value: number; color: string }, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span style={{ color: "#94a3b8" }}>{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          )
        )}
      </div>
    );
  }
  return null;
};

export function SentimentChart() {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Tendencia de Sentimiento
          </h3>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            Últimos 7 días
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {[
            { label: "Positivo", color: "#00d4aa" },
            { label: "Neutral", color: "#f59e0b" },
            { label: "Negativo", color: "#ef4444" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span style={{ color: "var(--color-text-secondary)" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#475569", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#1e2d45" }} />
          <Area
            type="monotone"
            dataKey="positive"
            name="Positivo"
            stroke="#00d4aa"
            strokeWidth={2}
            fill="url(#colorPositive)"
            dot={false}
            activeDot={{ r: 5, fill: "#00d4aa" }}
          />
          <Area
            type="monotone"
            dataKey="neutral"
            name="Neutral"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#colorNeutral)"
            dot={false}
            activeDot={{ r: 5, fill: "#f59e0b" }}
          />
          <Area
            type="monotone"
            dataKey="negative"
            name="Negativo"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#colorNegative)"
            dot={false}
            activeDot={{ r: 5, fill: "#ef4444" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
