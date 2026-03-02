import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import type { Role } from "@/lib/permissions";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface SessionMeta {
  loginAt: number;
  lastActivity: number;
}

interface AuthContextValue {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  /** Minutes remaining before absolute session expiration */
  sessionMinutesLeft: number | null;
  /** Whether the inactivity warning is currently showing */
  inactivityWarning: boolean;
  /** Dismiss the warning and reset inactivity timer */
  dismissInactivityWarning: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Session config (in minutes)
const SESSION_MAX_DURATION_MIN = 480; // 8 hours absolute
const INACTIVITY_TIMEOUT_MIN = 30;   // auto-logout after 30 min idle
const INACTIVITY_WARNING_MIN = 25;   // warn at 25 min idle

// Mock users aligned with AdminPage data
export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Administrador Principal",
    email: "bautista.javier.figueroa@gmail.com",
    role: "superadmin",
  },
  {
    id: "u2",
    name: "Admin Operaciones",
    email: "admin.ops@thor.local",
    role: "admin",
  },
  {
    id: "u3",
    name: "Operador Planta A",
    email: "operador.a@thor.local",
    role: "operador",
  },
  {
    id: "u4",
    name: "Label Team 02",
    email: "label02@thor.local",
    role: "etiquetador",
  },
  {
    id: "u5",
    name: "Cliente Demo",
    email: "cliente.demo@external.local",
    role: "cliente",
  },
];

function loadSession(): { user: User; meta: SessionMeta } | null {
  try {
    const stored = localStorage.getItem("thor-session");
    const metaStr = localStorage.getItem("thor-session-meta");
    if (!stored || !metaStr) return null;
    const user = JSON.parse(stored) as User;
    const meta = JSON.parse(metaStr) as SessionMeta;

    const now = Date.now();
    const sessionAge = (now - meta.loginAt) / 60000;
    const inactiveTime = (now - meta.lastActivity) / 60000;

    if (sessionAge > SESSION_MAX_DURATION_MIN || inactiveTime > INACTIVITY_TIMEOUT_MIN) {
      localStorage.removeItem("thor-session");
      localStorage.removeItem("thor-session-meta");
      return null;
    }

    return { user, meta };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial = loadSession();
  const [user, setUser] = useState<User | null>(initial?.user ?? null);
  const [meta, setMeta] = useState<SessionMeta | null>(initial?.meta ?? null);
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [sessionMinutesLeft, setSessionMinutesLeft] = useState<number | null>(null);
  const activityRef = useRef(Date.now());

  const login = useCallback((u: User) => {
    const now = Date.now();
    const newMeta: SessionMeta = { loginAt: now, lastActivity: now };
    setUser(u);
    setMeta(newMeta);
    setInactivityWarning(false);
    localStorage.setItem("thor-session", JSON.stringify(u));
    localStorage.setItem("thor-session-meta", JSON.stringify(newMeta));
    activityRef.current = now;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setMeta(null);
    setInactivityWarning(false);
    setSessionMinutesLeft(null);
    localStorage.removeItem("thor-session");
    localStorage.removeItem("thor-session-meta");
  }, []);

  const recordActivity = useCallback(() => {
    const now = Date.now();
    activityRef.current = now;
    setInactivityWarning(false);
    if (meta) {
      const updated = { ...meta, lastActivity: now };
      setMeta(updated);
      localStorage.setItem("thor-session-meta", JSON.stringify(updated));
    }
  }, [meta]);

  const dismissInactivityWarning = useCallback(() => {
    recordActivity();
  }, [recordActivity]);

  // Track user activity
  useEffect(() => {
    if (!user) return;
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    const handler = () => recordActivity();
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, handler));
  }, [user, recordActivity]);

  // Session timer — check every 30s
  useEffect(() => {
    if (!user || !meta) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const sessionAge = (now - meta.loginAt) / 60000;
      const inactiveTime = (now - activityRef.current) / 60000;

      const remaining = SESSION_MAX_DURATION_MIN - sessionAge;
      setSessionMinutesLeft(Math.max(0, Math.round(remaining)));

      if (sessionAge >= SESSION_MAX_DURATION_MIN || inactiveTime >= INACTIVITY_TIMEOUT_MIN) {
        logout();
        return;
      }

      if (inactiveTime >= INACTIVITY_WARNING_MIN) {
        setInactivityWarning(true);
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [user, meta, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        sessionMinutesLeft,
        inactivityWarning,
        dismissInactivityWarning,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
