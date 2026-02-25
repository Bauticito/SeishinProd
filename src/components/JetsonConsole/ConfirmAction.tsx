import { useState, useCallback, useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { usePermission } from "./PermissionGate";

type Severity = "warning" | "danger" | "primary";

interface ConfirmActionProps {
  /** Action label shown on the button */
  label: string;
  /** Granular permission required, e.g. "admin.maintenance.execute" */
  permission?: string;
  /** Callback fired after double confirmation */
  onConfirm: () => void;
  /** Optional callback for audit logging */
  onAudit?: (action: string) => void;
  /** Visual severity level */
  severity?: Severity;
  /** Auto-cancel confirmation after N seconds (default 5) */
  timeout?: number;
  /** Make button full width */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const severityStyles: Record<Severity, string> = {
  warning: "border-status-warning/40 text-status-warning hover:bg-status-warning/10",
  danger: "border-status-error/40 text-status-error hover:bg-status-error/10",
  primary: "border-primary/40 text-primary hover:bg-primary/10",
};

/**
 * Standardized double-confirmation button for critical actions.
 * First click → "Confirmar: [label]" with countdown.
 * Second click → executes onConfirm + logs to audit if provided.
 * Auto-cancels after timeout seconds.
 *
 * Optionally gated by a permission string.
 */
export function ConfirmAction({
  label,
  permission,
  onConfirm,
  onAudit,
  severity = "warning",
  timeout = 5,
  fullWidth = false,
  className = "",
}: ConfirmActionProps) {
  const [pending, setPending] = useState(false);
  const [countdown, setCountdown] = useState(timeout);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasPerms = permission ? usePermission(permission) : true;

  const cancel = useCallback(() => {
    setPending(false);
    setCountdown(timeout);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [timeout]);

  useEffect(() => {
    if (!pending) return;
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          cancel();
          return timeout;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pending, cancel, timeout]);

  const handleClick = () => {
    if (!pending) {
      setPending(true);
      setCountdown(timeout);
      return;
    }
    // Second click — execute
    onConfirm();
    onAudit?.(label);
    cancel();
  };

  if (!hasPerms) {
    return (
      <button
        disabled
        className={`text-xs font-mono px-3 py-1.5 rounded border opacity-40 cursor-not-allowed ${severityStyles[severity]} ${fullWidth ? "w-full" : ""} ${className}`}
        title="Sin permisos para esta acción"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors ${severityStyles[severity]} ${
        pending ? "animate-pulse ring-1 ring-current" : ""
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {pending ? (
        <span className="flex items-center gap-1.5 justify-center">
          <AlertTriangle className="w-3 h-3" />
          Confirmar: {label} ({countdown}s)
        </span>
      ) : (
        label
      )}
    </button>
  );
}
