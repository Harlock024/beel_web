import { login, register } from "@/services/auth_services";
import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  clearAuth: () => void;
  logout: () => void;
};

const clearPersistedAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth-storage");
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: true,
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      register: async (username: string, email: string, password: string) => {
        try {
          const { user, access_token, refresh_token } = await register(
            username,
            email,
            password,
          );
          set({
            user,
            accessToken: access_token,
            refreshToken: refresh_token,
          });
        } catch (error) {
          console.error("Registration failed:", error);
          set({ isLoading: false });
          throw error;
        }
      },
      login: async (email: string, password: string) => {
        try {
          const { user, access_token, refresh_token } = await login(
            email,
            password,
          );
          set({
            isLoading: false,
            user,
            accessToken: access_token,
            refreshToken: refresh_token,
          });
        } catch (error) {
          console.error("Login failed:", error);
          set({ isLoading: false });
          throw error;
        }
      },
      clearAuth: () => {
        set({ user: null, accessToken: null, refreshToken: null, isLoading: false });
        clearPersistedAuth();
      },
      logout: () => {
        get().clearAuth();
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false);
      },
    },
  ),
);
