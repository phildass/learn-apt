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
    if (!isLoading && !isAuthenticated && pathname !== "/admin") {
      router.push("/admin");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  return <>{children}</>;
}
