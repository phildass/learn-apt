"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirect to admin login if not authenticated
    if (!isAuthenticated && pathname !== "/admin") {
      router.push("/admin");
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
