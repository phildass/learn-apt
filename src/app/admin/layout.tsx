"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect once loading is complete and user is not authenticated
    // Redirect to /admin login page if trying to access any admin route without auth
    if (!isLoading && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return null;
  }

  // The /admin page itself will show the login form when not authenticated
  // All other admin routes require authentication
  if (!isAuthenticated && pathname !== "/admin") {
    return null;
  }

  return <>{children}</>;
}
