import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export function SuperAdminGate({ children }: { children: ReactNode }) {
  const { isSuper, loading } = useAuth();

  if (loading) return null;
  if (!isSuper) return <Navigate to="/profile" replace />;
  return <>{children}</>;
}
