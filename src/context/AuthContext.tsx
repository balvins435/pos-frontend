// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "cashier";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    role?: "admin" | "cashier"
  ) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Attempt to load user on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // Optional: call an endpoint to fetch current user
          const data = await apiService.get<User>("/auth/me/");
          setUser(data);
        } catch {
          apiService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiService.login(email, password); // stores tokens in localStorage
      // fetch user info
      const currentUser = await apiService.get<User>("/auth/me/");
      setUser(currentUser);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: "admin" | "cashier" = "cashier"
  ) => {
    try {
      const data = await apiService.post<{
        access: string;
        refresh: string;
        user: User;
      }>("/auth/register/", {
        email,
        password,
        name,
        role,
      });

      localStorage.setItem("authToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error("Registration failed:", err);
      return false;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
