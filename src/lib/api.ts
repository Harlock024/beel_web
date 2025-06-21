import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_URL } from "../services/api_url";

import { useAuthStore } from "@/stores/useAuthStore";

export const api_client: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api_client.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api_client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;
      const refresh = useAuthStore.getState().refreshToken;

      try {
        const refreshRes = await axios.post(
          `${API_URL}/auth/refresh`,
          {
            refresh_token: refresh,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (refreshRes.status === 200 && refreshRes.data?.access_token) {
          localStorage.setItem("access_token", refreshRes.data.access_token);
          if (refreshRes.data.refresh_token) {
            useAuthStore.setState({
              accessToken: refreshRes.data.access_token,
              refreshToken: refreshRes.data.refresh_token,
            });
          }
          return api_client(originalRequest);
        } else {
          window.location.href = "/login";
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export function handleAxiosError(error: unknown, name: string): never {
  if (axios.isAxiosError(error)) {
    const msg = (error.response?.data as any)?.error || error.message;
    console.error(`${name} Axios error:`, msg);
    throw new Error(`${name} failed: ${msg}`);
  }
  console.error(`${name} Unexpected error:`, error);
  throw new Error(`${name} failed: unexpected error`);
}
