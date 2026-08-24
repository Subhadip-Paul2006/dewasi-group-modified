"use client";

import { useEffect, useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { GradientCard } from "@/components/ui/GradientCard";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const SUPER_ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    title: "CORE OPERATIONS",
    items: [
      {
        href: "/super_admin/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: "/super_admin/users",
        label: "Users & Accounts",
        icon: Users,
      },
    ],
  },
  {
    title: "MEDICAL ECOSYSTEM",
    items: [
      {
        href: "/super_admin/clinics",
        label: "Clinics Directory",
        icon: Building2,
      },
      {
        href: "/super_admin/doctors",
        label: "Doctors Directory",
        icon: Stethoscope,
      },
      {
        href: "/super_admin/featured-doctors",
        label: "Featured Doctors",
        icon: Sparkles,
      },
      {
        href: "/super_admin/diagnostic-centers",
        label: "Diagnostic Centers",
        icon: Activity,
      },
    ],
  },
  {
    title: "PLATFORM & SYSTEM",
    items: [
      {
        href: "/super_admin/settings",
        label: "Platform Settings",
        icon: Settings,
      },
    ],
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!loading) {
      if (!user || !isSuperAdmin) {
        router.push("/login");
      }
    }
  }, [loading, user, isSuperAdmin, router]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  if (loading || !user || !isSuperAdmin) {
    return <LoadingSpinner text={tNav("loadingPortal")} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1440px] items-start gap-6 px-4 py-6 md:px-6 md:py-8 lg:px-8">
      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <DesktopSidebar
        sections={SUPER_ADMIN_NAV_SECTIONS}
        pathname={pathname}
        userName={user.name || "Super Administrator"}
        userRole={user.role}
      />

      {/* =====================================================
          MAIN CONTENT AREA
      ====================================================== */}
      <main className="min-w-0 flex-1">{children}</main>

      {/* =====================================================
          MOBILE FLOATING ACTION BUTTON (FAB) & DRAWER
      ====================================================== */}
      <MobileFabButton
        isOpen={mobileDrawerOpen}
        onToggle={() => setMobileDrawerOpen((prev) => !prev)}
      />

      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sections={SUPER_ADMIN_NAV_SECTIONS}
        pathname={pathname}
        userName={user.name || "Super Administrator"}
        userRole={user.role}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-Components
// ---------------------------------------------------------------------------

function LoadingSpinner({ text }: { text: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-[2.5px] border-amber-600 border-t-transparent" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {text}
        </p>
      </div>
    </div>
  );
}

function DesktopSidebar({
  sections,
  pathname,
  userName,
  userRole,
}: {
  sections: NavSection[];
  pathname: string;
  userName: string;
  userRole: string;
}) {
  return (
    <aside className="hidden w-64 shrink-0 md:block">
      <div className="sticky top-20 space-y-4">
        {/* Super Admin Identity Banner */}
        <GradientCard variant="amber">
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  {userRole}
                </span>
              </div>
              <p className="truncate text-xs font-black text-slate-900 dark:text-white mt-0.5">
                {userName}
              </p>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 truncate">
                Central Platform Control
              </p>
            </div>
          </div>
        </GradientCard>

        {/* Categorized Navigation Container */}
        <GradientCard variant="slate">
          <nav className="p-3 space-y-4">
            {sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <DesktopNavItem
                      key={item.href}
                      item={item}
                      pathname={pathname}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </GradientCard>
      </div>
    </aside>
  );
}

function DesktopNavItem({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const Icon = item.icon;
  const active = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={
        active
          ? "group flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-500/20 transition-all"
          : "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200 transition-all"
      }
    >
      <span
        className={
          active
            ? "flex h-7 w-7 items-center justify-center rounded-lg bg-white/20"
            : "flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-750 transition-colors"
        }
      >
        <Icon
          className={
            active
              ? "h-4 w-4 text-white"
              : "h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
          }
        />
      </span>

      <span className="flex-1 truncate">{item.label}</span>

      {active && <ChevronRight className="h-3.5 w-3.5 text-white/80" />}
    </Link>
  );
}

function MobileFabButton({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle Super Admin Navigation"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white shadow-xl shadow-amber-600/30 hover:scale-105 active:scale-95 transition-all md:hidden"
    >
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  );
}

function MobileDrawer({
  isOpen,
  onClose,
  sections,
  pathname,
  userName,
  userRole,
}: {
  isOpen: boolean;
  onClose: () => void;
  sections: NavSection[];
  pathname: string;
  userName: string;
  userRole: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative ml-auto flex h-full w-[85%] max-w-sm flex-col bg-white p-5 shadow-2xl dark:bg-slate-900 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">
                {userName}
              </p>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                {userRole}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Categorized Nav Links */}
        <div className="mt-4 flex-1 space-y-4">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <p className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={
                        active
                          ? "flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-500/20"
                          : "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{item.label}</span>
                      {active && <ChevronRight className="h-3.5 w-3.5" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
