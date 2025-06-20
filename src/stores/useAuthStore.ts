import { login, register } from "@/services/auth_services";
import { User } from "@/types/user";
import { AstroCookies } from "astro";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      register: async (username: string, email: string, password: string) => {
        try {
          const { user } = await register(username, email, password);
          set({
            user,
          });
        } catch (error) {
          console.error("Registration failed:", error);
        }
      },
      login: async (email: string, password: string) => {
        try {
          const { user } = await login(email, password);
          console.log("User logged in:", user);
          set({
            user,
          });
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      logout: () => {
        set({ user: null });
        localStorage.clear();
        document.cookie =
          "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        window.location.href = "/";
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
