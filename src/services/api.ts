// // api.ts
// const API_BASE_URL =
//   process.env.REACT_APP_API_URL || "https://pos-backend-0fji.onrender.com/api";

// class ApiService {
//   private getAuthHeaders(): HeadersInit {
//     const token = localStorage.getItem("authToken");
//     return {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//     };
//   }

//   async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
//     const url = `${API_BASE_URL}${endpoint}`;
//     const config: RequestInit = {
//       headers: this.getAuthHeaders(),
//       ...options,
//     };

//     try {
//       const response = await fetch(url, config);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("API request failed:", error);
//       throw error;
//     }
//   }

//   async get<T>(endpoint: string): Promise<T> {
//     return this.request<T>(endpoint);
//   }

//   async post<T>(endpoint: string, data: any): Promise<T> {
//     return this.request<T>(endpoint, {
//       method: "POST",
//       body: JSON.stringify(data),
//     });
//   }

//   async put<T>(endpoint: string, data: any): Promise<T> {
//     return this.request<T>(endpoint, {
//       method: "PUT",
//       body: JSON.stringify(data),
//     });
//   }

//   async patch<T>(endpoint: string, data: any): Promise<T> {
//     return this.request<T>(endpoint, {
//       method: "PATCH",
//       body: JSON.stringify(data),
//     });
//   }

//   async delete<T>(endpoint: string): Promise<T> {
//     return this.request<T>(endpoint, {
//       method: "DELETE",
//     });
//   }
// }

// export const apiService = new ApiService();

// api.ts

// With Netlify proxy, all API calls go through /api/*
// api.ts
// const API_BASE_URL = "/api"; // ✅ cleaner, works with proxy rules

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

      const res = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();
      if (data.access) { // <--- Django JWT usually returns `access`
        localStorage.setItem("authToken", data.access);
        return data.access;
      }

      return null;
    } catch (err) {
      console.error("Token refresh failed:", err);
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      return null;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    let config: RequestInit = { headers: this.getAuthHeaders(), ...options };

    try {
      let response = await fetch(url, config);

      if (response.status === 401) {
        const newToken = await this.refreshAccessToken();
        if (newToken) {
          config.headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          };
          response = await fetch(url, config);
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (err) {
      console.error("API request failed:", err);
      throw err;
    }
  }

  get<T>(endpoint: string) { return this.request<T>(endpoint); }
  post<T>(endpoint: string, data: any) { return this.request<T>(endpoint, { method: "POST", body: JSON.stringify(data) }); }
  put<T>(endpoint: string, data: any) { return this.request<T>(endpoint, { method: "PUT", body: JSON.stringify(data) }); }
  patch<T>(endpoint: string, data: any) { return this.request<T>(endpoint, { method: "PATCH", body: JSON.stringify(data) }); }
  delete<T>(endpoint: string) { return this.request<T>(endpoint, { method: "DELETE" }); }
}

export const apiService = new ApiService();