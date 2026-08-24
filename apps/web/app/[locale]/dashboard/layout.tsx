"use client";

import { useEffect } from "react";
import { usePathname, Link, useRouter } from "@/i18n/routing";
import { LayoutDashboard, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function PatientDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "PATIENT")) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "PATIENT") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500 dark:text-ink-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-5 py-8 lg:px-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <nav className="sticky top-24 space-y-1">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={
                  "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors " +
                  (active
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-gray-600 hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary-text)] dark:text-ink-600 dark:hover:bg-soft-50")
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-gray-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-lg backdrop-blur-md md:hidden dark:border-soft-300 dark:bg-surface/95">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={
                "flex flex-col items-center gap-1 rounded-lg px-4 py-1 text-[10px] font-semibold transition-colors " +
                (active ? "text-[var(--color-primary-text)] font-bold" : "text-gray-500 dark:text-ink-500")
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <main className="min-w-0 flex-1 pb-24 md:pb-0">{children}</main>
    </div>
  );
}