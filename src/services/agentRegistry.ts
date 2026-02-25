// ============================================================
// Agent Registry — El "tronco" del sistema
// Cada modelo desplegado (Jarvis, fire-detection, ANPR, etc.)
// se registra como un agente con sus widgets y endpoints.
// ============================================================

export interface AgentEndpoint {
  path: string;
  method: "GET" | "POST" | "PUT";
  description: string;
}

export interface WidgetDefinition {
  id: string;
  name: string;
  category: "video" | "metrics" | "alerts" | "status" | "chart";
  description: string;
  defaultSize: "small" | "medium" | "large" | "full";
  endpoints: string[]; // qué endpoints del agente consume
}

export interface DeployedAgent {
  id: string;
  name: string;
  version: string;
  type: string;
  baseUrl: string;
  healthCheck: string;
  status: "running" | "stopped" | "error" | "unknown";
  cameras: string[];
  model: string;
  widgets: WidgetDefinition[];
  endpoints: AgentEndpoint[];
}

// Jarvis es el primer agente registrado
const jarvisAgent: DeployedAgent = {
  id: "jarvis-security",
  name: "JARVIS Security Agent",
  version: "1.1",
  type: "yolo-detector",
  baseUrl: "/api/agents/jarvis",
  healthCheck: "/health",
  status: "unknown",
  cameras: ["main"],
  model: "yolo11m.engine",
  widgets: [
    {
      id: "jarvis-live-fps",
      name: "FPS en vivo",
      category: "metrics",
      description: "FPS en tiempo real del pipeline de inferencia",
      defaultSize: "small",
      endpoints: ["/metrics"],
    },
    {
      id: "jarvis-live-ram",
      name: "RAM en vivo",
      category: "metrics",
      description: "Uso de RAM actual del sistema (%)",
      defaultSize: "small",
      endpoints: ["/system-stats"],
    },
    {
      id: "jarvis-performance-profile",
      name: "Perfil de rendimiento",
      category: "status",
      description: "Perfil activo y parámetros runtime de rendimiento",
      defaultSize: "small",
      endpoints: ["/runtime-config"],
    },
    {
      id: "jarvis-contention",
      name: "Sistema de Contención",
      category: "status",
      description: "Semáforo GREEN/YELLOW/RED de nivel de amenaza",
      defaultSize: "small",
      endpoints: ["/contention"],
    },
    {
      id: "jarvis-metrics",
      name: "Métricas del Sistema",
      category: "metrics",
      description: "Detecciones, alertas, uptime, screenshots",
      defaultSize: "medium",
      endpoints: ["/metrics"],
    },
    {
      id: "jarvis-captures",
      name: "Capturas por Tipo",
      category: "metrics",
      description: "Conteo de capturas por clase (person, car, truck)",
      defaultSize: "small",
      endpoints: ["/metrics"],
    },
    {
      id: "jarvis-zones",
      name: "Monitor de Zonas",
      category: "status",
      description: "Estado de zonas monitoreadas (activa/inactiva)",
      defaultSize: "small",
      endpoints: ["/metrics"],
    },
    {
      id: "jarvis-alerts",
      name: "Alertas Recientes",
      category: "alerts",
      description: "Feed de alertas con zona, clase y severidad",
      defaultSize: "medium",
      endpoints: ["/alerts"],
    },
  ],
  endpoints: [
    { path: "/stream", method: "GET", description: "MJPEG video stream" },
    { path: "/snapshot", method: "GET", description: "Single JPEG frame" },
    { path: "/health", method: "GET", description: "System health status" },
    { path: "/metrics", method: "GET", description: "Full system metrics" },
    { path: "/alerts", method: "GET", description: "Recent alerts list" },
    { path: "/contention", method: "GET", description: "Contention system state" },
    { path: "/zones", method: "GET", description: "Zones for selected camera" },
    { path: "/zones", method: "PUT", description: "Persist zones for selected camera" },
    { path: "/zones/cameras", method: "GET", description: "Available camera keys for zones" },
    { path: "/runtime-logs", method: "GET", description: "Runtime logs by category" },
    { path: "/runtime-config", method: "GET", description: "Runtime performance and module config" },
    { path: "/runtime-config", method: "PUT", description: "Update runtime performance and module config" },
  ],
};

class AgentRegistry {
  private agents: Map<string, DeployedAgent> = new Map();

  constructor() {
    // Jarvis se registra por defecto
    this.register(jarvisAgent);
  }

  register(agent: DeployedAgent) {
    this.agents.set(agent.id, agent);
  }

  unregister(agentId: string) {
    this.agents.delete(agentId);
  }

  get(agentId: string): DeployedAgent | undefined {
    return this.agents.get(agentId);
  }

  getAll(): DeployedAgent[] {
    return Array.from(this.agents.values());
  }

  getAllWidgets(): (WidgetDefinition & { agentId: string; agentName: string })[] {
    const widgets: (WidgetDefinition & { agentId: string; agentName: string })[] = [];
    for (const agent of this.agents.values()) {
      for (const widget of agent.widgets) {
        widgets.push({ ...widget, agentId: agent.id, agentName: agent.name });
      }
    }
    return widgets;
  }

  updateStatus(agentId: string, status: DeployedAgent["status"]) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
    }
  }
}

export const agentRegistry = new AgentRegistry();
