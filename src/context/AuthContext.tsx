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
          const currentUser = await apiService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // If no user endpoint works, clear tokens
            apiService.logout();
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to get current user:", error);
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
      const data = await apiService.login(email, password);
      
      // The login response might already include user data
      if (data.user) {
        setUser(data.user);
        return true;
      }
      
      // If not, try to fetch user info
      try {
        const currentUser = await apiService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          return true;
        }
      } catch (userError) {
        console.warn("Could not fetch user info after login:", userError);
        // If we can't get user info but login was successful,
        // create a minimal user object from login data
        if (data.access) {
          setUser({
            id: "unknown",
            email: email,
            name: "User",
            role: "cashier"
          });
          return true;
        }
      }
      
      return false;
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
      const data = await apiService.register(email, password, name, role);
      
      // Registration response should include user data
      if (data.user) {
        setUser(data.user);
        return true;
      }
      
      // If registration was successful but no user data, create user object
      if (data.access) {
        setUser({
          id: data.user?.id || "unknown",
          email: email,
          name: name,
          role: role
        });
        return true;
      }
      
      return false;
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