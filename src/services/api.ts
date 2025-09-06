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
const API_BASE_URL = "/api"; // ✅ cleaner, works with proxy rules

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

      if (!response.ok) {
        throw new Error("Refresh failed");
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        return data.token;
      }

      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      return null;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    let config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      let response = await fetch(url, config);

      // 🔄 If token expired, try refresh
      if (response.status === 401) {
        const newToken = await this.refreshAccessToken();
        if (newToken) {
          config = {
            ...options,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
          };
          response = await fetch(url, config);
        }
      }

      // ❌ Handle non-OK responses with detailed logging
      if (!response.ok) {
        let errorData: any = null;
        try {
          errorData = await response.json();
        } catch (_) {
          errorData = await response.text(); // fallback if not JSON
        }
        console.error("API error response:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status} - ${JSON.stringify(
            errorData
          )}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
