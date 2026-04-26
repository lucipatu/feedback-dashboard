"use client";

import { Bell, Search, Settings, ChevronDown, LogOut } from "lucide-react";

interface NavbarProps {
  userEmail?: string;
  onLogout?: () => void;
}

export function Navbar({ userEmail, onLogout }: NavbarProps) {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 py-0 h-[60px] flex items-center justify-between gap-6">
        {/* Logo + brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* Capybara SVG icon — minimal inline version matching brand */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm select-none"
              style={{ background: "var(--color-orange)" }}
              aria-hidden="true"
            >
              C
            </div>
            <span
              className="text-base font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-syne, sans-serif)",
                color: "var(--color-text-primary)",
              }}
            >
              CapyFi
            </span>
          </div>
          <span
            className="hidden sm:inline-flex items-center text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: "var(--color-orange-dim)",
              color: "var(--color-orange)",
              border: "1px solid var(--color-orange-border)",
              fontFamily: "var(--font-dm-mono, monospace)",
            }}
          >
            feedback
          </span>
        </div>

        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-xs"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Search size={13} style={{ color: "var(--color-text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar feedback..."
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-inter, sans-serif)" }}
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="relative p-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "var(--color-text-muted)" }}
            id="navbar-notifications-btn"
            aria-label="Notificaciones"
          >
            <Bell size={17} />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-orange)" }}
            />
          </button>

          <button
            className="p-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "var(--color-text-muted)" }}
            id="navbar-settings-btn"
            aria-label="Configuración"
          >
            <Settings size={17} />
          </button>

          <div
            className="w-px h-5 mx-1"
            style={{ backgroundColor: "var(--color-border)" }}
          />

          {/* Profile + logout */}
          <div className="flex items-center gap-1">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase"
                style={{ backgroundColor: "var(--color-orange)" }}
              >
                {userEmail ? userEmail[0] : "A"}
              </div>
              <span
                className="hidden md:block text-sm"
                style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-inter, sans-serif)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {userEmail ?? "Admin"}
              </span>
              <ChevronDown size={12} style={{ color: "var(--color-text-muted)" }} />
            </div>

            {onLogout && (
              <button
                id="navbar-logout-btn"
                onClick={onLogout}
                className="p-2 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: "var(--color-text-muted)" }}
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
