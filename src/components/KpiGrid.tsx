"use client";

import { StatCard } from "@/components/StatCard";

export function KpiGrid() {
  return (
    <section
      aria-label="Métricas principales"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      <StatCard
        title="Total Respuestas"
        value="2,847"
        change={12.4}
        changeLabel="vs semana pasada"
        iconName="MessageSquare"
        accentColor="#3b82f6"
        bgGradient="radial-gradient(circle at top right, rgba(59,130,246,0.08), transparent 60%)"
      />
      <StatCard
        title="Satisfacción"
        value="87.3%"
        change={3.1}
        changeLabel="vs semana pasada"
        iconName="ThumbsUp"
        accentColor="#00d4aa"
        bgGradient="radial-gradient(circle at top right, rgba(0,212,170,0.08), transparent 60%)"
      />
      <StatCard
        title="Rating Promedio"
        value="4.6 / 5"
        change={0.2}
        changeLabel="vs semana pasada"
        iconName="Star"
        accentColor="#f59e0b"
        bgGradient="radial-gradient(circle at top right, rgba(245,158,11,0.08), transparent 60%)"
      />
      <StatCard
        title="Problemas Abiertos"
        value="34"
        change={-18.2}
        changeLabel="vs semana pasada"
        iconName="AlertCircle"
        accentColor="#ef4444"
        bgGradient="radial-gradient(circle at top right, rgba(239,68,68,0.08), transparent 60%)"
      />
    </section>
  );
}
