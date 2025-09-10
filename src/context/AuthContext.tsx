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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiService.post<{ token: string; user: User }>("/login/", { email, password });
      localStorage.setItem("authToken", data.token);
      setUser(data.user);
      return true;
    } catch {
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
      const data = await apiService.post<{ token: string; user: User }>("/register/", { email, password, name, role });
      localStorage.setItem("authToken", data.token);
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  useEffect(() => {
    // Optional: validate token on mount
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
