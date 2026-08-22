"use client";

import {
  TrendingUp,
  Users,
  Building2,
  BadgeIndianRupee,
} from "lucide-react";
import type { DoctorEarningsSummary } from "@doctor-contract/shared";

interface EarningsSummaryProps {
  summary: DoctorEarningsSummary;
}

export function EarningsSummary({ summary }: EarningsSummaryProps) {
  const totalEarnings = summary.totalEarnings || 0;
  const totalConsultations = summary.totalConsultations || 0;
  const avgFee = totalConsultations > 0 ? Math.round(totalEarnings / totalConsultations) : 0;
  const activeClinicsCount = summary.clinicBreakdown?.length || 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Revenue */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Revenue
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            ₹{totalEarnings.toLocaleString()}
          </h2>
          <p className="mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            Recorded consultation fee earnings
          </p>
        </div>
      </div>

      {/* 2. Total Consultations */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Completed Consultations
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {totalConsultations.toLocaleString()}
          </h2>
          <p className="mt-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
            Completed patient visits
          </p>
        </div>
      </div>

      {/* 3. Average Consultation Fee */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Avg Fee / Consultation
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
            <BadgeIndianRupee className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            ₹{avgFee.toLocaleString()}
          </h2>
          <p className="mt-1 text-[11px] font-medium text-purple-600 dark:text-purple-400">
            Effective average per visit
          </p>
        </div>
      </div>

      {/* 4. Practice Clinics Count */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Practice Clinics
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
            <Building2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {activeClinicsCount}
          </h2>
          <p className="mt-1 text-[11px] font-medium text-sky-600 dark:text-sky-400">
            Contributing practice centers
          </p>
        </div>
      </div>
    </div>
  );
}
