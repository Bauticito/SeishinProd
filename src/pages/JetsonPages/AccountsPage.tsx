import { UserCircle, Shield, Clock, Mail } from "lucide-react";
import { useAuth, MOCK_USERS } from "@/context/AuthContext";
import { isAdmin } from "@/lib/permissions";

const roleLabels: Record<string, string> = {
  superadmin: "SUPERADMIN",
  admin: "ADMIN",
  operador: "OPERADOR",
  etiquetador: "ETIQUETADOR",
  cliente: "CLIENTE",
};

const roleBadgeColors: Record<string, string> = {
  superadmin: "text-status-error border-status-error/30 bg-status-error/10",
  admin: "text-status-warning border-status-warning/30 bg-status-warning/10",
  operador: "text-primary border-primary/30 bg-primary/10",
  etiquetador: "text-muted-foreground border-border bg-muted/30",
  cliente: "text-foreground border-border bg-muted/30",
};

export default function AccountsPage() {
  const { user } = useAuth();

  if (!user) return null;

  const admin = isAdmin(user.role);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserCircle className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">
          {admin ? "GESTIÓN DE CUENTAS" : "MI PERFIL"}
        </h1>
      </div>

      <div className="glow-line" />

      {/* Current user profile */}
      <div className="metric-card">
        <p className="metric-label mb-4">Tu Cuenta</p>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center font-mono text-lg font-bold text-primary shrink-0">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-2 flex-1">
            <p className="text-sm font-mono font-medium text-foreground">{user.name}</p>
            <div className="flex flex-wrap gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="w-3 h-3" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Shield className="w-3 h-3" />
                <span className={`px-2 py-0.5 rounded border ${roleBadgeColors[user.role]}`}>
                  {roleLabels[user.role]}
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3 h-3" />
                Sesión activa
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mock password change */}
      <div className="metric-card">
        <p className="metric-label mb-4">Cambiar Contraseña</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <label className="space-y-1">
            <span className="text-muted-foreground">Contraseña actual</span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-background border border-border rounded px-2 py-1.5"
            />
          </label>
          <label className="space-y-1">
            <span className="text-muted-foreground">Nueva contraseña</span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-background border border-border rounded px-2 py-1.5"
            />
          </label>
          <label className="space-y-1">
            <span className="text-muted-foreground">Confirmar</span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-background border border-border rounded px-2 py-1.5"
            />
          </label>
        </div>
        <button className="mt-3 text-xs font-mono px-3 py-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10 transition-colors">
          Actualizar contraseña
        </button>
      </div>

      {/* Admin-only: all users table */}
      {admin && (
        <div className="metric-card overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="metric-label">Todas las Cuentas</p>
            <button className="text-xs font-mono px-3 py-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10 transition-colors">
              Crear cuenta
            </button>
          </div>

          <table className="table-industrial">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-muted flex items-center justify-center font-mono text-[10px] font-bold text-muted-foreground">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-foreground font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-muted-foreground">{u.email}</td>
                  <td>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${roleBadgeColors[u.role]}`}>
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td>
                    <span className="status-indicator">
                      <span className="status-dot status-dot-ok" />
                      Activo
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button className="text-[10px] font-mono px-2 py-1 rounded border border-border hover:bg-muted/30 transition-colors">
                        Editar
                      </button>
                      {u.id !== user.id && (
                        <button className="text-[10px] font-mono px-2 py-1 rounded border border-status-error/30 text-status-error hover:bg-status-error/10 transition-colors">
                          Desactivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Non-admin info */}
      {!admin && (
        <div className="metric-card">
          <p className="text-xs font-mono text-muted-foreground">
            Contacta a un administrador para cambios en tu rol o acceso a otras secciones.
          </p>
        </div>
      )}
    </div>
  );
}
