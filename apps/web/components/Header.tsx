"use client";

import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/lib/auth-context";
import { Link, useRouter } from "@/i18n/routing";

import LanguageSwitcher from "./LanguageSwitcher";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const t = useTranslations("HomePage");
  const nav = useTranslations("Navbar");
  const dash = useTranslations("Dashboard");

  const { user, logout } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setOpen(false);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* ================= LOGO ================= */}
        <Link href="/" className="group flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg-soft)] transition-all duration-200 group-hover:scale-105 group-hover:shadow-sm">
            <Image
              src="/logo-icon.png"
              alt="Doctor Contact"
              width={48}
              height={48}
              className="h-11 w-11 object-contain"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-[19px] font-bold leading-none tracking-tight text-[var(--color-primary-dark)]">
              {t("title")}
            </span>
            <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Healthcare Platform
            </span>
          </div>
        </Link>

        {/* ================= DESKTOP ACTIONS ================= */}
        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/doctors"
            className="rounded-full bg-[var(--color-secondary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            {nav("availableDoctors")}
          </Link>

          <Link
            href="/#clinics"
            className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)] hover:shadow-md"
          >
            {nav("applyForListing")}
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className="ml-1 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary)]"
            >
              <LayoutDashboard className="h-4 w-4" />
              {dash("myAppointments")}
            </Link>
          )}

          <div className="mx-1 h-7 w-px bg-gray-200" />

          <LanguageSwitcher />

          {user && (
            <>
              <NotificationBell />

              <Link
                href="/dashboard/profile"
                className="group ml-1 flex items-center gap-2.5 rounded-full border border-transparent px-3 py-2 transition-all hover:border-gray-100 hover:bg-gray-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-primary)]">
                  <User className="h-4 w-4" />
                </div>

                <div className="hidden max-w-[130px] lg:block">
                  <p className="truncate text-sm font-semibold text-gray-700">{user.name}</p>
                  <p className="text-[10px] font-medium text-gray-400">My Profile</p>
                </div>

                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-red-50 hover:text-red-500"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">{dash("logout")}</span>
              </button>
            </>
          )}

          {!user && (
            <>
              <Link
                href="/login"
                className="ml-1 rounded-full border border-[var(--color-primary)]/25 px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-all hover:bg-[var(--color-bg-soft)]"
              >
                {t("login")}
              </Link>

              <Link
                href="/register"
                className="rounded-full border border-[var(--color-primary)]/25 px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-all hover:bg-[var(--color-bg-soft)]"
              >
                {t("register")}
              </Link>
            </>
          )}
        </div>

        {/* ================= MOBILE BUTTON ================= */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:bg-gray-50 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="border-t border-gray-100 bg-white shadow-lg md:hidden">
          <div className="mx-auto max-w-7xl space-y-2 px-5 py-5">

            {user && (
              <Link
                href="/dashboard/profile"
                onClick={() => setOpen(false)}
                className="mb-4 flex items-center gap-3 rounded-2xl bg-[var(--color-bg-soft)] p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-sm">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{dash("myProfile")}</p>
                </div>
                <ChevronDown className="h-4 w-4 rotate-[-90deg] text-gray-400" />
              </Link>
            )}

            <Link
              href="/doctors"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-full bg-[var(--color-secondary)] px-4 py-3.5 text-sm font-semibold text-white"
            >
              {nav("availableDoctors")}
            </Link>

            <Link
              href="/#clinics"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-full bg-[var(--color-primary)] px-4 py-3.5 text-sm font-semibold text-white"
            >
              {nav("applyForListing")}
            </Link>

            {user && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-700 transition hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary)]"
              >
                <LayoutDashboard className="h-4 w-4" />
                {dash("myAppointments")}
              </Link>
            )}

            <div className="my-3 h-px bg-gray-100" />

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-red-50 py-3.5 text-sm font-semibold text-red-500 transition hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                {dash("logout")}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-[var(--color-primary)] py-3.5 text-center text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-bg-soft)]"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-[var(--color-primary)] py-3.5 text-center text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-bg-soft)]"
                >
                  {t("register")}
                </Link>
              </div>
            )}

            <div className="flex justify-center pt-3">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}