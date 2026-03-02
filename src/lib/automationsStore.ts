import type { Role } from "@/lib/permissions";

export type AutomationAgentType =
  | "security-agent"
  | "fire-detector"
  | "intrusion-zone"
  | "fall-detection"
  | "ppe-compliance"
  | "occupancy-counter"
  | "abandoned-object"
  | "unauthorized-vehicle";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IntegrationStatus = "configured" | "pending" | "error";

export type Rule = {
  id: string;
  name: string;
  enabled: boolean;
  condition: string;
  action: string;
  severity: Severity;
  cooldownSeconds: number;
};

export type Integration = {
  name: string;
  category: string;
  status: IntegrationStatus;
  lastSync: string;
};

export type AutomationConfig = {
  tenantId: string;
  cameraId: string;
  selectedAgent: AutomationAgentType;
  rules: Rule[];
  alerts247: boolean;
  quietHours: boolean;
  ackWindow: number;
  escalationEnabled: boolean;
  primaryChannel: string;
  integrations: Integration[];
  version: number;
  updatedAt: string;
};

const STORAGE_KEY = "thor-automations-config-v1";

export function resolveTenantId(user: { role: Role; email: string }): string {
  if (user.role === "cliente") {
    if (user.email.includes("cliente.demo")) return "tenant-client-c07";
    return "tenant-client-generic";
  }
  return "tenant-internal-ops";
}

function loadAll(): Record<string, AutomationConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, AutomationConfig>;
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, AutomationConfig>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function configKey(tenantId: string, cameraId: string) {
  return `${tenantId}::${cameraId}`;
}

export function loadAutomationConfig(tenantId: string, cameraId: string): AutomationConfig | null {
  const all = loadAll();
  return all[configKey(tenantId, cameraId)] ?? null;
}

export function saveAutomationConfig(next: Omit<AutomationConfig, "version" | "updatedAt">) {
  const all = loadAll();
  const key = configKey(next.tenantId, next.cameraId);
  const prev = all[key];
  const version = (prev?.version ?? 0) + 1;
  all[key] = {
    ...next,
    version,
    updatedAt: new Date().toISOString(),
  };
  saveAll(all);
  return all[key];
}
