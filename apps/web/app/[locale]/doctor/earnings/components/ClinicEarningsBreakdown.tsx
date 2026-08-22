"use client";

import { Building2, Users, IndianRupee } from "lucide-react";
import type { ClinicEarningsBreakdown as ClinicBreakdownType } from "@doctor-contract/shared";

interface ClinicEarningsBreakdownProps {
  breakdown: ClinicBreakdownType[];
  grandTotalEarnings: number;
}

export function ClinicEarningsBreakdown({
  breakdown,
  grandTotalEarnings,
}: ClinicEarningsBreakdownProps) {
  if (!breakdown || breakdown.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Clinic-Wise Revenue Breakdown
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {breakdown.length} {breakdown.length === 1 ? "Clinic" : "Clinics"}
        </span>
      </div>

      <div className="space-y-3">
        {breakdown.map((item) => {
          const sharePercent =
            grandTotalEarnings > 0
              ? Math.round((item.totalEarnings / grandTotalEarnings) * 100)
              : 0;

          return (
            <div
              key={item.clinicId}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all dark:border-slate-800/80 dark:bg-slate-800/40"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.clinicName}
                  </h4>
                  <p className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <IndianRupee className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      Fee: ₹{item.consultationFee}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      {item.totalCompletedConsultations} Visits
                    </span>
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    ₹{item.totalEarnings.toLocaleString()}
                  </span>
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {sharePercent}% of total revenue
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(sharePercent, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
