// Front-office uniquement : pas d'authentification.
import type { ReactNode } from "react";

export type AuthUser = {
  username: string;
  roles: string[];
  maintenanceAccess: boolean;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useAuth(): { user: AuthUser | null } {
  return { user: null };
}
