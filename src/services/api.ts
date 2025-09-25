// src/services/api.ts

// Decide API base URL depending on environment
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || // ✅ Explicitly set in Netlify if needed
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api" // ✅ Local dev
    : "/api"); // ✅ Production (Netlify proxy to Render)

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async refreshAccessToken(): Promise<string | null> {
    try {
      const refresh = localStorage.getItem("refreshToken");
      if (!refresh) return null;

      const response = await fetch(`${API_BASE_URL}/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      if (data.access) {
        localStorage.setItem("authToken", data.access);
        return data.access;
      }
      return null;
    } catch (err) {
      console.error("Token refresh failed:", err);
      this.logout();
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    let config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    let response = await fetch(url, config);

    if (response.status === 401) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        config.headers = this.getAuthHeaders();
        response = await fetch(url, config);
      }
    }

    if (!response.ok) {
      let errorMessage: string;
      const contentType = response.headers.get("content-type");

      try {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = JSON.stringify(errorData);
        } else {
          const errorText = await response.text();
          errorMessage = errorText || response.statusText;
        }
      } catch {
        errorMessage = response.statusText || "Unknown error";
      }

      throw new Error(`HTTP ${response.status} - ${errorMessage}`);
    }

    const contentLength = response.headers.get("content-length");
    const contentType = response.headers.get("content-type");

    if (contentLength === "0" || response.status === 204) {
      return {} as T;
    }

    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return response.text() as unknown as T;
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async login(email: string, password: string) {
    const data = await this.post<{
      id: number;
      username: string;
      email: string;
      role: string;
      access: string;
      refresh: string;
      message: string;
    }>("/login/", { email, password });

    localStorage.setItem("authToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    return data;
  }

  async register(
    email: string,
    password: string,
    name: string,
    role: "admin" | "cashier" = "cashier"
  ) {
    const data = await this.post<{
      id: number;
      username: string;
      email: string;
      role: string;
      access: string;
      refresh: string;
      message: string;
    }>("/register/", { email, password, username: name, role });

    localStorage.setItem("authToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    return data;
  }

  async getCurrentUser() {
    return null; // can be implemented later
  }

  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  }
}

export const apiService = new ApiService();
