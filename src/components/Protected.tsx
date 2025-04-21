// src/components/Protected.tsx
import { useEffect } from "react";

import { useAuthStore } from "../stores/useAuthStore";

export function Protected({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.user);

  return <>{isAuthenticated ? children : null}</>;
}
