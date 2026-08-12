"use client";

import { useEffect } from "react";
import { usePathname, Link, useRouter } from "@/i18n/routing";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarClock,
  Inbox,
  FlaskConical,
  BarChart3,
  ChevronRight,
  Building2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  {
    href: "/clinic",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/clinic/doctors",
    label: "Doctors",
    icon: Stethoscope,
  },
  {
    href: "/clinic/receptionists",
    label: "Receptionists",
    icon: Users,
  },
  {
    href: "/clinic/schedule",
    label: "Schedule",
    icon: CalendarClock,
  },
  {
    href: "/clinic/requests",
    label: "Requests",
    icon: Inbox,
  },
  {
    href: "/clinic/referrals",
    label: "Referrals",
    icon: FlaskConical,
  },
  {
    href: "/clinic/reports",
    label: "Reports",
    icon: BarChart3,
  },
];

export default function ClinicDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "CLINIC")) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "CLINIC") {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="
              h-8 w-8 animate-spin rounded-full
              border-[3px]
              border-[var(--color-primary)]
              border-t-transparent
            "
          />
          <p className="text-sm font-medium text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] items-start gap-6 px-4 py-6 md:px-6 lg:px-8">
      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside className="hidden w-60 shrink-0 md:block">
        <div className="sticky top-24">
          {/* Sidebar Header */}
          <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-bg-soft)]">
                <Building2 className="h-5 w-5 text-[var(--color-primary)]" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                  Dashboard
                </p>
                <p className="truncate text-sm font-bold text-gray-800">
                  Clinic Management
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
            <div className="space-y-1">
              {NAV.map(({ href, label, icon: Icon, exact }) => {
                const active = exact
                  ? pathname === href
                  : pathname.startsWith(href);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={
                      active
                        ? "group flex items-center gap-3 rounded-xl bg-[var(--color-primary)] px-3.5 py-3 text-sm font-bold text-white shadow-sm transition-all"
                        : "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary)]"
                    }
                  >
                    <span
                      className={
                        active
                          ? "flex h-8 w-8 items-center justify-center rounded-lg bg-white/15"
                          : "flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 transition-colors group-hover:bg-white"
                      }
                    >
                      <Icon
                        className={
                          active
                            ? "h-4 w-4 text-white"
                            : "h-4 w-4 text-gray-500 group-hover:text-[var(--color-primary)]"
                        }
                      />
                    </span>

                    <span className="flex-1">{label}</span>

                    {active && (
                      <ChevronRight className="h-4 w-4 text-white/70" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ====================================================== */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 px-1.5 pb-[env(safe-area-inset-bottom)] pt-1.5 shadow-[0_-8px_25px_rgba(0,0,0,0.06)] backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[9px] font-bold text-[var(--color-primary)]"
                    : "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[9px] font-medium text-gray-400 transition-colors hover:text-gray-600"
                }
              >
                <span
                  className={
                    active
                      ? "flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-bg-soft)]"
                      : "flex h-8 w-8 items-center justify-center rounded-xl"
                  }
                >
                  <Icon
                    className={
                      active
                        ? "h-4 w-4 text-[var(--color-primary)]"
                        : "h-4 w-4 text-gray-400"
                    }
                  />
                </span>

                <span className="max-w-full truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}