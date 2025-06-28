import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_URL } from "../services/api_url";

import { useAuthStore } from "@/stores/useAuthStore";
import { LoginResponse } from "@/services/auth_services";

export const api_client: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


let refreshPromise: Promise<string> | null = null;


api_client.interceptors.request.use(
  (async (config) => {
    
    if (typeof window !== "undefined" && refreshPromise) {
      await refreshPromise;

      const {accessToken} =  useAuthStore.getState();
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  }),
  (error) => Promise.reject(error),
);


api_client.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined" && refreshPromise) {
      await refreshPromise; // Esperar a que termine el refresh antes de continuar
    }
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api_client.interceptors.response.use(
  (response) => response,
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

      const { refreshToken } = useAuthStore.getState();

      if (!refreshToken) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post<LoginResponse>(
              `${API_URL}/auth/refresh`,
              { refresh_token: refreshToken },
              { headers: { "Content-Type": "application/json" } }
            )
            .then((res) => {
              if (res.status === 200) {
                useAuthStore.setState({
                  user: res.data.user || useAuthStore.getState().user,
                  accessToken: res.data.access_token,
                  refreshToken: res.data.refresh_token || refreshToken,
                });
                api_client.defaults.headers.common["Authorization"] = `Bearer ${res.data.access_token}`;
                return res.data.access_token;
              } else {
                throw new Error("Invalid refresh response");
              }
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api_client(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
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
