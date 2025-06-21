import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isAuthenticated) {
        window.location.href = "/login";
      } else {
        window.location.href = "/home";
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>Cargando...</div>
    );
  }

  return <>{children}</>;
}
