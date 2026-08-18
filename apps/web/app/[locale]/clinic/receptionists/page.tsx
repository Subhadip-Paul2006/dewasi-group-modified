"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  X,
  UserCog,
  KeyRound,
  Users,
  Mail,
  Phone,
  UserRound,
  CheckCircle2,
  Loader2,
  Stethoscope,
} from "lucide-react";
import {
  useClinicReceptionists,
  useAddReceptionist,
  useClinicDoctors,
  useAssignDoctorsToReceptionist,
  useChangeStaffPassword,
  type ClinicReceptionist,
} from "@/lib/hooks/useClinic";

const EMPTY = { name: "", email: "", password: "", phone: "" };

// Replaces global <style jsx> to match the premium design language
const inputClasses =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15 dark:border-soft-300 dark:bg-surface-100 dark:text-ink-800 dark:placeholder:text-ink-400 dark:hover:border-soft-300";

export default function ClinicReceptionistsPage() {
  const tRec = useTranslations("ClinicReceptionists");
  const tNav = useTranslations("ClinicNav");
  const { data: receptionists, isLoading } = useClinicReceptionists();
  const { data: doctors } = useClinicDoctors();
  const addReceptionist = useAddReceptionist();

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    addReceptionist.mutate(
      { ...form, phone: form.phone || undefined },
      {
        onSuccess: () => {
          setForm(EMPTY);
          setShowAdd(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) =>
          setError(
            err?.response?.data?.message || "Failed to add receptionist"
          ),
      }
    );
  }

  function closeAddForm() {
    setShowAdd(false);
    setForm(EMPTY);
    setError("");
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-bg-soft)] dark:bg-soft-100">
              <Users className="h-4 w-4 text-[var(--color-primary-text)]" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-text)]">
              {tNav("receptionists")}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-primary-dark-text)] sm:text-3xl">
            {tRec("heading")}
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-ink-500">
            {tRec("subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showAdd) {
              closeAddForm();
            } else {
              setShowAdd(true);
              setError("");
            }
          }}
          className={
            showAdd
              ? "inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50 dark:border-soft-300 dark:bg-surface dark:text-ink-600 dark:hover:bg-soft-50"
              : "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          }
        >
          {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAdd ? tRec("cancel") : tRec("addReceptionist")}
        </button>
      </div>

      {/* =====================================================
          ADD RECEPTIONIST FORM
      ====================================================== */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.04)] dark:border-soft-300 dark:bg-surface"
        >
          {/* Top border accent matching Clinic Overview */}
          <div className="h-1 bg-[var(--color-primary)]" />

          <div className="p-5 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-bg-soft)] dark:bg-soft-100">
                  <UserRound className="h-5 w-5 text-[var(--color-primary-text)]" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-800 dark:text-ink-800">
                    {tRec("addNewReceptionist")}
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-ink-500">
                    {tRec("addReceptionistSub")}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={tRec("name")} required>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClasses}
                  placeholder="Enter full name"
                />
              </Field>

              <Field label={tRec("email")} required>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClasses}
                  placeholder="staff@example.com"
                />
              </Field>

              <Field label={tRec("password")} required>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={inputClasses}
                  placeholder="Minimum 6 characters"
                />
              </Field>

              <Field label={tRec("phone")}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClasses}
                  placeholder="Phone number"
                />
              </Field>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={addReceptionist.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addReceptionist.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {addReceptionist.isPending
                  ? tRec("creating")
                  : tRec("createAccount")}
              </button>

              <button
                type="button"
                onClick={closeAddForm}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-soft-300 dark:bg-surface-100 dark:text-ink-600 dark:hover:bg-soft-100"
              >
                {tRec("cancel")}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =====================================================
          LOADING
      ====================================================== */}
      {isLoading && (
        <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-gray-100 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.04)] dark:border-soft-300 dark:bg-surface">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[var(--color-primary)] border-t-transparent" />
            <p className="text-sm font-medium text-gray-500 dark:text-ink-500">
              {tRec("loadingReceptionists")}
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}
      {!isLoading && (!receptionists || receptionists.length === 0) && (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm dark:border-soft-300 dark:bg-surface">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-bg-soft)] dark:bg-soft-100">
            <Users className="h-7 w-7 text-[var(--color-primary-text)]" />
          </div>

          <h2 className="mt-4 text-base font-bold text-[var(--color-primary-dark-text)]">
            {tRec("noReceptionistsTitle")}
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-ink-500">
            {tRec("noReceptionistsSub")}
          </p>

          {!showAdd && (
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              {tRec("addReceptionist")}
            </button>
          )}
        </div>
      )}

      {/* =====================================================
          RECEPTIONIST LIST
      ====================================================== */}
      {!isLoading && receptionists && receptionists.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-gray-800 dark:text-ink-800">
              {tRec("frontDeskStaff")}
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-ink-500">
              {receptionists.length} {tRec("staffAdded")}
            </p>
          </div>

          <div className="grid gap-4">
            {receptionists.map((r) => (
              <ReceptionistRow
                key={r.id}
                receptionist={r}
                allDoctors={doctors ?? []}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Form Field Component
// ============================================================
function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-gray-600 dark:text-ink-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

// ============================================================
// Receptionist Row Component
// ============================================================
function ReceptionistRow({
  receptionist,
  allDoctors,
}: {
  receptionist: ClinicReceptionist;
  allDoctors: { id: string; user: { name: string } }[];
}) {
  const tRec = useTranslations("ClinicReceptionists");
  const assignDoctors = useAssignDoctorsToReceptionist();
  const changePassword = useChangeStaffPassword();

  const [assigning, setAssigning] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    receptionist.assignedDoctors?.map((a: any) => a.doctor?.id).filter(Boolean) ?? []
  );

  const [changingPw, setChangingPw] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");

  function toggleDoctor(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }

  function handleAssign() {
    if (selectedIds.length === 0) return;
    assignDoctors.mutate(
      { receptionistId: receptionist.id, doctorIds: selectedIds },
      { onSuccess: () => setAssigning(false) }
    );
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMessage("");
    changePassword.mutate(
      { userId: receptionist.user.id, newPassword },
      {
        onSuccess: () => {
          setPwMessage("Password updated successfully.");
          setNewPassword("");
          setTimeout(() => {
            setChangingPw(false);
            setPwMessage("");
          }, 1500);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) =>
          setPwMessage(
            err?.response?.data?.message || "Failed to update password"
          ),
      }
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] dark:border-soft-300 dark:bg-surface">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            {/* Avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-bg-soft)] dark:bg-soft-100">
              <span className="text-base font-bold text-[var(--color-primary-text)]">
                {getInitials(receptionist.user.name)}
              </span>
            </div>

            {/* Basic info */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-bold text-[var(--color-primary-dark-text)] sm:text-base">
                  {receptionist.user.name}
                </p>

                {receptionist.user.isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {tRec("active")}
                  </span>
                ) : (
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    {tRec("inactive")}
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-ink-500">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-ink-400" />
                  <span className="truncate">{receptionist.user.email}</span>
                </div>

                {receptionist.user.phone && (
                  <>
                    <span className="hidden text-gray-300 sm:block dark:text-ink-400">•</span>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-ink-400" />
                      <span className="truncate">{receptionist.user.phone}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={() => {
                setAssigning((v) => !v);
                setChangingPw(false);
              }}
              className={
                assigning
                  ? "inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600 dark:border-soft-300 dark:bg-surface-100 dark:text-ink-600"
                  : "inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-bg-soft)] px-3 py-2 text-xs font-bold text-[var(--color-primary-text)] transition hover:bg-[var(--color-primary)]/10 dark:border-soft-300 dark:bg-soft-100"
              }
            >
              {assigning ? (
                <X className="h-3.5 w-3.5" />
              ) : (
                <UserCog className="h-3.5 w-3.5" />
              )}
              {tRec("assignDoctors")}
            </button>
            <button
              type="button"
              onClick={() => {
                setChangingPw((v) => !v);
                setAssigning(false);
              }}
              className={
                changingPw
                  ? "inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600 dark:border-soft-300 dark:bg-surface-100 dark:text-ink-600"
                  : "inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-bg-soft)] px-3 py-2 text-xs font-bold text-[var(--color-primary-text)] transition hover:bg-[var(--color-primary)]/10 dark:border-soft-300 dark:bg-soft-100"
              }
            >
              {changingPw ? (
                <X className="h-3.5 w-3.5" />
              ) : (
                <KeyRound className="h-3.5 w-3.5" />
              )}
              {tRec("changePassword")}
            </button>
          </div>
        </div>

        {/* Assigned Doctors Display */}
        {(receptionist.assignedDoctors?.length ?? 0) > 0 && !assigning && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-gray-50/70 px-4 py-3 dark:bg-soft-50/70">
            <Stethoscope className="mr-1 h-4 w-4 text-[var(--color-primary-text)]" />
            <span className="text-xs font-semibold text-gray-600 dark:text-ink-600">
              {tRec("manages")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {receptionist.assignedDoctors.map((a: any, index) => (
                <span
                  key={a.id || a.doctor?.id || index}
                  className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold text-gray-700 shadow-sm dark:border-soft-300 dark:bg-surface dark:text-ink-700"
                >
                  {a.doctor?.user?.name || "Unknown"}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* =================================================
            ASSIGN DOCTORS PANEL
        ================================================== */}
        {assigning && (
          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-soft-300 dark:bg-soft-50/50">
            <h3 className="text-sm font-bold text-[var(--color-primary-dark-text)]">
              {tRec("assignDoctors")}
            </h3>
            <p className="mb-3 mt-1 text-xs text-gray-500 dark:text-ink-500">
              {tRec("assignDoctorsSub")}
            </p>

            <div className="flex flex-wrap gap-2">
              {allDoctors.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDoctor(d.id)}
                  className={
                    "rounded-xl border px-3 py-2 text-xs font-bold transition-all " +
                    (selectedIds.includes(d.id)
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[var(--color-primary)]/40 dark:border-soft-300 dark:bg-surface-100 dark:text-ink-600")
                  }
                >
                  {d.user.name}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleAssign}
                disabled={selectedIds.length === 0 || assignDoctors.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {assignDoctors.isPending && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                {assignDoctors.isPending ? tRec("assigning") : tRec("saveAssignments")}
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            CHANGE PASSWORD PANEL
        ================================================== */}
        {changingPw && (
          <form
            onSubmit={handleChangePassword}
            className="mt-5 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-soft-300 dark:bg-soft-50/50"
          >
            <h3 className="text-sm font-bold text-[var(--color-primary-dark-text)]">
              {tRec("updatePassword")}
            </h3>
            <p className="mb-3 mt-1 text-xs text-gray-500 dark:text-ink-500">
              {tRec("updatePasswordSub")} {receptionist.user.name}.
            </p>

            <div className="flex max-w-sm flex-col gap-3">
              <input
                type="password"
                required
                minLength={6}
                placeholder="New password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClasses}
              />
              <button
                type="submit"
                disabled={changePassword.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {changePassword.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {changePassword.isPending ? tRec("updating") : tRec("updatePasswordBtn")}
              </button>

              {pwMessage && (
                <div
                  className={`mt-1 rounded-xl px-3 py-2 text-xs font-semibold ${
                    pwMessage.includes("successfully")
                      ? "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                      : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                  }`}
                >
                  {pwMessage}
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Utility Component
// ============================================================
function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}