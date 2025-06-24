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
api_client.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const {accessToken} = useAuthStore.getState();
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
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
      const {refreshToken} = useAuthStore.getState();

      try {
        const refreshRes = await axios.post<LoginResponse>(
          `${API_URL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (refreshRes.status === 200 && refreshRes.data?.access_token) {
          console.log("Token refresh successful");
        
          useAuthStore.setState({
            user: refreshRes.data.user || useAuthStore.getState().user,
            accessToken: refreshRes.data.access_token,
            refreshToken: refreshRes.data.refresh_token || refreshToken, 
          });

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${refreshRes.data.access_token}`;
          }

          return api_client(originalRequest);
        } else {
          console.log("Invalid refresh response, redirecting to login");
          useAuthStore.getState().logout();
          window.location.href = "/login";
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
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
