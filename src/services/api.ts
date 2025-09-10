// src/services/api.ts
const API_BASE_URL = "https://pos-backend-0fji.onrender.com/api";

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

      const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
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

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      throw new Error(`HTTP ${response.status} - ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, { method: "POST", body: JSON.stringify(data) });
  }

  put<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, { method: "PUT", body: JSON.stringify(data) });
  }

  patch<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, { method: "PATCH", body: JSON.stringify(data) });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // LOGIN
  async login(email: string, password: string) {
    const data = await this.post<{ access: string; refresh: string; user: any }>("/auth/login/", { email, password });
    localStorage.setItem("authToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    return data.user;
  }

  // REGISTER
  async register(email: string, password: string, name: string, role: "admin" | "cashier" = "cashier") {
    const data = await this.post<{ access: string; refresh: string; user: any }>("/auth/register/", { email, password, name, role });
    localStorage.setItem("authToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    return data.user;
  }

  // GET CURRENT USER
  async getCurrentUser() {
    return this.get<any>("/auth/me/");
  }

  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  }
}

export const apiService = new ApiService();
