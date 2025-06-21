// src/components/Protected.tsx
import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
export function Protected({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isloading = useAuthStore((state) => state.isLoading);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.user) {
        useAuthStore.setState({
          user: parsed.user,
          accessToken: parsed.accessToken,
          refreshToken: parsed.refreshToken,
        });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user && !isloading) {
      window.location.href = "/login";
    }
  }, [user, isloading]);

  if (isloading) return null;

  return <>{user ? children : null}</>;
}
export function RedirectAuth({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const setLoading = useAuthStore((state) => state.setLoading);
  const isloading = useAuthStore((state) => state.isLoading);
  useEffect(() => {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.user) {
        useAuthStore.setState({
          user: parsed.user,
          accessToken: parsed.accessToken,
          refreshToken: parsed.refreshToken,
        });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isloading && user) {
      window.location.href = "/home";
    }
  }, [user, isloading]);

  if (isloading) return null;

  return <>{user ? children : null}</>;
}
