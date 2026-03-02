export type Role = "superadmin" | "admin" | "operador" | "etiquetador" | "cliente";

// Granular permission actions
export type PermissionAction = "read" | "execute" | "update" | "delete" | "export" | "admin";

// Permission level hierarchy
const actionLevel: Record<PermissionAction, number> = {
  read: 1,
  export: 2,
  execute: 3,
  update: 4,
  delete: 5,
  admin: 6,
};

// Granular resource.action permissions
// Format: "resource.action" → which roles have it
const granularPermissions: Record<string, Role[]> = {
  // Dashboard
  "dashboard.read":                 ["superadmin", "admin", "operador", "etiquetador", "cliente"],
  "dashboard.export":               ["superadmin", "admin"],

  // Inference
  "inference.read":                 ["superadmin", "admin", "operador", "etiquetador", "cliente"],
  "inference.execute":              ["superadmin", "admin", "operador", "cliente"],
  "inference.update":               ["superadmin", "admin"],
  "inference.debug":                ["superadmin", "admin", "operador"],
  "inference.capture":              ["superadmin", "admin", "operador"],

  // Automations (only admin + operador by product requirement)
  "automations.read":               ["admin", "operador"],
  "automations.agent.configure":    ["admin", "operador"],
  "automations.rules.update":       ["admin", "operador"],
  "automations.alerts.update":      ["admin", "operador"],
  "automations.integrations.manage":["admin", "operador"],
  "automations.escalation.manage":  ["admin", "operador"],

  // Cameras (only superadmin + operador)
  "cameras.read":                   ["superadmin", "operador"],
  "cameras.onboard":                ["superadmin", "operador"],
  "cameras.test.run":               ["superadmin", "operador"],
  "cameras.test.schedule":          ["superadmin", "operador"],
  "cameras.credentials.rotate":     ["superadmin"],
  "cameras.delete":                 ["superadmin"],

  // Models
  "models.read":                    ["superadmin", "admin", "operador", "etiquetador", "cliente"],
  "models.activate":                ["superadmin", "admin", "operador"],
  "models.convert":                 ["superadmin", "admin"],
  "models.export":                  ["superadmin", "admin"],
  "models.delete":                  ["superadmin"],

  // Datasets
  "datasets.read":                  ["superadmin", "admin", "operador", "etiquetador", "cliente"],
  "datasets.update":                ["superadmin", "admin", "etiquetador"],
  "datasets.delete":                ["superadmin", "admin"],
  "datasets.export":                ["superadmin", "admin", "etiquetador"],

  // Training
  "training.read":                  ["superadmin", "admin", "operador", "etiquetador"],
  "training.execute":               ["superadmin", "admin", "operador"],
  "training.update":                ["superadmin", "admin"],

  // Logs
  "logs.read":                      ["superadmin", "admin", "operador", "etiquetador"],
  "logs.export":                    ["superadmin", "admin"],

  // Modules
  "modules.read":                   ["superadmin", "admin", "operador"],
  "modules.toggle":                 ["superadmin", "admin"],
  "modules.update":                 ["superadmin"],

  // Admin - System
  "admin.panel.read":               ["superadmin", "admin"],
  "admin.system.read":              ["superadmin", "admin"],
  "admin.system.update":            ["superadmin"],

  // Admin - Users
  "admin.users.read":               ["superadmin", "admin"],
  "admin.users.create":             ["superadmin"],
  "admin.users.update":             ["superadmin", "admin"],
  "admin.users.block":              ["superadmin", "admin"],
  "admin.users.revoke":             ["superadmin"],
  "admin.users.resetmfa":           ["superadmin", "admin"],

  // Admin - Network
  "admin.network.read":             ["superadmin", "admin"],
  "admin.network.update":           ["superadmin"],
  "admin.network.unmask":           ["superadmin"],

  // Admin - Audit
  "admin.audit.read":               ["superadmin", "admin"],
  "admin.audit.export":             ["superadmin", "admin"],
  "admin.audit.diagnostic":         ["superadmin"],

  // Admin - Backups
  "admin.backups.read":             ["superadmin", "admin"],
  "admin.backups.restore":          ["superadmin"],
  "admin.backups.update":           ["superadmin"],

  // Admin - Maintenance
  "admin.maintenance.read":         ["superadmin", "admin"],
  "admin.maintenance.execute":      ["superadmin"],
  "admin.maintenance.schedule":     ["superadmin", "admin"],

  // Admin - Integrations
  "admin.integrations.read":        ["superadmin", "admin"],
  "admin.integrations.rotate":      ["superadmin"],

  // Accounts
  "accounts.read":                  ["superadmin", "admin", "operador", "etiquetador", "cliente"],
  "accounts.manage":                ["superadmin", "admin"],
  "accounts.self.update":           ["superadmin", "admin", "operador", "etiquetador", "cliente"],

  // Billing
  "billing.read":                   ["superadmin", "admin", "cliente"],
  "billing.update":                 ["superadmin"],
};

/**
 * Check if a role has a specific granular permission.
 * @example hasPermission("operador", "models.activate") → true
 */
export function hasPermission(role: Role, permission: string): boolean {
  const allowed = granularPermissions[permission];
  if (!allowed) return false;
  return allowed.includes(role);
}

/**
 * Check if a role has at minimum a given action level on a resource.
 * Uses the action hierarchy to allow "higher" actions to imply "lower" ones.
 */
export function hasMinAction(role: Role, resource: string, minAction: PermissionAction): boolean {
  const minLevel = actionLevel[minAction];
  // Check all permissions for this resource
  for (const [key, roles] of Object.entries(granularPermissions)) {
    if (!key.startsWith(resource + ".")) continue;
    if (!roles.includes(role)) continue;
    const action = key.split(".").pop() as string;
    if (action in actionLevel && actionLevel[action as PermissionAction] >= minLevel) {
      return true;
    }
  }
  return false;
}

// Map route paths to resource keys for route-level access
const routeToResource: Record<string, string> = {
  "/jetson": "dashboard",
  "/jetson/inference": "inference",
  "/jetson/automations": "automations",
  "/jetson/cameras": "cameras",
  "/jetson/cameras/inventory": "cameras",
  "/jetson/cameras/validation": "cameras",
  "/jetson/cameras/delimiter": "cameras",
  "/jetson/models": "models",
  "/jetson/datasets": "datasets",
  "/jetson/training": "training",
  "/jetson/logs": "logs",
  "/jetson/modules": "modules",
  "/jetson/admin": "admin.panel",
  "/jetson/accounts": "accounts",
  "/jetson/billing": "billing",
};

/**
 * Check if a role can access a given route (has at least .read on the resource).
 */
export function hasAccess(role: Role, path: string): boolean {
  const resource = routeToResource[path];
  if (!resource) return true;
  return hasPermission(role, `${resource}.read`);
}

/**
 * Check if a role is an admin-level role.
 */
export function isAdmin(role: Role): boolean {
  return role === "superadmin" || role === "admin";
}

/**
 * Get visible route paths for a given role (for sidebar filtering).
 */
export function getVisibleRoutes(role: Role): string[] {
  return Object.entries(routeToResource)
    .filter(([, resource]) => hasPermission(role, `${resource}.read`))
    .map(([path]) => path);
}

/**
 * Get all permission keys (useful for admin display).
 */
export function getAllPermissions(): string[] {
  return Object.keys(granularPermissions);
}

/**
 * Get all permissions for a role.
 */
export function getRolePermissions(role: Role): string[] {
  return Object.entries(granularPermissions)
    .filter(([, roles]) => roles.includes(role))
    .map(([key]) => key);
}
