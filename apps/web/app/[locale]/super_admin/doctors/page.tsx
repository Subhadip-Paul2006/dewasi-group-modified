"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Building2,
  GraduationCap,
  Briefcase,
  DollarSign,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useUnverifiedDoctors, useVerifyDoctor } from "@/lib/hooks/useAdmin";
import type { AdminDoctorRecord } from "@doctor-contract/shared";

export default function AdminDoctorsPage() {
  const t = useTranslations("AdminDoctors");
  const locale = useLocale();
  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";

  const { data: doctors, isLoading, isError, isFetching, refetch } = useUnverifiedDoctors();
  const verifyDoctor = useVerifyDoctor();

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [pendingVerifyDoctor, setPendingVerifyDoctor] = useState<AdminDoctorRecord | null>(null);

  async function handleConfirmVerify() {
    if (!pendingVerifyDoctor) return;
    const doctorId = pendingVerifyDoctor.id;
    setPendingVerifyDoctor(null);
    setActionError(null);
    setActionSuccess(null);

    try {
      await verifyDoctor.mutateAsync(doctorId);
      setActionSuccess(t("successVerified"));
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message || "Failed to verify doctor"
      );
    }
  }

  const unverifiedList = doctors || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t("title")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`}
          />
          <span>{t("retry")}</span>
        </button>
      </div>

      {/* Action Error Alert */}
      {actionError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-[11px] font-bold underline"
          >
            {t("dismiss")}
          </button>
        </div>
      )}

      {/* Action Success Alert */}
      {actionSuccess && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="text-[11px] font-bold underline"
          >
            {t("dismiss")}
          </button>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <div className="flex-1">
              <h3 className="text-xs font-semibold">{t("errorTitle")}</h3>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700"
            >
              {t("retry")}
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      )}

      {/* Unverified Doctors List */}
      {!isLoading && !isError && (
        <div className="space-y-3">
          {unverifiedList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                {t("emptyTitle")}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t("emptyDesc")}
              </p>
            </div>
          ) : (
            unverifiedList.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {doc.user?.name || "Doctor"}
                      </h3>
                      {doc.specialization && (
                        <span className="rounded-md bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300">
                          {doc.specialization}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      {doc.clinic?.clinicName && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          <span>{doc.clinic.clinicName}</span>
                        </span>
                      )}
                      {doc.qualification && (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>{doc.qualification}</span>
                        </span>
                      )}
                      {doc.experience !== null && doc.experience !== undefined && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          <span>{doc.experience} yrs</span>
                        </span>
                      )}
                      {doc.fee !== null && doc.fee !== undefined && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          <span>₹{doc.fee.toLocaleString(localeCode)}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-4 text-[11px] text-slate-400">
                      {doc.user?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{doc.user.email}</span>
                        </span>
                      )}
                      {doc.user?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{doc.user.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setPendingVerifyDoctor(doc)}
                    disabled={verifyDoctor.isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{t("verify")}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Verify Doctor Confirmation Modal */}
      {pendingVerifyDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t("verifyConfirmTitle")}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pendingVerifyDoctor.user?.name || "Doctor"} ({pendingVerifyDoctor.specialization || "General"})
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
              {t("verifyConfirmDesc")}
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingVerifyDoctor(null)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmVerify}
                disabled={verifyDoctor.isPending}
                className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                {verifyDoctor.isPending ? t("verifying") : t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
