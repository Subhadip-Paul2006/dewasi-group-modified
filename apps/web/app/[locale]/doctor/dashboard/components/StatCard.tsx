"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value?: number | string | null;
  subtitle?: string;
  icon: LucideIcon;
  badgeText?: string;
  colorScheme?: "blue" | "emerald" | "amber" | "indigo" | "purple" | "cyan";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  colorScheme = "blue",
}: StatCardProps) {
  const displayValue =
    value !== undefined && value !== null ? value : "--";

  const colorStyles = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-900/50",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-900/50",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-900/50",
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-200 dark:border-indigo-900/50",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/40",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-900/50",
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-950/40",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-200 dark:border-cyan-900/50",
    },
  }[colorScheme];

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${colorStyles.bg} ${colorStyles.text} ${colorStyles.border}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {displayValue}
        </p>

        {badgeText && (
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colorStyles.bg} ${colorStyles.text}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}
