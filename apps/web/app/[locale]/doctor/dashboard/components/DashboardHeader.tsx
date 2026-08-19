"use client";

import { Calendar } from "lucide-react";

export function DashboardHeader() {
  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Doctor Dashboard
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Overview of today&apos;s appointments, patient queue, and clinic activity.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
        <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
        <span>{currentDateFormatted}</span>
      </div>
    </div>
  );
}
