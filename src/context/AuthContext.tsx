import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api"; // ✅ import your ApiService

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "employee";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          // ✅ use ApiService instead of hardcoded fetch
          const userData = await apiService.get<User>("/auth/validate/");
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("authToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // ✅ use ApiService instead of hardcoded fetch
      const data = await apiService.post<{ token: string; user: User }>(
        "/login/",
        {
          email,
          password,
        }
      );

      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      if (data.user) {
        setUser(data.user);
      }

      return true; // ✅ success
    } catch (error) {
      console.error("Login failed:", error);
      return false; // ❌ failure
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
