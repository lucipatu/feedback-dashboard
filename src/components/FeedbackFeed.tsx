"use client";

import { Star } from "lucide-react";

interface FeedbackItem {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  message: string;
  category: string;
  time: string;
  sentiment: "positive" | "neutral" | "negative";
}

const feedbackData: FeedbackItem[] = [
  {
    id: "1",
    user: "Valentina R.",
    avatar: "VR",
    rating: 5,
    message:
      "La app es increíble. Las transferencias son instantáneas y la interfaz es súper intuitiva. ¡La mejor fintech que usé!",
    category: "Transferencias",
    time: "Hace 12 min",
    sentiment: "positive",
  },
  {
    id: "2",
    user: "Martín G.",
    avatar: "MG",
    rating: 2,
    message:
      "Tuve problemas para verificar mi identidad. El proceso tardó 3 días y el soporte no me respondió a tiempo.",
    category: "Onboarding",
    time: "Hace 34 min",
    sentiment: "negative",
  },
  {
    id: "3",
    user: "Lucía F.",
    avatar: "LF",
    rating: 4,
    message:
      "Me encanta el diseño y la facilidad de uso. Solo mejoraría las notificaciones push, a veces llegan tarde.",
    category: "UX / Diseño",
    time: "Hace 1 h",
    sentiment: "positive",
  },
  {
    id: "4",
    user: "Diego P.",
    avatar: "DP",
    rating: 3,
    message:
      "Funciona bien en general, pero la app se cierra sola cuando intento pagar con QR en negocios.",
    category: "Pagos QR",
    time: "Hace 2 h",
    sentiment: "neutral",
  },
  {
    id: "5",
    user: "Camila S.",
    avatar: "CS",
    rating: 5,
    message:
      "Excelente la función de inversiones automáticas. Rendimiento muy superior a los bancos tradicionales.",
    category: "Inversiones",
    time: "Hace 3 h",
    sentiment: "positive",
  },
];

const sentimentConfig = {
  positive: {
    bg: "rgba(0, 212, 170, 0.08)",
    border: "rgba(0, 212, 170, 0.25)",
    badge: "rgba(0, 212, 170, 0.15)",
    badgeText: "#00d4aa",
    label: "Positivo",
  },
  neutral: {
    bg: "rgba(245, 158, 11, 0.08)",
    border: "rgba(245, 158, 11, 0.25)",
    badge: "rgba(245, 158, 11, 0.15)",
    badgeText: "#f59e0b",
    label: "Neutral",
  },
  negative: {
    bg: "rgba(239, 68, 68, 0.08)",
    border: "rgba(239, 68, 68, 0.25)",
    badge: "rgba(239, 68, 68, 0.15)",
    badgeText: "#ef4444",
    label: "Negativo",
  },
};

export function FeedbackFeed() {
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
            Feedback Reciente
          </h3>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            Últimas 6 horas
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: "rgba(0,212,170,0.1)",
            color: "var(--color-accent-green)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          En vivo
        </div>
      </div>

      <div className="space-y-4">
        {feedbackData.map((item) => {
          const config = sentimentConfig[item.sentiment];
          return (
            <div
              key={item.id}
              className="rounded-xl border p-4 transition-all duration-200 hover:scale-[1.01] cursor-pointer"
              style={{
                backgroundColor: config.bg,
                borderColor: config.border,
              }}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    color: "white",
                  }}
                >
                  {item.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {item.user}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: config.badge,
                          color: config.badgeText,
                        }}
                      >
                        {config.label}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {item.time}
                      </span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < item.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-600"
                        }
                      />
                    ))}
                  </div>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {item.message}
                  </p>

                  <div className="mt-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-md font-medium"
                      style={{
                        backgroundColor: "rgba(59,130,246,0.1)",
                        color: "#3b82f6",
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
