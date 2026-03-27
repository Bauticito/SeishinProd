import { HardDrive, Activity, User, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useJarvisSystemStats } from "@/hooks/useJarvis";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { SITE_MEDIA } from "@/lib/siteMedia";

type Status = "ok" | "warning" | "error";

const statusColor: Record<Status, string> = {
  ok: "text-[#22C55E]",
  warning: "text-[#F59E0B]",
  error: "text-[#E31E24]",
};

export function SystemStatusBar() {
  const { t } = useTranslation();
  const { data: stats } = useJarvisSystemStats();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const gpu = stats?.gpu_percent;
  const ram = stats?.ram_percent;

  const metrics: { label: string; value: string; unit: string; status: Status; icon: React.ReactNode }[] = [
    {
      label: "GPU",
      value: gpu != null ? gpu.toFixed(0) : "--",
      unit: "%",
      status: gpu == null ? "warning" : gpu > 85 ? "error" : gpu > 70 ? "warning" : "ok",
      icon: <Activity className="w-3 h-3" />,
    },
    {
      label: "RAM",
      value: ram != null ? ram.toFixed(0) : "--",
      unit: "%",
      status: ram == null ? "warning" : ram > 85 ? "error" : ram > 70 ? "warning" : "ok",
      icon: <HardDrive className="w-3 h-3" />,
    },
  ];

  return (
    <header className="h-12 bg-[var(--bg-secondary)] border-b border-[var(--border-color-light)] flex items-center px-4 gap-3 shrink-0 overflow-x-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <img src={SITE_MEDIA.logos.primary} alt="Seishin" className="h-7 w-auto object-contain" />
        <span className="hidden sm:block text-[10px] font-mono font-bold tracking-[0.15em] text-[var(--text-secondary)] uppercase">
          {t('jetson.status.portal_ia')}
        </span>
      </div>

      <div className="w-px h-5 bg-[var(--border-color-light)]" />

      {/* System metrics */}
      <div className="flex items-center gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color-light)]"
          >
            <span className={statusColor[m.status]}>{m.icon}</span>
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">{m.label}</span>
            <span className={`text-[10px] font-mono font-bold ${statusColor[m.status]}`}>
              {m.value}{m.unit}
            </span>
          </div>
        ))}
      </div>

      <div className="w-px h-5 bg-[var(--border-color-light)]" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color-light)] hover:border-[#E31E24]/40 hover:text-[#E31E24] text-[var(--text-secondary)] transition-all duration-200"
        title={theme === "light" ? t('jetson.status.theme_dark') : t('jetson.status.theme_light')}
      >
        {theme === "light" ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
        <span className="text-[10px] font-mono">{theme === "light" ? t('jetson.status.osc') : t('jetson.status.cla')}</span>
      </button>

      {/* User info */}
      {user && (
        <>
          <div className="w-px h-5 bg-[var(--border-color-light)]" />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color-light)]">
            <User className="w-3 h-3 text-[var(--text-secondary)]" />
            <span className="text-[10px] font-mono text-[var(--text-primary)]">{user.name}</span>
            <span className="text-[9px] font-mono text-[#E31E24] uppercase">[{user.role}]</span>
          </div>
        </>
      )}

      {/* System status badge */}
      <div className="ml-auto flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
        <span className="hidden sm:block text-[9px] font-mono text-[var(--text-secondary)] tracking-widest uppercase">
          {t('jetson.status.all_operational')}
        </span>
      </div>
    </header>
  );
}
