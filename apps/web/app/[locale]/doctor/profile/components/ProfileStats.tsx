"use client";

import { Building2, CheckCircle2, Clock } from "lucide-react";

interface ProfileStatsProps {
  activeClinicsCount: number;
  acceptedAssociationsCount: number;
  pendingRequestsCount: number;
}

export function ProfileStats({
  activeClinicsCount,
  acceptedAssociationsCount,
  pendingRequestsCount,
}: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Associated Clinics */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Associated Clinics
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Building2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">
            {activeClinicsCount}
          </span>
          <span className="text-[11px] text-slate-400">Active Centers</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Connected practice hubs
        </p>
      </div>

      {/* Accepted Associations */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Approved Links
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
            {acceptedAssociationsCount}
          </span>
          <span className="text-[11px] text-slate-400">Accepted Requests</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Verified affiliations
        </p>
      </div>

      {/* Pending Requests */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Pending Requests
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
            {pendingRequestsCount}
          </span>
          <span className="text-[11px] text-slate-400">Awaiting Action</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          In review queue
        </p>
      </div>
    </div>
  );
}
