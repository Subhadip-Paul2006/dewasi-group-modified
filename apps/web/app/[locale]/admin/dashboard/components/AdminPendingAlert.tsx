"use client";

import { Link } from "@/i18n/routing";
import { AlertTriangle, CheckCircle2, Building2, Stethoscope, ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface AdminPendingAlertProps {
  pendingClinics: number;
  unverifiedDoctors: number;
}

export function AdminPendingAlert({
  pendingClinics,
  unverifiedDoctors,
}: AdminPendingAlertProps) {
  const t = useTranslations("AdminDashboard");
  const locale = useLocale();
  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";

  const totalPending = (pendingClinics || 0) + (unverifiedDoctors || 0);

  if (totalPending === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-emerald-900 shadow-xs dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            {t("systemHealth")} — {t("operational")}
          </h2>
          <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
            {t("allSystemsOperational")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-900 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/25 dark:text-amber-300 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
              {t("actionRequiredTitle")}
            </h2>
            <span className="inline-flex items-center rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-extrabold text-amber-900 dark:bg-amber-900/70 dark:text-amber-200">
              {totalPending.toLocaleString(localeCode)} {t("pendingAction")}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-300">
            <span className="font-bold">{totalPending.toLocaleString(localeCode)}</span>{" "}
            {t("pendingAlertDesc")}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {pendingClinics > 0 && (
          <Link
            href="/admin/clinics"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>{t("reviewClinics")} ({pendingClinics.toLocaleString(localeCode)})</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}

        {unverifiedDoctors > 0 && (
          <Link
            href="/admin/doctors"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
          >
            <Stethoscope className="h-3.5 w-3.5" />
            <span>{t("verifyDoctors")} ({unverifiedDoctors.toLocaleString(localeCode)})</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
