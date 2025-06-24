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
  setLoading: (loading: boolean) => void;
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
            isLoading: false,
            user,
            accessToken: access_token,
            refreshToken: refresh_token,
          });
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      logout: () => {
        localStorage.clear();
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
