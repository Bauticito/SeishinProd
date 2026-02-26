import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions";

interface PermissionGateProps {
  /** The granular permission required, e.g. "models.delete" */
  permission: string;
  /** What to render when the user doesn't have permission */
  fallback?: "hide" | "disable" | React.ReactNode;
  children: React.ReactNode;
}

/**
 * Gate component that conditionally renders or disables children
 * based on the current user's granular permissions.
 *
 * @example
 * <PermissionGate permission="models.delete" fallback="hide">
 *   <button onClick={handleDelete}>Eliminar</button>
 * </PermissionGate>
 *
 * @example
 * <PermissionGate permission="modules.toggle" fallback="disable">
 *   <button onClick={handleToggle}>Toggle</button>
 * </PermissionGate>
 */
export function PermissionGate({
  permission,
  fallback = "hide",
  children,
}: PermissionGateProps) {
  const { user } = useAuth();

  if (!user) return null;

  const allowed = hasPermission(user.role, permission);

  if (allowed) return <>{children}</>;

  if (fallback === "hide") return null;

  if (fallback === "disable") {
    return (
      <div className="pointer-events-none opacity-40 select-none" title="Sin permisos">
        {children}
      </div>
    );
  }

  // Custom fallback JSX
  return <>{fallback}</>;
}

/**
 * Hook version for programmatic permission checks.
 * @example const canDelete = usePermission("models.delete");
 */
export function usePermission(permission: string): boolean {
  const { user } = useAuth();
  if (!permission) return true;
  if (!user) return false;
  return hasPermission(user.role, permission);
}
