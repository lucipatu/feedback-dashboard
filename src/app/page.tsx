"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { DashboardClient } from "@/components/DashboardClient";
import { LoginPage } from "@/components/LoginPage";

// ── Loading screen ────────────────────────────────────────────────────────────
function AuthLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black"
          style={{ backgroundColor: "var(--color-orange)" }}
        >
          C
        </div>
        <p
          className="text-xs"
          style={{ color: "#555", fontFamily: "var(--font-dm-mono, 'DM Mono', monospace)" }}
        >
          Verificando sesión...
        </p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial (evita flash de login si ya estás autenticado)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Escuchar cambios de sesión (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Mientras se verifica la sesión
  if (loading) return <AuthLoading />;

  // Sin sesión → pantalla de login
  if (!session) return <LoginPage />;

  // Con sesión → dashboard completo
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      <Navbar userEmail={session.user.email} onLogout={handleLogout} />
      <main>
        <DashboardClient />
      </main>
      <footer
        className="border-t mt-12 py-6 text-center"
        style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
      >
        <p className="text-sm">
          © 2026{" "}
          <strong style={{ color: "var(--color-orange)" }}>CapyFi</strong>{" "}
          · Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}
