"use client";

import {
  CalendarCheck,
  CalendarX,
  Building2,
  AlertTriangle,
  ShieldCheck,
  Inbox,
  Send,
  Bell,
  Check,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import type { AppNotification, NotificationType } from "@doctor-contract/shared";

interface NotificationCardProps {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  isMarkingRead?: boolean;
}

function getNotificationConfig(type: NotificationType) {
  switch (type) {
    case "APPOINTMENT_BOOKED":
      return {
        icon: CalendarCheck,
        badgeColor: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/30",
        iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
        label: "Appointment Booked",
        route: "/doctor/queue",
        actionText: "View Queue",
      };
    case "APPOINTMENT_CANCELLED":
      return {
        icon: CalendarX,
        badgeColor: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-400 dark:ring-rose-500/30",
        iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
        label: "Appointment Cancelled",
        route: "/doctor/queue",
        actionText: "View Queue",
      };
    case "CLINIC_APPROVED":
      return {
        icon: Building2,
        badgeColor: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-500/30",
        iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
        label: "Clinic Approved",
        route: "/doctor/clinics",
        actionText: "View Clinics",
      };
    case "CLINIC_REVOKED":
      return {
        icon: AlertTriangle,
        badgeColor: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-500/30",
        iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
        label: "Clinic Revoked",
        route: "/doctor/clinics",
        actionText: "View Clinics",
      };
    case "DOCTOR_VERIFIED":
      return {
        icon: ShieldCheck,
        badgeColor: "bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-950/50 dark:text-indigo-400 dark:ring-indigo-500/30",
        iconBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
        label: "Account Verified",
        route: "/doctor/profile",
        actionText: "View Profile",
      };
    case "CONNECTION_REQUEST_RECEIVED":
      return {
        icon: Inbox,
        badgeColor: "bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-950/50 dark:text-purple-400 dark:ring-purple-500/30",
        iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
        label: "Invitation Received",
        route: "/doctor/requests",
        actionText: "Review Request",
      };
    case "CONNECTION_REQUEST_RESPONDED":
      return {
        icon: Send,
        badgeColor: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-950/50 dark:text-sky-400 dark:ring-sky-500/30",
        iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300",
        label: "Request Responded",
        route: "/doctor/requests",
        actionText: "View Status",
      };
    default:
      return {
        icon: Bell,
        badgeColor: "bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-500/30",
        iconBg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        label: "General Alert",
        route: null,
        actionText: null,
      };
  }
}

function formatTimeAgo(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function NotificationCard({
  notification,
  onMarkRead,
  isMarkingRead = false,
}: NotificationCardProps) {
  const config = getNotificationConfig(notification.type);
  const IconComponent = config.icon;
  const timeAgo = formatTimeAgo(notification.createdAt);

  return (
    <div
      className={`group relative flex flex-col gap-3 rounded-xl border p-4 transition-all ${
        notification.isRead
          ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          : "border-blue-200 bg-blue-50/40 border-l-4 border-l-blue-600 dark:border-slate-800 dark:bg-blue-950/20 dark:border-l-blue-500 shadow-xs"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Side: Icon & Content */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Icon Pill */}
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-xs ${config.iconBg}`}
          >
            <IconComponent className="h-4.5 w-4.5" />
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${config.badgeColor}`}
              >
                {config.label}
              </span>

              {!notification.isRead && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  New
                </span>
              )}
            </div>

            <h3
              className={`text-sm font-semibold tracking-tight ${
                notification.isRead
                  ? "text-slate-800 dark:text-slate-200"
                  : "text-slate-900 font-bold dark:text-white"
              }`}
            >
              {notification.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">
              {notification.message}
            </p>
          </div>
        </div>

        {/* Right Side: Timestamp & Mark Read Button */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </span>

          {!notification.isRead && (
            <button
              type="button"
              onClick={() => onMarkRead(notification.id)}
              disabled={isMarkingRead}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
              title="Mark as Read"
            >
              <Check className="h-3 w-3" />
              <span>Mark Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Navigation Link if available */}
      {config.route && (
        <div className="flex items-center justify-end border-t border-slate-100 pt-2 dark:border-slate-800/60">
          <Link
            href={config.route}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <span>{config.actionText}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
