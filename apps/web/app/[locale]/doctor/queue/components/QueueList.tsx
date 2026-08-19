"use client";

import type { QueueToken } from "@doctor-contract/shared";
import { Users, Clock, CheckCircle, PauseCircle, AlertCircle, XCircle } from "lucide-react";

interface QueueListProps {
  tokens?: QueueToken[];
  currentTokenNumber?: number;
}

export function QueueList({ tokens = [], currentTokenNumber = 0 }: QueueListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WAITING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
            <Clock className="h-3 w-3" />
            Waiting
          </span>
        );
      case "CHECKED_IN":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
            <CheckCircle className="h-3 w-3" />
            Checked In
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            <CheckCircle className="h-3 w-3" />
            Completed
          </span>
        );
      case "ABSENT":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <AlertCircle className="h-3 w-3" />
            Absent
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
            <XCircle className="h-3 w-3" />
            Cancelled
          </span>
        );
      case "PAUSED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-950/50 dark:text-orange-400">
            <PauseCircle className="h-3 w-3" />
            Paused
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  const formatTokenDisplay = (val: number) => {
    if (!val || val <= 0) return "--";
    return `#${val < 10 ? `0${val}` : val}`;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Waiting Queue List
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Total Tokens: {tokens.length}
        </span>
      </div>

      {tokens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <Users className="h-6 w-6" />
          </div>
          <p className="mt-3 text-xs font-bold text-slate-700 dark:text-slate-300">
            No patients are currently waiting.
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            New patient bookings for this date will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800">
                <th className="py-2.5 px-3">Token</th>
                <th className="py-2.5 px-3">Patient Name</th>
                <th className="py-2.5 px-3">Demographics</th>
                <th className="py-2.5 px-3">Booking Time</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {tokens.map((token) => {
                const isCurrent = token.token === currentTokenNumber;
                const formattedTime = token.bookedAt
                  ? new Date(token.bookedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--";

                return (
                  <tr
                    key={token.id || token.token}
                    className={`transition-colors ${
                      isCurrent
                        ? "bg-blue-50/70 font-medium dark:bg-blue-950/40"
                        : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-xs font-black ${
                          isCurrent
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {formatTokenDisplay(token.token)}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {token.patientName || `Patient #${token.token}`}
                      {isCurrent && (
                        <span className="ml-2 inline-block rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          NOW SERVING
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {[
                        token.patientAge !== null && token.patientAge !== undefined
                          ? `${token.patientAge} yrs`
                          : null,
                        token.patientGender,
                      ]
                        .filter(Boolean)
                        .join(" • ") || "--"}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                      {formattedTime}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {getStatusBadge(token.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
