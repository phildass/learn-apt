"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// NOTE: This is a demo implementation with a hardcoded password for simplicity.
// In a production environment, implement server-side authentication with:
// - Environment variables for secrets
// - Secure API endpoints for login/logout
// - HTTP-only cookies for session management
// - JWT tokens or session tokens
const ADMIN_PASSWORD = "phil123";
const AUTH_STORAGE_KEY = "learnapt-admin-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load authentication state from sessionStorage on mount (client-side only)
  useEffect(() => {
    const loadAuth = () => {
      try {
        // Check both sessionStorage and cookie for authentication
        const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
        const cookieAuth = document.cookie.split("; ").find(row => row.startsWith("learnapt-admin-auth="));
        const hasCookie = cookieAuth?.split("=")[1] === "true";
        
        // User is authenticated if either sessionStorage or cookie indicates so
        const isAuth = storedAuth === "true" || hasCookie;
        setIsAuthenticated(isAuth);
        
        // Sync sessionStorage with cookie state
        if (isAuth && storedAuth !== "true") {
          sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
        }
      } catch (error) {
        console.error("Failed to load authentication state:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      try {
        setIsAuthenticated(true);
        sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
        // Set a cookie for server-side middleware to check
        document.cookie = "learnapt-admin-auth=true; path=/; SameSite=Strict";
        return true;
      } catch (error) {
        console.error("Failed to save authentication state:", error);
        setIsAuthenticated(false);
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    try {
      setIsAuthenticated(false);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      // Clear the auth cookie
      document.cookie = "learnapt-admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
    } catch (error) {
      console.error("Failed to clear authentication state:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
