import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api"; // ✅ central API service

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "employee";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  register: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Refresh token handler
  const refreshAccessToken = async () => {
    try {
      const refresh = localStorage.getItem("refreshToken");
      if (!refresh) return null;

      const data = await apiService.post<{ token: string }>("/auth/refresh/", {
        refresh,
      });

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        return data.token;
      }
      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    }
  };

  // ✅ Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (token) {
          try {
            const userData = await apiService.get<User>("/auth/validate/");
            setUser(userData);
          } catch (err) {
            // If validation fails, try refresh
            const newToken = await refreshAccessToken();
            if (newToken) {
              const userData = await apiService.get<User>("/auth/validate/");
              setUser(userData);
            } else {
              localStorage.removeItem("authToken");
              localStorage.removeItem("refreshToken");
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register
  const register = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    try {
      const data = await apiService.post<{
        token: string;
        refresh: string;
        user: User;
      }>("/register/", {
        username,
        email,
        password,
        confirm_password: confirmPassword,
      });

      if (data.token) localStorage.setItem("authToken", data.token);
      if (data.refresh) localStorage.setItem("refreshToken", data.refresh);
      if (data.user) setUser(data.user);

      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  // ✅ Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await apiService.post<{
        token: string;
        refresh: string;
        user: User;
      }>("/login/", {
        email,
        password,
      });

      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      if (data.refresh) {
        localStorage.setItem("refreshToken", data.refresh);
      }

      if (data.user) {
        setUser(data.user);
      }

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
