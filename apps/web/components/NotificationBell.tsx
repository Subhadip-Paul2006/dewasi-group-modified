"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, FlaskConical } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  useUnreadCount,
  useMyNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/lib/hooks/useNotifications";
import { useNotificationSocket } from "@/components/notifications/useNotificationSocket";
import type { AppNotification } from "@doctor-contract/shared";

export default function NotificationBell() {
  const t = useTranslations("Notifications");
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 1. Initialize real-time socket listener
  useNotificationSocket();

  // 2. Fetch unread count & notifications
  const { data: unreadCount } = useUnreadCount();
  const { data: notifications, isLoading } = useMyNotifications(open);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleNotificationClick(n: AppNotification) {
    if (!n.isRead) {
      markRead.mutate(n.id);
    }

    // Referral notification click handling -> deep link to /diagnosticCenter/referrals
    const isReferralNotification =
      !!n.meta?.referralId ||
      n.title.toLowerCase().includes("referral") ||
      n.message.toLowerCase().includes("referral");

    if (isReferralNotification) {
      if (n.meta?.referralId) {
        router.push(`/diagnosticCenter/referrals?referralId=${n.meta.referralId}`);
      } else {
        router.push("/diagnosticCenter/referrals");
      }
    }

    setOpen(false);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary-text)] dark:text-ink-600"
        aria-label={t("heading")}
      >
        <Bell className="h-5 w-5" />
        {!!unreadCount && unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 sm:w-96 rounded-xl border border-gray-100 bg-white shadow-lg shadow-blue-900/10 dark:border-soft-300 dark:bg-surface dark:shadow-black/40">
          <div className="flex items-center justify-between border-b border-gray-50 px-4 py-3 dark:border-soft-100">
            <span className="text-sm font-semibold text-gray-800 dark:text-ink-800">
              {t("heading")}
            </span>
            {!!unreadCount && unreadCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="text-xs font-medium text-[var(--color-primary-text)] hover:underline"
              >
                {t("markAllRead")}
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <p className="px-4 py-6 text-center text-sm text-gray-400">...</p>
            )}

            {!isLoading && notifications?.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-gray-400">
                {t("empty")}
              </p>
            )}

            {notifications?.map((n) => {
              const isReferral =
                !!n.meta?.referralId ||
                n.title.toLowerCase().includes("referral") ||
                n.message.toLowerCase().includes("referral");

              return (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={
                    "block w-full border-b border-gray-50 px-4 py-3 text-left transition hover:bg-[var(--color-bg-soft)] dark:border-soft-100 " +
                    (n.isRead
                      ? ""
                      : "bg-[var(--color-secondary-light)]/40 dark:bg-[var(--color-secondary-light)]")
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {isReferral && (
                        <FlaskConical className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      )}
                      <p className="text-sm font-medium text-gray-800 dark:text-ink-800">
                        {n.title}
                      </p>
                    </div>

                    {!n.isRead && (
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>

                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                    {n.message}
                  </p>

                  {isReferral && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                        {t("testReferral")}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
