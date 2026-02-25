import {
  LayoutDashboard,
  Video,
  Bot,
  Camera,
  Box,
  Database,
  GraduationCap,
  FileText,
  Settings,
  CreditCard,
  Puzzle,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getVisibleRoutes } from "@/lib/permissions";

const navItems = [
  { title: "Dashboard", path: "/jetson", icon: LayoutDashboard },
  { title: "Inference", path: "/jetson/inference", icon: Video },
  { title: "Automatizaciones", path: "/jetson/automations", icon: Bot },
  { title: "Cámaras", path: "/jetson/cameras", icon: Camera },
  { title: "Modelos", path: "/jetson/models", icon: Box },
  { title: "Datasets", path: "/jetson/datasets", icon: Database },
  { title: "Entrenamiento", path: "/jetson/training", icon: GraduationCap },
  { title: "Logs", path: "/jetson/logs", icon: FileText },
  { title: "Módulos", path: "/jetson/modules", icon: Puzzle },
  { title: "Cuentas", path: "/jetson/accounts", icon: UserCircle },
  { title: "Administración", path: "/jetson/admin", icon: Settings },
  { title: "Facturación", path: "/jetson/billing", icon: CreditCard },
];

const roleLabels: Record<string, string> = {
  superadmin: "SUPERADMIN",
  admin: "ADMIN",
  operador: "OPERADOR",
  etiquetador: "ETIQUETADOR",
  cliente: "CLIENTE",
};

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const visiblePaths = user ? getVisibleRoutes(user.role) : [];
  const filteredNav = navItems.filter((item) => visiblePaths.includes(item.path));

  return (
    <aside
      className={`${
        collapsed ? "w-14" : "w-52"
      } bg-[var(--bg-secondary)] border-r border-[var(--border-color-light)] flex flex-col shrink-0 transition-all duration-200`}
    >
      {/* Logo / Title */}
      <div className="h-12 flex items-center px-3 border-b border-[var(--border-color-light)]">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/seishin-SinFondo.png"
              alt="Seishin"
              className="h-7 w-auto object-contain"
            />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 space-y-0.5 px-2">
        {filteredNav.map((mod) => (
          <NavLink
            key={mod.path}
            to={mod.path}
            end={mod.path === "/jetson"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-[#E31E24]/10 text-[#E31E24] font-medium border border-[#E31E24]/20"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] border border-transparent"
              }`
            }
          >
            <mod.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">{mod.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User / Footer */}
      <div className="border-t border-[var(--border-color-light)]">
        {user && (
          <div className="px-3 py-2">
            {!collapsed ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E31E24]/20 flex items-center justify-center font-mono text-[10px] font-bold text-[#E31E24] shrink-0">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] text-[var(--text-primary)] truncate">{user.name}</p>
                  <p className="font-mono text-[9px] text-[var(--text-secondary)]">{roleLabels[user.role]}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[#E31E24] transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={logout}
                className="w-full flex justify-center p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[#E31E24] transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        {!collapsed && (
          <div className="px-3 pb-3 pt-1">
            <p className="font-mono text-[10px] text-[var(--text-secondary)]">
              v1.0.0 — Build 2026.02
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
