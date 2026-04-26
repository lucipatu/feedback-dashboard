"use client";

import { useState, useCallback, useEffect } from "react";
import { Download, FileSpreadsheet, RefreshCw } from "lucide-react";
import {
  CATEGORIES, SOURCES, SENTIMENT_CONFIG, MOCK_FEEDBACK,
  computeStats, filterItems, exportCSV, exportExcel, mapSupabaseRow,
} from "@/lib/feedbackData";
import type { FeedbackItem, Sentiment, Category, Source } from "@/lib/feedbackData";
import { supabase } from "@/lib/supabase";
import { FeedbackCard } from "@/components/FeedbackCard";
import { ScoreGauge } from "@/components/ScoreGauge";
import { SentimentDonut } from "@/components/SentimentDonut";
import { SentimentChart } from "@/components/SentimentChart";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";

const SOURCE_ICONS: Record<Source, string> = {
  Twitter: "𝕏", Discord: "⌬", "Email / Form": "✉", Otro: "◈",
};

// ── Shared style helpers ──────────────────────────────────────────────────────
const MONO: React.CSSProperties = { fontFamily: "var(--font-dm-mono, 'DM Mono', monospace)" };
const SYNE: React.CSSProperties = { fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" };

const pillBtn = (active: boolean, activeColor?: string): React.CSSProperties => ({
  backgroundColor: active ? (activeColor ?? "var(--color-orange)") : "transparent",
  color: active ? "#fff" : "var(--color-text-muted)",
  border: active ? "none" : "1px solid var(--color-border)",
  borderRadius: 100,
  cursor: "pointer",
  transition: "all 0.15s",
  ...MONO,
});

const orangeBtn: React.CSSProperties = {
  backgroundColor: "var(--color-orange)",
  color: "#fff",
  border: "none",
  borderRadius: 100,
  cursor: "pointer",
  fontWeight: 700,
  transition: "background 0.15s",
};

const ghostBtn: React.CSSProperties = {
  backgroundColor: "transparent",
  color: "var(--color-text-muted)",
  border: "1px solid var(--color-border)",
  borderRadius: 100,
  cursor: "pointer",
  transition: "all 0.15s",
};

// ── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 animate-pulse">
      {/* Header placeholder */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-64 rounded-lg mb-2" style={{ backgroundColor: "var(--color-bg-card)" }} />
          <div className="h-4 w-32 rounded-lg" style={{ backgroundColor: "var(--color-bg-card)" }} />
        </div>
        <div className="h-9 w-36 rounded-full" style={{ backgroundColor: "var(--color-bg-card)" }} />
      </div>
      {/* KPI row placeholder */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl p-5 h-28" style={{ backgroundColor: "var(--color-bg-card)" }} />
        ))}
      </div>
      {/* Chart row placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 rounded-xl h-64" style={{ backgroundColor: "var(--color-bg-card)" }} />
        <div className="rounded-xl h-64" style={{ backgroundColor: "var(--color-bg-card)" }} />
      </div>
      {/* Cards placeholder */}
      <div className="flex flex-col gap-2.5 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl h-36" style={{ backgroundColor: "var(--color-bg-card)" }} />
        ))}
      </div>
    </div>
  );
}

// ── New Feedback form ─────────────────────────────────────────────────────────
function NewFeedbackForm({
  onBack,
  onSave,
}: {
  onBack: () => void;
  onSave: (data: Omit<FeedbackItem, "id" | "date">) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [source, setSource] = useState<Source>(SOURCES[0]);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualSentiment, setManualSentiment] = useState<Sentiment>("positivo");
  const [manualCategory, setManualCategory] = useState<Category>("General");
  const [manualInsight, setManualInsight] = useState("");
  const [manualScore, setManualScore] = useState(0);

  const handleSaveManual = async () => {
    if (!text.trim()) return;
    setSaving(true);
    setError(null);
    await onSave({
      text: text.trim(), source,
      sentiment: manualSentiment, category: manualCategory,
      insight: manualInsight || "Sin insight ingresado.", score: manualScore,
    });
    setSaving(false);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setAnalyzing(true); setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("API error");
      const analysis = await res.json();
      await onSave({ text: text.trim(), source, ...analysis });
    } catch {
      setError("No se pudo analizar con IA. Usá el modo manual.");
      setManualMode(true);
    }
    setAnalyzing(false);
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "var(--color-bg-secondary)", border: "1px solid var(--color-border)",
    color: "var(--color-text-primary)", borderRadius: 8, ...MONO, fontSize: 12,
  };

  const busy = saving || analyzing;

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold mb-1" style={{ color: "var(--color-text-primary)", ...SYNE }}>
          Nuevo feedback
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-muted)", ...MONO }}>
          {manualMode
            ? "Completá los campos manualmente."
            : "Claude va a analizar el sentimiento, categoría e insight automáticamente."}
        </p>
      </div>

      <div className="rounded-xl border p-6 flex flex-col gap-5"
        style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>

        {/* Source pills */}
        <div>
          <label className="block text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--color-text-muted)", ...MONO }}>Fuente</label>
          <div className="flex gap-2 flex-wrap">
            {SOURCES.map((s) => (
              <button key={s} onClick={() => setSource(s)} className="px-4 py-1.5 text-xs"
                style={pillBtn(source === s, "var(--color-orange)")}>
                {SOURCE_ICONS[s]} {s}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div>
          <label className="block text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--color-text-muted)", ...MONO }}>Feedback</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Pegá o escribí el feedback del usuario acá..." rows={5}
            className="w-full outline-none resize-vertical p-3 text-sm leading-relaxed"
            style={{ ...inputStyle, fontFamily: "var(--font-lora, 'Lora', Georgia, serif)" }} />
          <div className="text-right text-xs mt-1" style={{ color: "var(--color-text-muted)", ...MONO }}>
            {text.length} caracteres
          </div>
        </div>

        {/* Manual fields */}
        {manualMode && (
          <div className="flex flex-col gap-4 p-4 rounded-xl"
            style={{ backgroundColor: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}>
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-32">
                <label className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: "var(--color-text-muted)", ...MONO }}>Sentimiento</label>
                <select value={manualSentiment}
                  onChange={(e) => setManualSentiment(e.target.value as Sentiment)}
                  className="w-full p-2 rounded-lg outline-none" style={inputStyle}>
                  <option value="positivo">positivo</option>
                  <option value="negativo">negativo</option>
                  <option value="neutral">neutral</option>
                </select>
              </div>
              <div className="flex-1 min-w-40">
                <label className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: "var(--color-text-muted)", ...MONO }}>Categoría</label>
                <select value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as Category)}
                  className="w-full p-2 rounded-lg outline-none" style={inputStyle}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col justify-end min-w-24">
                <label className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: "var(--color-text-muted)", ...MONO }}>
                  Score ({manualScore > 0 ? "+" : ""}{manualScore})
                </label>
                <input type="range" min={-100} max={100} value={manualScore}
                  onChange={(e) => setManualScore(Number(e.target.value))} className="w-full" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2"
                style={{ color: "var(--color-text-muted)", ...MONO }}>Insight</label>
              <input type="text" value={manualInsight}
                onChange={(e) => setManualInsight(e.target.value)}
                placeholder="Una oración con el insight clave..."
                className="w-full p-2 rounded-lg outline-none" style={inputStyle} />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg px-4 py-2.5 text-sm"
            style={{ backgroundColor: "var(--color-red-dim)", border: "1px solid var(--color-red-border)", color: "var(--color-red)", ...MONO }}>
            {error}
          </div>
        )}

        <div className="flex gap-2 justify-between">
          <button onClick={() => setManualMode(!manualMode)} className="text-xs px-4 py-2" style={ghostBtn}>
            {manualMode ? "← Modo IA" : "Modo manual"}
          </button>
          <div className="flex gap-2">
            <button onClick={onBack} className="px-4 py-2 text-sm" style={ghostBtn} disabled={busy}>
              Cancelar
            </button>
            <button
              onClick={manualMode ? handleSaveManual : handleAnalyze}
              disabled={busy || !text.trim()}
              className="px-6 py-2 text-sm font-bold"
              style={{ ...orangeBtn, opacity: busy || !text.trim() ? 0.4 : 1, cursor: busy || !text.trim() ? "not-allowed" : "pointer" }}
            >
              {busy ? "⟳ Guardando..." : manualMode ? "Guardar →" : "Analizar y guardar →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard Client ─────────────────────────────────────────────────────
export function DashboardClient() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [view, setView] = useState<"dashboard" | "nuevo">("dashboard");
  const [filterSent, setFilterSent] = useState<Sentiment | "todos">("todos");
  const [filterCat, setFilterCat] = useState<Category | "todas">("todas");

  // ── Fetch from Supabase ─────────────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setDbError(null);
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Supabase] Error al cargar feedbacks:", error.message);
      setDbError("No se pudo conectar con la base de datos. Mostrando datos de ejemplo.");
      setItems(MOCK_FEEDBACK);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setItems((data ?? []).map((row: any) => mapSupabaseRow(row)));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ── Insert to Supabase ──────────────────────────────────────────────────────
  const handleSave = useCallback(async (data: Omit<FeedbackItem, "id" | "date">) => {
    const { data: inserted, error } = await supabase
      .from("feedbacks")
      .insert({
        text: data.text,
        source: data.source,
        sentiment: data.sentiment,
        category: data.category,
        insight: data.insight,
        score: data.score,
      })
      .select()
      .single();

    if (error) {
      console.error("[Supabase] Error al insertar feedback:", error.message);
      // Fallback: agrega localmente con id temporal
      setItems((prev) => [{
        ...data,
        id: `temp-${Date.now()}`,
        date: new Date().toLocaleDateString("es-UY", { day: "2-digit", month: "short", year: "numeric" }),
      }, ...prev]);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setItems((prev) => [mapSupabaseRow(inserted as any), ...prev]);
    }
    setView("dashboard");
  }, []);

  // ── Delete from Supabase ────────────────────────────────────────────────────
  const handleDelete = useCallback(async (id: string) => {
    // Optimistic UI: elimina de la lista inmediatamente
    setItems((prev) => prev.filter((i) => i.id !== id));

    // Si es un mock o temp, no hay nada que borrar en la DB
    if (id.startsWith("mock-") || id.startsWith("temp-")) return;

    const { error } = await supabase.from("feedbacks").delete().eq("id", id);
    if (error) {
      console.error("[Supabase] Error al eliminar feedback:", error.message);
      // En caso de error, recarga los items desde la DB
      fetchItems();
    }
  }, [fetchItems]);

  // ── Computed values ─────────────────────────────────────────────────────────
  const { total, avgScore, topCat, byS } = computeStats(items);
  const filtered = filterItems(items, filterSent, filterCat);

  // ── Views ───────────────────────────────────────────────────────────────────
  if (loading) return <LoadingSkeleton />;

  if (view === "nuevo") {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <NewFeedbackForm onBack={() => setView("dashboard")} onSave={handleSave} />
      </div>
    );
  }

  const kpiCards = [
    { title: "Total", value: String(total), sub: "piezas de feedback", accentColor: "var(--color-orange)" },
    { title: "Positivo", value: String(byS("positivo")), sub: total ? `${Math.round((byS("positivo") / total) * 100)}% del total` : "—", accentColor: "var(--color-green)" },
    { title: "Negativo", value: String(byS("negativo")), sub: total ? `${Math.round((byS("negativo") / total) * 100)}% del total` : "—", accentColor: "var(--color-red)" },
    { title: "Neutral", value: String(byS("neutral")), sub: total ? `${Math.round((byS("neutral") / total) * 100)}% del total` : "—", accentColor: "var(--color-blue)" },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">

      {/* ── DB error banner ── */}
      {dbError && (
        <div className="mb-6 rounded-xl px-4 py-3 flex items-center gap-3 text-sm"
          style={{ backgroundColor: "var(--color-yellow-dim)", border: "1px solid var(--color-yellow-border)", color: "var(--color-yellow)", ...MONO }}>
          <span>⚠ {dbError}</span>
          <button onClick={fetchItems} className="ml-auto flex items-center gap-1.5 underline underline-offset-2">
            <RefreshCw size={12} /> Reintentar
          </button>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--color-text-primary)", ...SYNE }}>
            Feedback Intelligence
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)", ...MONO }}>
            {total} registros · Supabase
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button id="btn-refresh" onClick={fetchItems}
            className="p-2 rounded-full transition-colors hover:bg-white/5"
            style={{ ...ghostBtn, borderRadius: "100%" }} title="Actualizar datos">
            <RefreshCw size={14} />
          </button>
          <button id="btn-export-csv" onClick={() => exportCSV(items)} disabled={total === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm disabled:opacity-30" style={ghostBtn}>
            <Download size={13} /> CSV
          </button>
          <button id="btn-export-excel" onClick={() => exportExcel(items)} disabled={total === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm disabled:opacity-30" style={ghostBtn}>
            <FileSpreadsheet size={13} /> Excel
          </button>
          <button id="btn-nuevo-feedback" onClick={() => setView("nuevo")}
            className="px-5 py-2 text-sm font-bold" style={orangeBtn}>
            + Nuevo feedback
          </button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <section aria-label="Métricas" className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {kpiCards.map((card) => (
          <div key={card.title} className="rounded-xl border p-5 relative overflow-hidden"
            style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)", borderLeft: `3px solid ${card.accentColor}` }}>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--color-text-muted)", ...MONO }}>
              {card.title}
            </p>
            <p className="text-5xl font-extrabold mb-1" style={{ color: "var(--color-text-primary)", lineHeight: 1, ...SYNE }}>
              {card.value}
            </p>
            {card.sub && <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)", ...MONO }}>{card.sub}</p>}
          </div>
        ))}
        <ScoreGauge avgScore={avgScore} topCat={topCat} />
      </section>

      {/* ── Charts Row ── */}
      <section aria-label="Gráficos" className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2"><SentimentChart /></div>
        <SentimentDonut items={items} />
      </section>

      {/* ── Category Breakdown ── */}
      <div className="mb-6"><CategoryBreakdown items={items} /></div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {(["todos", "positivo", "negativo", "neutral"] as const).map((s) => {
          const cfg = s !== "todos" ? SENTIMENT_CONFIG[s] : null;
          const active = filterSent === s;
          const activeBg = s === "todos" ? "var(--color-orange)" : cfg?.chartColor ?? "var(--color-orange)";
          return (
            <button key={s} id={`filter-sent-${s}`} onClick={() => setFilterSent(s)}
              className="px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{ ...MONO, backgroundColor: active ? activeBg : "transparent", color: active ? "#fff" : "var(--color-text-muted)", border: active ? "none" : "1px solid var(--color-border)", borderRadius: 100, cursor: "pointer", transition: "all 0.15s" }}>
              {s}
            </button>
          );
        })}

        <div className="w-px h-4 mx-1" style={{ backgroundColor: "var(--color-border)" }} />

        <select id="filter-category" value={filterCat}
          onChange={(e) => setFilterCat(e.target.value as Category | "todas")}
          className="px-4 py-1.5 text-xs outline-none cursor-pointer"
          style={{ ...MONO, backgroundColor: "transparent", border: "1px solid var(--color-border)", color: "var(--color-text-muted)", borderRadius: 100 }}>
          <option value="todas">Todas las categorías</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {(filterSent !== "todos" || filterCat !== "todas") && (
          <button onClick={() => { setFilterSent("todos"); setFilterCat("todas"); }}
            className="px-3 py-1.5 text-xs"
            style={{ ...MONO, color: "var(--color-red)", border: "1px solid var(--color-red-border)", backgroundColor: "var(--color-red-dim)", borderRadius: 100, cursor: "pointer" }}>
            ✕ Limpiar
          </button>
        )}

        <span className="ml-auto text-xs" style={{ color: "var(--color-text-muted)", ...MONO }}>
          {filtered.length} de {total}
        </span>
      </div>

      {/* ── Feedback List ── */}
      <section aria-label="Lista de feedback">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed py-16 text-center"
            style={{ borderColor: "var(--color-border-2)", color: "var(--color-text-muted)" }}>
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm mb-4" style={MONO}>
              {total === 0 ? "¡Agregá el primer feedback!" : "Ningún feedback coincide con los filtros."}
            </p>
            {total === 0 && (
              <button onClick={() => setView("nuevo")} className="px-6 py-2.5 text-sm font-bold" style={orangeBtn}>
                + Agregar feedback
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((item) => (
              <FeedbackCard key={item.id} item={item} onDelete={() => handleDelete(item.id)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
