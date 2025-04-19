import { User } from "@/types/user";
import { API_URL } from "./api_url";

export type LoginResponse = {
  user: User;
  access_token: string;
  refresh_token: string;
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    throw new Error("Login failed");
  }
}

export async function refresh() {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Refresh failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Refresh failed");
  }
}

export async function logout() {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Logout failed");
  }
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    throw new Error("Registration failed");
  }
}
