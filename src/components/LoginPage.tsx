"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const MONO: React.CSSProperties = { fontFamily: "var(--font-dm-mono, 'DM Mono', monospace)" };
const ARIAL: React.CSSProperties = { fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" };

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email o contraseña incorrectos."
          : authError.message
      );
      setLoading(false);
    }
    // Si no hay error, onAuthStateChange en page.tsx detecta la sesión automáticamente
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "#141414",
    border: "1px solid #2e2e2e",
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    padding: "12px 16px",
    outline: "none",
    transition: "border-color 0.15s",
    ...MONO,
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo + brand */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-black mb-4"
            style={{ backgroundColor: "var(--color-orange)" }}
          >
            C
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight mb-1"
            style={{ color: "#fff", ...ARIAL }}
          >
            CapyFi
          </h1>
          <p className="text-sm" style={{ color: "#555", ...MONO }}>
            Feedback Intelligence Dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{ backgroundColor: "#1a1a1a", borderColor: "#2e2e2e" }}
        >
          <h2
            className="text-lg font-bold mb-1"
            style={{ color: "#fff", ...ARIAL }}
          >
            Iniciar sesión
          </h2>
          <p className="text-sm mb-6" style={{ color: "#555", ...MONO }}>
            Ingresá tus credenciales para acceder al dashboard.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-xs uppercase tracking-widest"
                style={{ color: "#555", ...MONO }}
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-orange)")}
                onBlur={(e) => (e.target.style.borderColor = "#2e2e2e")}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-password"
                className="text-xs uppercase tracking-widest"
                style={{ color: "#555", ...MONO }}
              >
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-orange)")}
                onBlur={(e) => (e.target.style.borderColor = "#2e2e2e")}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-lg px-4 py-2.5 text-sm"
                style={{
                  backgroundColor: "var(--color-red-dim)",
                  border: "1px solid var(--color-red-border)",
                  color: "var(--color-red)",
                  ...MONO,
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full py-3 text-sm font-bold mt-2 transition-opacity"
              style={{
                backgroundColor: "var(--color-orange)",
                color: "#fff",
                border: "none",
                borderRadius: 100,
                cursor: loading || !email.trim() || !password ? "not-allowed" : "pointer",
                opacity: loading || !email.trim() || !password ? 0.5 : 1,
                ...ARIAL,
              }}
            >
              {loading ? "Ingresando..." : "Ingresar →"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#333", ...MONO }}>
          © 2026 CapyFi · Acceso restringido
        </p>
      </div>
    </div>
  );
}
