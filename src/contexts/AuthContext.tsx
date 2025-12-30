"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  useSupabase: boolean;
  userEmail?: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// NOTE: This is a demo implementation with a hardcoded password for simplicity.
// In a production environment, implement server-side authentication with:
// - Environment variables for secrets (use process.env.ADMIN_PASSWORD)
// - Secure API endpoints for login/logout
// - HTTP-only cookies for session management
// - JWT tokens or session tokens
// - Always use Supabase or another production-ready auth solution
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "phil123";
const AUTH_STORAGE_KEY = "learnapt-admin-auth";

// Helper function to set auth cookie with appropriate security flags
function setAuthCookie(value: string) {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = [
    `learnapt-admin-auth=${value}`,
    "path=/",
    "SameSite=Strict",
    // Add Secure flag in production to ensure HTTPS-only transmission
    isProduction ? "Secure" : "",
  ].filter(Boolean).join("; ");
  
  document.cookie = cookieOptions;
}

// Helper function to clear auth cookie
function clearAuthCookie() {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = [
    "learnapt-admin-auth=",
    "path=/",
    "expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "SameSite=Strict",
    isProduction ? "Secure" : "",
  ].filter(Boolean).join("; ");
  
  document.cookie = cookieOptions;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [useSupabase, setUseSupabase] = useState(false);

  // Initialize Supabase client
  const supabase = createClient();

  useEffect(() => {
    const initAuth = async () => {
      // Check if Supabase is configured
      const hasSupabase = supabase !== null;
      setUseSupabase(hasSupabase);

      if (hasSupabase && supabase) {
        // Check Supabase session
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsAuthenticated(true);
            setUserEmail(session.user.email || null);
            // Set cookie for middleware compatibility
            setAuthCookie("true");
          } else {
            setIsAuthenticated(false);
            setUserEmail(null);
          }
        } catch (error) {
          console.error("Failed to check Supabase session:", error);
          setIsAuthenticated(false);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setIsAuthenticated(true);
            setUserEmail(session.user.email || null);
            setAuthCookie("true");
          } else {
            setIsAuthenticated(false);
            setUserEmail(null);
            clearAuthCookie();
          }
        });

        setIsLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Fallback to cookie-based auth (legacy)
        try {
          const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
          const cookieAuth = document.cookie.split("; ").find(row => row.startsWith("learnapt-admin-auth="));
          const hasCookie = cookieAuth?.split("=")[1] === "true";
          
          const isAuth = storedAuth === "true" || hasCookie;
          setIsAuthenticated(isAuth);
          
          if (isAuth && storedAuth !== "true") {
            sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
          }
        } catch (error) {
          console.error("Failed to load authentication state:", error);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    };

    initAuth();
  }, [supabase]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (useSupabase && supabase) {
      // Use Supabase authentication
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.session) {
          setIsAuthenticated(true);
          setUserEmail(data.session.user.email || null);
          // Set cookie for middleware compatibility
          setAuthCookie("true");
          return { success: true };
        }

        return { success: false, error: "Failed to create session" };
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "An unexpected error occurred" };
      }
    } else {
      // Fallback to hardcoded password (legacy)
      // In this mode, email is ignored and password is checked against ADMIN_PASSWORD
      if (password === ADMIN_PASSWORD) {
        try {
          setIsAuthenticated(true);
          sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
          setAuthCookie("true");
          return { success: true };
        } catch (error) {
          console.error("Failed to save authentication state:", error);
          setIsAuthenticated(false);
          return { success: false, error: "Failed to save session" };
        }
      }
      return { success: false, error: "Invalid password" };
    }
  };

  const register = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (useSupabase && supabase) {
      // Use Supabase authentication
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          // Check if email confirmation is required
          if (data.user.identities && data.user.identities.length === 0) {
            return { success: false, error: "An account with this email already exists" };
          }
          
          // Auto-login if session was created
          if (data.session) {
            setIsAuthenticated(true);
            setUserEmail(data.session.user.email || null);
            setAuthCookie("true");
            return { success: true };
          }
          
          return { success: true, error: "Please check your email to confirm your account" };
        }

        return { success: false, error: "Failed to create account" };
      } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: "An unexpected error occurred" };
      }
    } else {
      // Registration not supported in legacy mode
      return { success: false, error: "Registration is not available. Please use the default password." };
    }
  };

  const logout = async (): Promise<void> => {
    if (useSupabase && supabase) {
      try {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setUserEmail(null);
        clearAuthCookie();
      } catch (error) {
        console.error("Logout error:", error);
      }
    } else {
      try {
        setIsAuthenticated(false);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        clearAuthCookie();
      } catch (error) {
        console.error("Failed to clear authentication state:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, register, logout, useSupabase, userEmail }}>
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
