import { login, register } from "@/services/auth_services";
import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: User | null;

  refreshToken: string | null;
  isLoading: boolean;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      register: async (username: string, email: string, password: string) => {
        try {
          const { user, refresh_token } = await register(
            username,
            email,
            password,
          );
          set({
            user,
            refreshToken: refresh_token,
          });
        } catch (error) {
          console.error("Registration failed:", error);
        }
      },
      login: async (email: string, password: string) => {
        try {
          const { user, refresh_token } = await login(email, password);
          set({
            user,

            refreshToken: refresh_token,
          });
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      logout: () => {
        set({ user: null, refreshToken: null });
        localStorage.clear();
      },
      refresh: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;
        try {
          // const { accessToken } = await res.json();
          // set({ accessToken });
        } catch (error) {
          console.error(error);
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
