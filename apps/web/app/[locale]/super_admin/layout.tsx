"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, Link, useRouter } from "@/i18n/routing";
import {
  LayoutDashboard,
  Users,
  Building2,
  Stethoscope,
  Sparkles,
  Activity,
  Settings,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  href: string;
  key:
    | "dashboard"
    | "users"
    | "clinics"
    | "doctors"
    | "featuredDoctors"
    | "diagnosticCenters"
    | "settings";
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/super_admin/dashboard",
    key: "dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/super_admin/users",
    key: "users",
    icon: Users,
  },
  {
    href: "/super_admin/clinics",
    key: "clinics",
    icon: Building2,
  },
  {
    href: "/super_admin/doctors",
    key: "doctors",
    icon: Stethoscope,
  },
  {
    href: "/super_admin/featured-doctors",
    key: "featuredDoctors",
    icon: Sparkles,
  },
  {
    href: "/super_admin/diagnostic-centers",
    key: "diagnosticCenters",
    icon: Activity,
  },
  {
    href: "/super_admin/settings",
    key: "settings",
    icon: Settings,
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tNav = useTranslations("AdminNav");
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!loading) {
      if (!user || !isSuperAdmin) {
        router.push("/login");
      }
    }
  }, [loading, user, isSuperAdmin, router]);

  if (loading || !user || !isSuperAdmin) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-[2.5px] border-amber-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {tNav("loadingPortal")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1440px] items-start gap-6 px-4 py-6 md:px-6 lg:px-8">
      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside className="hidden w-60 shrink-0 md:block">
        <div className="sticky top-20 space-y-3">
          {/* Sidebar Brand / Identity Card */}
          <div className="rounded-xl border border-amber-200/80 bg-white p-3.5 shadow-xs transition-colors dark:border-amber-900/40 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {tNav("portalTitle")}
                  </span>
                  <span className="rounded bg-amber-100 px-1 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    {tNav("superAdminBadge")}
                  </span>
                </div>
                <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                  {user.name || "Super Administrator"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-0.5">
              {NAV_ITEMS.map(({ href, key, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={
                      active
                        ? "group flex items-center gap-3 rounded-lg bg-amber-600 px-3 py-2.5 text-xs font-semibold text-white shadow-xs transition-all"
                        : "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
                    }
                  >
                    <span
                      className={
                        active
                          ? "flex h-7 w-7 items-center justify-center rounded-md bg-white/15"
                          : "flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 transition-colors group-hover:bg-slate-200/70 dark:bg-slate-800 dark:group-hover:bg-slate-750"
                      }
                    >
                      <Icon
                        className={
                          active
                            ? "h-3.5 w-3.5 text-white"
                            : "h-3.5 w-3.5 text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200"
                        }
                      />
                    </span>

                    <span className="flex-1">{tNav(key)}</span>

                    {active && <ChevronRight className="h-3.5 w-3.5 text-white/70" />}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT AREA
      ====================================================== */}
      <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ====================================================== */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-1.5 pb-[env(safe-area-inset-bottom)] pt-1.5 shadow-sm backdrop-blur-md md:hidden dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map(({ href, key, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[9px] font-bold text-amber-600 dark:text-amber-400"
                    : "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[9px] font-medium text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }
              >
                <span
                  className={
                    active
                      ? "flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 dark:bg-slate-900"
                      : "flex h-7 w-7 items-center justify-center rounded-lg"
                  }
                >
                  <Icon
                    className={
                      active
                        ? "h-3.5 w-3.5 text-amber-600 dark:text-amber-400"
                        : "h-3.5 w-3.5 text-slate-400 dark:text-slate-500"
                    }
                  />
                </span>

                <span className="max-w-full truncate">{tNav(key)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
