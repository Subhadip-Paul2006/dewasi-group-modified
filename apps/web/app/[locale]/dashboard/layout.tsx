"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/lib/auth-context";

// Auth guard only -- the visual header/nav is the shared <Header />
// rendered once in the root layout, so it stays identical across
// every page including this one.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    } else if (!loading && user && user.role !== "PATIENT") {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "PATIENT") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[var(--color-bg-soft)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--color-bg-soft)]">
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </div>
  );
}
