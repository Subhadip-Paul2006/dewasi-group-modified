"use client";

import type { DoctorQueue } from "@doctor-contract/shared";
import { UserCheck, Clock, Hash, CheckCircle2 } from "lucide-react";

interface QueueStatusCardProps {
  queue?: DoctorQueue;
}

export function QueueStatusCard({ queue }: QueueStatusCardProps) {
  const currentToken = queue?.currentToken ?? 0;
  const lastTokenIssued = queue?.lastTokenIssued ?? 0;
  const tokens = queue?.tokens ?? [];

  // Calculate stats from tokens array
  const waitingCount = tokens.filter(
    (t) => t.status === "WAITING" || t.status === "CHECKED_IN"
  ).length;

  const completedCount = tokens.filter(
    (t) => t.status === "COMPLETED"
  ).length;

  const formatTokenDisplay = (val: number) => {
    if (!val || val <= 0) return "--";
    return `#${val < 10 ? `0${val}` : val}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Current Serving */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Currently Serving
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <UserCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">
            {formatTokenDisplay(currentToken)}
          </span>
          <span className="text-[11px] text-slate-400">Active Token</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          In consultation room
        </p>
      </div>

      {/* Waiting Count */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Patients Waiting
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
            {waitingCount}
          </span>
          <span className="text-[11px] text-slate-400">in waiting line</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Ready for call
        </p>
      </div>

      {/* Last Token Issued */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Last Token Issued
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
            <Hash className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {formatTokenDisplay(lastTokenIssued)}
          </span>
          <span className="text-[11px] text-slate-400">Total generated</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Max token for date
        </p>
      </div>

      {/* Completed Today */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Completed Today
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
            {completedCount}
          </span>
          <span className="text-[11px] text-slate-400">Consultations finished</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Successfully served
        </p>
      </div>
    </div>
  );
}
