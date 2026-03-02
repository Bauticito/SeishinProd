import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasAccess } from "@/lib/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/jetson/login" state={{ from: location }} replace />;
  }

  if (!hasAccess(user.role, location.pathname)) {
    return <Navigate to="/jetson" replace />;
  }

  return <>{children}</>;
}
