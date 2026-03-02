import { CreditCard, Server } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { useAuth } from "@/context/AuthContext";

type ClientRow = {
  id: string;
  apiKey: string;
  endpoint: string;
  hoursUsed: number;
  hoursLimit: number;
  gpuUsage: string;
  status: "active" | "idle";
  lastActive: string;
};

const clients: ClientRow[] = [
  {
    id: "CLIENT-A01",
    apiKey: "sk-a01-****-****-7f2b",
    endpoint: "/v1/inference/a01",
    hoursUsed: 142.5,
    hoursLimit: 200,
    gpuUsage: "34%",
    status: "active",
    lastActive: "2026-02-19 14:30",
  },
  {
    id: "CLIENT-B03",
    apiKey: "sk-b03-****-****-1e8a",
    endpoint: "/v1/inference/b03",
    hoursUsed: 87.2,
    hoursLimit: 100,
    gpuUsage: "22%",
    status: "active",
    lastActive: "2026-02-18 22:15",
  },
  {
    id: "CLIENT-C07",
    apiKey: "sk-c07-****-****-4d3c",
    endpoint: "/v1/inference/c07",
    hoursUsed: 231.0,
    hoursLimit: 250,
    gpuUsage: "0%",
    status: "idle",
    lastActive: "2026-02-19 09:00",
  },
];

function resolveClientForUser(email: string) {
  if (email.includes("cliente.demo")) return clients[2];
  if (email.includes("operador")) return clients[0];
  return clients[0];
}

export default function BillingPage() {
  const { user } = useAuth();
  const isClientRole = user?.role === "cliente";

  const ownClient = isClientRole && user ? resolveClientForUser(user.email) : null;

  const activeClients = clients.filter((c) => c.status === "active").length;
  const totalHours = clients.reduce((acc, c) => acc + c.hoursUsed, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">FACTURACIÓN / USO</h1>
      </div>

      <div className="glow-line" />

      {isClientRole && ownClient ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Mi Consumo" value={ownClient.hoursUsed.toFixed(1)} unit="hrs" status="ok" />
            <MetricCard label="Mi Límite" value={ownClient.hoursLimit} unit="hrs" status="ok" />
            <MetricCard label="Mi GPU" value={ownClient.gpuUsage} status={ownClient.status === "active" ? "ok" : "warning"} />
            <MetricCard
              label="Estado"
              value={ownClient.status === "active" ? "Activo" : "Idle"}
              status={ownClient.status === "active" ? "ok" : "warning"}
            />
          </div>

          <div className="metric-card overflow-x-auto">
            <p className="metric-label mb-3">Mi Cuenta (vista segura)</p>
            <table className="table-industrial">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Token</th>
                  <th>Canal</th>
                  <th>Uso</th>
                  <th>Límite</th>
                  <th>Último Activo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-primary font-medium">{ownClient.id}</td>
                  <td className="text-muted-foreground">Token oculto (rotación habilitada)</td>
                  <td className="text-muted-foreground">Canal dedicado</td>
                  <td>{ownClient.hoursUsed}h</td>
                  <td>{ownClient.hoursLimit}h</td>
                  <td className="text-muted-foreground text-[11px]">{ownClient.lastActive}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs font-mono text-muted-foreground mt-3">
              Seguridad: no se exponen endpoints internos, API keys completas ni datos de otros clientes.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Clientes Activos" value={activeClients} unit={`/${clients.length}`} status="ok" />
            <MetricCard label="Horas Total" value={totalHours.toFixed(1)} unit="hrs" status="ok" />
            <MetricCard label="GPU Asignada" value="56" unit="%" status="ok" />
            <MetricCard label="Ingresos Est." value="$2,304" status="ok" />
          </div>

          <div className="metric-card overflow-x-auto">
            <table className="table-industrial">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>API Key</th>
                  <th>Endpoint</th>
                  <th>Horas</th>
                  <th>Límite</th>
                  <th>GPU</th>
                  <th>Estado</th>
                  <th>Último Activo</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td className="text-primary font-medium">{c.id}</td>
                    <td className="text-muted-foreground">
                      <code className="text-[10px] bg-muted/30 px-1.5 py-0.5 rounded">{c.apiKey}</code>
                    </td>
                    <td className="text-muted-foreground text-[11px]">{c.endpoint}</td>
                    <td>{c.hoursUsed}h</td>
                    <td className="text-muted-foreground">{c.hoursLimit}h</td>
                    <td>{c.gpuUsage}</td>
                    <td>
                      <span className="status-indicator">
                        <span className={`status-dot ${c.status === "active" ? "status-dot-ok" : "status-dot-warning"}`} />
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-muted-foreground text-[11px]">{c.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="metric-card">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-primary" />
              <p className="metric-label">Arquitectura Multiusuario</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="status-dot status-dot-ok" />
                Contenedores Docker aislados
              </div>
              <div className="flex items-center gap-2">
                <span className="status-dot status-dot-ok" />
                Cuotas de recursos por cliente
              </div>
              <div className="flex items-center gap-2">
                <span className="status-dot status-dot-ok" />
                Control de acceso por API Key
              </div>
              <div className="flex items-center gap-2">
                <span className="status-dot status-dot-ok" />
                Registro de actividad completo
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
