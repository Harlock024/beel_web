import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_URL } from "../services/api_url";

export const api_client: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api_client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshRes = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (refreshRes.status == 200) {
        return api_client(originalRequest);
      }

      try {
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
    const msg = error.response?.data?.error || error.message;
    console.error(`${name} Axios error:`, msg);
    throw new Error(`${name} failed: ${msg}`);
  }
  console.error(`${name} Unexpected error:`, error);
  throw new Error(`${name} failed: unexpected error`);
}
