import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogIn, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth, MOCK_USERS } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import type { User } from "@/context/AuthContext";

const paletteByTheme = {
  light: {
    bgGradient:
      "radial-gradient(ellipse at top right, rgba(227,30,36,0.06) 0%, transparent 60%), #f8f8f8",
    text: "#3A3A3A",
    muted: "#B1B3B6",
    accent: "#E31E24",
    accentHover: "#ff3137",
    accentSecondary: "#c4191f",
    accentFg: "#FFFFFF",
    border: "rgba(58,58,58,0.08)",
    borderLight: "rgba(58,58,58,0.15)",
    cardBg: "rgba(255,255,255,0.7)",
    inputBg: "rgba(255,255,255,0.9)",
    avatarBg: "rgba(58,58,58,0.05)",
    shadowAccent: "rgba(227,30,36,0.1)",
    shadowCard: "rgba(58,58,58,0.1)",
  },
  dark: {
    bgGradient:
      "radial-gradient(ellipse at top right, rgba(227,30,36,0.08) 0%, transparent 60%), #1c1c1c",
    text: "#f5f5f5",
    muted: "#B1B3B6",
    accent: "#E31E24",
    accentHover: "#ff3137",
    accentSecondary: "#c4191f",
    accentFg: "#FFFFFF",
    border: "rgba(177,179,182,0.1)",
    borderLight: "rgba(177,179,182,0.2)",
    cardBg: "rgba(58,58,58,0.4)",
    inputBg: "rgba(38,38,38,0.8)",
    avatarBg: "rgba(58,58,58,0.6)",
    shadowAccent: "rgba(227,30,36,0.2)",
    shadowCard: "rgba(0,0,0,0.4)",
  },
} as const;

const roleBadgeStyle: Record<string, string> = {
  superadmin: "border-[#E31E24]/30 bg-[#E31E24]/8 text-[#E31E24]",
  admin: "border-[#E89B1C]/30 bg-[#E89B1C]/8 text-[#E89B1C]",
  operador: "border-[#2563EB]/30 bg-[#2563EB]/8 text-[#2563EB]",
  etiquetador: "border-[#B1B3B6]/40 bg-[#B1B3B6]/8 text-[#6B7280]",
  cliente: "border-[#B1B3B6]/40 bg-[#B1B3B6]/8 text-[#6B7280]",
};

const roleLabels: Record<string, string> = {
  superadmin: "SUPERADMIN",
  admin: "ADMIN",
  operador: "OPERADOR",
  etiquetador: "ETIQUETADOR",
  cliente: "CLIENTE",
};

const outfit = "'Outfit', system-ui, -apple-system, sans-serif";

export default function LoginPage() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const C = paletteByTheme[theme];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError("Selecciona una cuenta.");
      return;
    }
    if (!password) {
      setError("Ingresa la contraseña.");
      return;
    }
    login(selectedUser);
    navigate("/jetson", { replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: C.bgGradient, fontFamily: outfit }}
    >
      <div className="w-full max-w-md space-y-6 animate-fade-up">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest transition-colors"
          style={{ color: C.muted }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          VOLVER
        </button>

        {/* Header */}
        <div className="text-center space-y-3">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border backdrop-blur-md"
            style={{
              backgroundColor: `${C.accent}15`,
              borderColor: `${C.accent}30`,
              boxShadow: `0 0 40px ${C.shadowAccent}`,
            }}
          >
            <ShieldCheck className="w-8 h-8" style={{ color: C.accent }} />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <img src="/seishin-SinFondo.png" alt="Seishin" className="h-8 w-auto object-contain" />
              <h1
                className="text-xl font-bold tracking-tight"
                style={{ color: C.text, fontFamily: outfit, letterSpacing: "-0.02em" }}
              >
                SeishinIA & Nvidia
              </h1>
            </div>
            <p className="text-xs font-mono" style={{ color: C.muted }}>
              SeishinIA — Consola de operaciones
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${C.muted}40, transparent)` }}
        />

        {/* Login form — glass card */}
        <form
          onSubmit={handleLogin}
          className="rounded-[2rem] border p-6 space-y-5 backdrop-blur-xl overflow-hidden"
          style={{
            backgroundColor: C.cardBg,
            borderColor: C.border,
            boxShadow: `0 8px 32px 0 ${C.shadowCard}, 0 0 0 1px ${C.border}`,
          }}
        >
          <p
            className="text-[10px] font-mono font-semibold tracking-widest uppercase"
            style={{ color: C.muted }}
          >
            SELECCIONAR CUENTA
          </p>

          {/* User selector */}
          <div className="grid grid-cols-1 gap-2">
            {MOCK_USERS.map((user) => {
              const selected = selectedUser?.id === user.id;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setSelectedUser(user);
                    setError("");
                  }}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all duration-300"
                  style={{
                    borderColor: selected ? C.accent : C.border,
                    backgroundColor: selected ? `${C.accent}10` : "transparent",
                    boxShadow: selected
                      ? `0 0 20px ${C.shadowAccent}, 0 0 0 1px ${C.accent}30`
                      : "none",
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: selected ? C.accent : C.avatarBg,
                      color: selected ? C.accentFg : C.muted,
                      boxShadow: selected ? `0 0 12px ${C.shadowAccent}` : "none",
                    }}
                  >
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: C.text, fontFamily: outfit }}
                    >
                      {user.name}
                    </p>
                    <p className="text-[10px] font-mono truncate" style={{ color: C.muted }}>
                      {user.email}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${roleBadgeStyle[user.role]}`}
                  >
                    {roleLabels[user.role]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              className="text-xs font-mono tracking-widest"
              style={{ color: C.muted }}
            >
              CONTRASEÑA
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Ingresa cualquier contraseña (mock)"
                className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-all duration-300"
                style={{
                  backgroundColor: C.inputBg,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  fontFamily: outfit,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = C.accent;
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${C.accent}40, 0 0 20px ${C.shadowAccent}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs font-mono" style={{ color: C.accent }}>
              {error}
            </p>
          )}

          {/* Submit — gradient button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentSecondary})`,
              color: C.accentFg,
              fontFamily: outfit,
              boxShadow: `0 4px 20px ${C.shadowAccent}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${C.accentHover}, ${C.accent})`;
              e.currentTarget.style.boxShadow = `0 8px 32px ${C.shadowAccent}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${C.accent}, ${C.accentSecondary})`;
              e.currentTarget.style.boxShadow = `0 4px 20px ${C.shadowAccent}`;
            }}
          >
            <LogIn className="w-4 h-4" />
            INICIAR SESIÓN
          </button>
        </form>

        {/* Footer */}
        <div className="text-center space-y-1">
          <p className="text-[10px] font-mono" style={{ color: C.muted }}>
            SeishinIA — v1.0.0 — Build 2026.02
          </p>
          <p className="text-[10px] font-mono" style={{ color: `${C.muted}99` }}>
            Modo demo — Cualquier contraseña es válida
          </p>
        </div>
      </div>
    </div>
  );
}
