"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, getCurrentUser, signInWithEmail, signOutUser, isAdmin } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Provides authentication state using Supabase
 * 
 * This replaces the previous hardcoded password implementation with proper
 * Supabase authentication. It supports:
 * - Email/password authentication
 * - Session persistence
 * - Admin role detection
 * - Cross-subdomain authentication (when configured)
 * 
 * Usage: Wrap your app with <AuthProvider> in layout.tsx
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load authentication state from Supabase on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load authentication state:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Login with email and password via Supabase
   * 
   * @param email - User's email address
   * @param password - User's password  
   * @returns Promise with success status and optional error message
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const { user: loggedInUser, error } = await signInWithEmail(email, password);
      
      if (error) {
        return { success: false, error };
      }

      if (loggedInUser) {
        setUser(loggedInUser);
        return { success: true };
      }

      return { success: false, error: "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout the current user via Supabase
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user ? isAdmin(user) : false,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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
