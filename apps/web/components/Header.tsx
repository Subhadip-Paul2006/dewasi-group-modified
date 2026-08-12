"use client";

import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User,
  ChevronDown,
  Bell,
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
  const [showUserMenu, setShowUserMenu] = useState(false);

  async function handleLogout() {
    await logout();
    setOpen(false);
    setShowUserMenu(false);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================= LOGO ================= */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Image
              src="/logo-icon.png"
              alt="Doctor Contact"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-800">
              {t("title")}
            </span>
            <p className="hidden text-[10px] font-medium text-gray-400 sm:block">
              Healthcare
            </p>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Main Actions */}
          <Link
            href="/doctors"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            {nav("availableDoctors")}
          </Link>

          <Link
            href="/#clinics"
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            {nav("applyForListing")}
          </Link>

          {/* Divider */}
          <span className="mx-1 h-6 w-px bg-gray-200"></span>

          {/* Language */}
          <LanguageSwitcher />

          {/* User Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-gray-50 transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <span className="text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <span className="hidden text-sm font-medium text-gray-700 lg:block">
                  {user.name}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <Link
                    href="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                {t("register")}
              </Link>
            </div>
          )}
        </div>

        {/* ================= MOBILE BUTTON ================= */}
        <div className="flex items-center gap-2 md:hidden">
          {user && <NotificationBell />}
          
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-2 px-4 py-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <span className="font-bold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">Patient</p>
                  </div>
                </div>

                <Link
                  href="/doctors"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  {nav("availableDoctors")}
                </Link>

                <Link
                  href="/#clinics"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700"
                >
                  {nav("applyForListing")}
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LayoutDashboard className="mr-2 inline h-4 w-4" />
                  Dashboard
                </Link>

                <hr className="border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/doctors"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  {nav("availableDoctors")}
                </Link>

                <Link
                  href="/#clinics"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700"
                >
                  {nav("applyForListing")}
                </Link>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    {t("register")}
                  </Link>
                </div>
              </>
            )}

            <div className="pt-3 text-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}