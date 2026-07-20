import { useAuthStore } from "@/stores/useAuthStore";

export function Protected({ children }: { children: React.ReactNode }) {
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return null;

  return <>{children}</>;
}
