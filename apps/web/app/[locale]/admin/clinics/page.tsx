"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Plus,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  useAdminClinics,
  useApproveClinic,
  useRevokeClinic,
  useCreateClinic,
} from "@/lib/hooks/useAdmin";
import type { AdminClinicRecord, CreateClinicInput } from "@doctor-contract/shared";

type FilterTab = "ALL" | "APPROVED" | "PENDING";

export default function AdminClinicsPage() {
  const t = useTranslations("AdminClinics");
  const locale = useLocale();
  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";

  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [page, setPage] = useState<number>(1);
  const limit = 20;

  const isApprovedParam =
    activeTab === "ALL" ? undefined : activeTab === "APPROVED";

  const { data, isLoading, isError, isFetching, refetch } = useAdminClinics({
    isApproved: isApprovedParam,
    page,
    limit,
  });

  const approveClinic = useApproveClinic();
  const revokeClinic = useRevokeClinic();
  const createClinic = useCreateClinic();

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Dialog states
  const [pendingApproveClinic, setPendingApproveClinic] = useState<AdminClinicRecord | null>(null);
  const [pendingRevokeClinic, setPendingRevokeClinic] = useState<AdminClinicRecord | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Create Clinic Form State
  const [formData, setFormData] = useState<CreateClinicInput>({
    name: "",
    email: "",
    password: "",
    phone: "",
    clinicName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const clinics = data?.clinics || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  async function handleConfirmApprove() {
    if (!pendingApproveClinic) return;
    const clinicId = pendingApproveClinic.id;
    setPendingApproveClinic(null);
    setActionError(null);
    setActionSuccess(null);

    try {
      await approveClinic.mutateAsync(clinicId);
      setActionSuccess(t("successApproved"));
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message || "Failed to approve clinic"
      );
    }
  }

  async function handleConfirmRevoke() {
    if (!pendingRevokeClinic) return;
    const clinicId = pendingRevokeClinic.id;
    setPendingRevokeClinic(null);
    setActionError(null);
    setActionSuccess(null);

    try {
      await revokeClinic.mutateAsync(clinicId);
      setActionSuccess(t("successRevoked"));
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message || "Failed to revoke clinic approval"
      );
    }
  }

  async function handleCreateClinic(e: React.FormEvent) {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    try {
      await createClinic.mutateAsync(formData);
      setShowCreateModal(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        clinicName: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
      setActionSuccess(t("successCreated"));
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message || "Failed to create clinic"
      );
    }
  }

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString(localeCode, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

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
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t("addClinic")}</span>
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`}
            />
            <span>{t("retry")}</span>
          </button>
        </div>
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

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => {
            setActiveTab("ALL");
            setPage(1);
          }}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            activeTab === "ALL"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          }`}
        >
          {t("all")}
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("APPROVED");
            setPage(1);
          }}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            activeTab === "APPROVED"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          }`}
        >
          {t("approved")}
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("PENDING");
            setPage(1);
          }}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            activeTab === "PENDING"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          }`}
        >
          {t("pending")}
        </button>
      </div>

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
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        </div>
      )}

      {/* Clinics Table */}
      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
          {clinics.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <Building2 className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                {t("emptyTitle")}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t("emptyDesc")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">{t("clinicName")}</th>
                    <th className="px-4 py-3">{t("owner")}</th>
                    <th className="px-4 py-3">{t("location")}</th>
                    <th className="px-4 py-3">{t("approvalStatus")}</th>
                    <th className="px-4 py-3">{t("createdDate")}</th>
                    <th className="px-4 py-3 text-right">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {clinics.map((clinic) => (
                    <tr
                      key={clinic.id}
                      className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                        {clinic.clinicName}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {clinic.user?.name || "—"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {clinic.user?.email || "—"}
                          </p>
                          {clinic.user?.phone && (
                            <p className="text-[10px] text-slate-400">
                              {clinic.user.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {[clinic.city, clinic.state].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {clinic.isApproved ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>{t("approved")}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>{t("pending")}</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {formatDate(clinic.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {clinic.isApproved ? (
                          <button
                            type="button"
                            onClick={() => setPendingRevokeClinic(clinic)}
                            disabled={revokeClinic.isPending}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50"
                          >
                            <ShieldAlert className="h-3 w-3" />
                            <span>{t("revoke")}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPendingApproveClinic(clinic)}
                            disabled={approveClinic.isPending}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                          >
                            <ShieldCheck className="h-3 w-3" />
                            <span>{t("approve")}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {total > limit && (
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <span>
                {t("page")} {page} of {totalPages} ({total.toLocaleString(localeCode)} clinics)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoading}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>{t("previous")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isLoading}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <span>{t("next")}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {pendingApproveClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t("approveDialogTitle")}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pendingApproveClinic.clinicName}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
              {t("approveDialogDesc")}
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingApproveClinic(null)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={approveClinic.isPending}
                className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                {approveClinic.isPending ? t("saving") : t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      {pendingRevokeClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t("revokeDialogTitle")}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pendingRevokeClinic.clinicName}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
              {t("revokeDialogDesc")}
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingRevokeClinic(null)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                disabled={revokeClinic.isPending}
                className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
              >
                {revokeClinic.isPending ? t("saving") : t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Clinic Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {t("createClinicTitle")}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {t("createClinicDesc")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClinic} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {t("clinicName")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clinicName}
                    onChange={(e) =>
                      setFormData({ ...formData, clinicName: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {t("ownerName")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {t("ownerEmail")} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {t("password")} *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {t("ownerPhone")}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {t("city")}
                  </label>
                  <input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {t("state")}
                  </label>
                  <input
                    type="text"
                    value={formData.state || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {t("pincode")}
                  </label>
                  <input
                    type="text"
                    value={formData.pincode || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {t("address")}
                </label>
                <textarea
                  rows={2}
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={createClinic.isPending}
                  className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {createClinic.isPending ? t("saving") : t("saveClinic")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
