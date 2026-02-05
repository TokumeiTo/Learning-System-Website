import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: ReactNode;
  allowedPositions?: string[]; // Use ["Admin", "SuperAdmin"]
}

export function ProtectedRoute({ children, allowedPositions }: Props) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Filter based on the position string from LoginResponse
  if (allowedPositions && !allowedPositions.includes(user.position)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}