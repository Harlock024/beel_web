import { login, register } from "@/services/auth_services";
import { User } from "@/types/user";
import { AstroCookies } from "astro";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
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
      accessToken: null,
      refreshToken: null,
      isLoading: false,
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
        }
      },
      login: async (email: string, password: string) => {
        console.log("login in process");
        try {
          const { user, access_token, refresh_token } = await login(
            email,
            password,
          );
          console.log("User logged in:", user);
          set({
            isLoading: true,
            user,
            accessToken: access_token,
            refreshToken: refresh_token,
          });
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
        localStorage.clear();
        window.location.href = "/";
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
