import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  detail?: string;
  result: "OK" | "DENEGADO" | "ERROR";
  origin: string;
}

interface AuditContextValue {
  entries: AuditEntry[];
  log: (action: string, resource: string, detail?: string, result?: AuditEntry["result"]) => void;
  exportJSON: () => string;
  exportCSV: () => string;
  clear: () => void;
}

type RuntimeLogLine = {
  category?: string;
  message?: string;
  time_str?: string;
};

const AuditContext = createContext<AuditContextValue | null>(null);

let auditCounter = 0;

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    let alive = true;

    const bootstrapFromRuntimeLogs = async () => {
      try {
        const res = await fetch("/api/agents/jarvis/runtime-logs?category=all&limit=60");
        if (!res.ok) return;
        const data = await res.json();
        const logs: RuntimeLogLine[] = Array.isArray(data?.logs) ? data.logs : [];

        const bootEntries: AuditEntry[] = logs.map((line, idx) => {
          const category = String(line?.category ?? "system");
          const message = String(line?.message ?? "");
          const isCritical = category === "critical";
          return {
            id: `boot-${Date.now()}-${idx}`,
            timestamp: String(line?.time_str ?? new Date().toLocaleString("es-ES")),
            actor: "JARVIS",
            actorRole: "system",
            action: isCritical ? "Runtime error" : "Runtime event",
            resource: `runtime.${category}`,
            detail: message,
            result: isCritical ? "ERROR" : "OK",
            origin: window.location.hostname || "localhost",
          };
        });

        if (!alive || bootEntries.length === 0) return;
        setEntries((prev) => (prev.length > 0 ? prev : bootEntries));
      } catch {
        // Keep audit stream operational even if runtime log bootstrap fails.
      }
    };

    bootstrapFromRuntimeLogs();
    return () => {
      alive = false;
    };
  }, []);

  const log = useCallback(
    (action: string, resource: string, detail?: string, result: AuditEntry["result"] = "OK") => {
      const entry: AuditEntry = {
        id: `a-${Date.now()}-${++auditCounter}`,
        timestamp: new Date().toLocaleString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        actor: user?.name ?? "Sistema",
        actorRole: user?.role ?? "unknown",
        action,
        resource,
        detail,
        result,
        origin: window.location.hostname || "localhost",
      };
      setEntries((prev) => [entry, ...prev]);
    },
    [user]
  );

  const exportJSON = useCallback(() => {
    return JSON.stringify(entries, null, 2);
  }, [entries]);

  const exportCSV = useCallback(() => {
    const headers = "timestamp,actor,actorRole,action,resource,detail,result,origin";
    const rows = entries.map(
      (e) =>
        `"${e.timestamp}","${e.actor}","${e.actorRole}","${e.action}","${e.resource}","${e.detail ?? ""}","${e.result}","${e.origin}"`
    );
    return [headers, ...rows].join("\n");
  }, [entries]);

  const clear = useCallback(() => {
    setEntries([]);
  }, []);

  return (
    <AuditContext.Provider value={{ entries, log, exportJSON, exportCSV, clear }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error("useAudit must be used within AuditProvider");
  return ctx;
}
