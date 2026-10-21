"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  useIsAuthenticated,
  useIsAdmin,
  useAuthHydrated,
} from "@/hooks/useAuth";

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function RequireAuth({
  children,
  requireAdmin = false,
}: RequireAuthProps) {
  const router = useRouter();
  const hasHydrated = useAuthHydrated();
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();

  const authorized = isAuthenticated && (!requireAdmin || isAdmin);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      const fullPath = window.location.pathname + window.location.search;
      router.replace(`/login?redirect=${encodeURIComponent(fullPath)}`);
    } else if (requireAdmin && !isAdmin) {
      router.replace("/home");
    }
  }, [hasHydrated, isAuthenticated, isAdmin, requireAdmin, router]);

  if (!hasHydrated || !authorized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return <>{children}</>;
}
