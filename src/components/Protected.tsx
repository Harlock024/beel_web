// src/components/Protected.tsx
import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
export function Protected({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      console.log("User not authenticated, redirecting to login");
      console.log("isAuthenticated:", isAuthenticated);
    } else {
      window.location.href = "/home";
      console.log("User authenticated, navigating to home");
    }
  }, [isAuthenticated]);
  return <>{isAuthenticated ? children : null}</>;
}
export function useProtected() {
  const isAuthenticated = useAuthStore((state) => state.user);
}
