// src/components/Protected.tsx
import { useEffect } from "react";

import { useAuthStore } from "../stores/useAuthStore";

export function Protected({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      console.error("User is not authenticated");
    }
  }, [isAuthenticated]);

  return isAuthenticated;

  return <>{isAuthenticated ? children : null}</>;
}
export function useProtected() {
  const isAuthenticated = useAuthStore((state) => state.user);
}
