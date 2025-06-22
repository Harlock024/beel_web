import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export function Protected({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/login"; 
    }
  }, [user, isLoading]);

  if (isLoading) return null;

  return <>{user ? children : null}</>;
}