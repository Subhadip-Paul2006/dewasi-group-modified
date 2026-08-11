"use client";

import { Stethoscope, Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import { Link, useRouter } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";

// Single shared header used on every page (home, login, register,
// dashboard). Its content adapts based on auth state, but the visual
// shell (logo, layout, colors) stays identical everywhere on purpose --
// this is the one place that defines what "Doctor Contract" looks like
// at the top of the screen.
export default function Header() {
  const t = useTranslations("HomePage");
  const nav = useTranslations("Navbar");
  const dash = useTranslations("Dashboard");
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)]">
            <Stethoscope className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-[var(--color-primary-dark)]">
            {t("title")}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/#search" className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">
            {nav("findDoctor")}
          </Link>
          <Link href="/#clinics" className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">
            {nav("forClinics")}
          </Link>
          {user && (
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">
              <LayoutDashboard className="h-4 w-4" /> {dash("myAppointments")}
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {user ? (
            <>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary)]"
              >
                <User className="h-4 w-4" /> {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> {dash("logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-bg-soft)]"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-dark)]"
              >
                {t("register")}
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 md:hidden">
          <Link href="/#search" onClick={() => setOpen(false)}>{nav("findDoctor")}</Link>
          <Link href="/#clinics" onClick={() => setOpen(false)}>{nav("forClinics")}</Link>
          {user && (
            <Link href="/dashboard" onClick={() => setOpen(false)}>{dash("myAppointments")}</Link>
          )}

          {user ? (
            <>
              <Link href="/dashboard/profile" onClick={() => setOpen(false)}>{dash("myProfile")}</Link>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-50 py-2 text-sm font-semibold text-red-500"
              >
                {dash("logout")}
              </button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1 rounded-lg border border-[var(--color-primary)] py-2 text-center text-sm font-semibold text-[var(--color-primary)]">
                {t("login")}
              </Link>
              <Link href="/register" className="flex-1 rounded-lg bg-[var(--color-primary)] py-2 text-center text-sm font-semibold text-white">
                {t("register")}
              </Link>
            </div>
          )}
          <LanguageSwitcher />
        </div>
      )}
    </header>
  );
}
