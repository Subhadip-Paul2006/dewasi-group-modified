"use client";

import { FileText, Plus, RefreshCw } from "lucide-react";

interface PrescriptionsHeaderProps {
  totalPrescriptions: number;
  onOpenCreateModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function PrescriptionsHeader({
  totalPrescriptions,
  onOpenCreateModal,
  onRefresh,
  isRefreshing,
}: PrescriptionsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      {/* Title & Description */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <FileText className="h-4.5 w-4.5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Digital Prescriptions (E-Rx)
          </h1>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {totalPrescriptions} {totalPrescriptions === 1 ? "Prescription" : "Prescriptions"} Issued
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Create structured digital prescriptions (diagnosis, medicines, dosage, instructions) and manage patient Rx records.
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50"
          title="Refresh Prescriptions List"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              isRefreshing ? "animate-spin text-blue-600 dark:text-blue-400" : ""
            }`}
          />
          <span>Refresh</span>
        </button>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Prescription</span>
        </button>
      </div>
    </div>
  );
}
