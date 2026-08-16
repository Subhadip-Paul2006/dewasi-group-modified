"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Pencil,
  Stethoscope,
  Mail,
  Phone,
  Clock3,
  IndianRupee,
  BriefcaseMedical,
  GraduationCap,
  UserRound,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useClinicDoctors,
  useAddDoctor,
  useEditDoctor,
  type ClinicDoctor,
} from "@/lib/hooks/useClinic";

const EMPTY_ADD = {
  name: "",
  email: "",
  password: "",
  phone: "",
  specialization: "",
  qualification: "",
  experience: "",
  fee: "",
  startTime: "",
};

const inputClasses =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15 dark:border-soft-300 dark:bg-surface-100 dark:text-ink-800 dark:placeholder:text-ink-400 dark:hover:border-soft-300";

export default function ClinicDoctorsPage() {
  const tDoc = useTranslations("ClinicDoctors");
  const tNav = useTranslations("ClinicNav");
  const { data: doctors, isLoading } = useClinicDoctors();
  const addDoctor = useAddDoctor();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_ADD);
  const [error, setError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    addDoctor.mutate(
      {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        specialization: form.specialization || undefined,
        qualification: form.qualification || undefined,
        experience: form.experience ? Number(form.experience) : undefined,
        fee: form.fee ? Number(form.fee) : undefined,
        startTime: form.startTime || undefined,
      },
      {
        onSuccess: () => {
          setForm(EMPTY_ADD);
          setShowAdd(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          setError(err?.response?.data?.message || "Failed to add doctor");
        },
      }
    );
  }

  function closeAddForm() {
    setShowAdd(false);
    setForm(EMPTY_ADD);
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
              <Stethoscope className="h-4 w-4 text-[var(--color-primary-text)]" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-text)]">
              {tNav("doctors")}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-primary-dark-text)] sm:text-3xl">
            {tDoc("heading")}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {tDoc("subtitle")}
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
          {showAdd ? "Cancel" : tDoc("addDoctor")}
        </button>
      </div>

      {/* =====================================================
          ADD DOCTOR FORM
      ====================================================== */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.04)] dark:border-soft-300 dark:bg-surface"
        >
          <div className="h-1 bg-[var(--color-primary)]" />

          <div className="p-5 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-bg-soft)] dark:bg-soft-100">
                  <UserRound className="h-5 w-5 text-[var(--color-primary-text)]" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-800 dark:text-ink-800">
                    Add New Doctor
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Create a doctor account and add their clinic details.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Doctor Name" required>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClasses}
                  placeholder="Enter doctor's name"
                />
              </Field>

              <Field label="Email" required>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClasses}
                  placeholder="doctor@example.com"
                />
              </Field>

              <Field label="Password" required>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={inputClasses}
                  placeholder="Minimum 6 characters"
                />
              </Field>

              <Field label="Phone">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClasses}
                  placeholder="Phone number"
                />
              </Field>

              <Field label="Specialization">
                <input
                  type="text"
                  value={form.specialization}
                  onChange={(e) =>
                    setForm({ ...form, specialization: e.target.value })
                  }
                  className={inputClasses}
                  placeholder="e.g. Cardiology"
                />
              </Field>

              <Field label="Qualification">
                <input
                  type="text"
                  value={form.qualification}
                  onChange={(e) =>
                    setForm({ ...form, qualification: e.target.value })
                  }
                  className={inputClasses}
                  placeholder="e.g. MBBS, MD"
                />
              </Field>

              <Field label="Experience">
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={form.experience}
                    onChange={(e) =>
                      setForm({ ...form, experience: e.target.value })
                    }
                    className={`${inputClasses} pr-16`}
                    placeholder="Years"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                    years
                  </span>
                </div>
              </Field>

              <Field label="Consultation Fee">
                <div className="relative">
                  <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min={0}
                    value={form.fee}
                    onChange={(e) => setForm({ ...form, fee: e.target.value })}
                    className={`${inputClasses} pl-9`}
                    placeholder="Consultation fee"
                  />
                </div>
              </Field>

              <Field label="Start Time">
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm({ ...form, startTime: e.target.value })
                  }
                  className={inputClasses}
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
                disabled={addDoctor.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addDoctor.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {addDoctor.isPending ? "Creating..." : "Create Doctor Account"}
              </button>

              <button
                type="button"
                onClick={closeAddForm}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-soft-300 dark:bg-surface-100 dark:text-ink-600 dark:hover:bg-soft-100"
              >
                Cancel
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
            <p className="text-sm font-medium text-gray-500">
              Loading doctors...
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}
      {!isLoading && (!doctors || doctors.length === 0) && (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm dark:border-soft-300 dark:bg-surface">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-bg-soft)] dark:bg-soft-100">
            <Stethoscope className="h-7 w-7 text-[var(--color-primary-text)]" />
          </div>

          <h2 className="mt-4 text-base font-bold text-[var(--color-primary-dark-text)]">
            No doctors yet
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            Add your first doctor to start managing your clinic's medical team.
          </p>

          {!showAdd && (
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add Doctor
            </button>
          )}
        </div>
      )}

      {/* =====================================================
          DOCTOR LIST
      ====================================================== */}
      {!isLoading && doctors && doctors.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-gray-800">Your Doctors</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              {doctors.length} doctor{doctors.length === 1 ? "" : "s"} added to
              your clinic
            </p>
          </div>

          <div className="grid gap-4">
            {doctors.map((doctor) => (
              <DoctorRow key={doctor.id} doctor={doctor} />
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
// Doctor Row Component
// ============================================================
function DoctorRow({ doctor }: { doctor: ClinicDoctor }) {
  const editDoctor = useEditDoctor();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    specialization: doctor.specialization ?? "",
    qualification: doctor.qualification ?? "",
    experience: doctor.experience?.toString() ?? "",
    fee: doctor.fee?.toString() ?? "",
    startTime: doctor.startTime ?? "",
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    editDoctor.mutate(
      {
        doctorId: doctor.id,
        specialization: form.specialization || undefined,
        qualification: form.qualification || undefined,
        experience: form.experience ? Number(form.experience) : undefined,
        fee: form.fee ? Number(form.fee) : undefined,
        startTime: form.startTime || undefined,
      },
      {
        onSuccess: () => {
          setEditing(false);
        },
      }
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] dark:border-soft-300 dark:bg-surface">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-bg-soft)] dark:bg-soft-100">
              <span className="text-base font-bold text-[var(--color-primary-text)]">
                {getInitials(doctor.user.name)}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-bold text-[var(--color-primary-dark-text)] sm:text-base">
                  {doctor.user.name}
                </p>

                {doctor.user.isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    Inactive
                  </span>
                )}
              </div>

              <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
                <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                <span className="truncate">{doctor.user.email}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            className={
              editing
                ? "inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600 dark:border-soft-300 dark:bg-soft-50 dark:text-ink-600"
                : "inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-bg-soft)] px-3 py-2 text-xs font-bold text-[var(--color-primary-text)] transition hover:bg-[var(--color-primary)]/10 dark:bg-soft-100"
            }
          >
            {editing ? (
              <X className="h-3.5 w-3.5" />
            ) : (
              <Pencil className="h-3.5 w-3.5" />
            )}
            {editing ? "Close" : "Edit"}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InfoItem
            icon={BriefcaseMedical}
            label="Specialization"
            value={doctor.specialization || "Not set"}
          />
          <InfoItem
            icon={GraduationCap}
            label="Qualification"
            value={doctor.qualification || "Not set"}
          />
          <InfoItem
            icon={Clock3}
            label="Start Time"
            value={doctor.startTime || "Not set"}
          />
          <InfoItem
            icon={IndianRupee}
            label="Consult Fee"
            value={doctor.fee != null ? `₹${doctor.fee}` : "Not set"}
          />
        </div>

        {(doctor.experience != null || doctor.user.phone) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-gray-50/50 px-4 py-2.5 text-xs font-medium text-gray-600 dark:bg-soft-50/50 dark:text-ink-600">
            {doctor.experience != null && (
              <div className="flex items-center gap-1.5">
                <BriefcaseMedical className="h-4 w-4 text-[var(--color-primary)]" />
                <span>{doctor.experience} years experience</span>
              </div>
            )}

            {doctor.experience != null && doctor.user.phone && (
              <span className="text-gray-300">•</span>
            )}

            {doctor.user.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-[var(--color-primary)]" />
                <span>{doctor.user.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* =================================================
            EDIT FORM
        ================================================== */}
        {editing && (
          <form
            onSubmit={handleSave}
            className="mt-5 border-t border-gray-100 pt-5"
          >
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[var(--color-primary-dark-text)]">
                Edit Doctor Details
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Update the clinic-specific information for this doctor.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Specialization">
                <input
                  value={form.specialization}
                  onChange={(e) =>
                    setForm({ ...form, specialization: e.target.value })
                  }
                  className={inputClasses}
                  placeholder="e.g. Cardiology"
                />
              </Field>

              <Field label="Qualification">
                <input
                  value={form.qualification}
                  onChange={(e) =>
                    setForm({ ...form, qualification: e.target.value })
                  }
                  className={inputClasses}
                  placeholder="e.g. MBBS, MD"
                />
              </Field>

              <Field label="Experience">
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={form.experience}
                    onChange={(e) =>
                      setForm({ ...form, experience: e.target.value })
                    }
                    className={`${inputClasses} pr-16`}
                    placeholder="Years"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                    years
                  </span>
                </div>
              </Field>

              <Field label="Consultation Fee">
                <div className="relative">
                  <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min={0}
                    value={form.fee}
                    onChange={(e) => setForm({ ...form, fee: e.target.value })}
                    className={`${inputClasses} pl-9`}
                    placeholder="Fee"
                  />
                </div>
              </Field>

              <Field label="Start Time">
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm({ ...form, startTime: e.target.value })
                  }
                  className={inputClasses}
                />
              </Field>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={editDoctor.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editDoctor.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {editDoctor.isPending ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-soft-300 dark:bg-surface-100 dark:text-ink-600 dark:hover:bg-soft-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Info Item Component
// ============================================================
function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3 transition-colors hover:bg-gray-50 dark:border-soft-300 dark:bg-soft-50/70 dark:hover:bg-soft-50">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
        <span className="truncate text-[10px] font-bold uppercase tracking-wider text-gray-500">
          {label}
        </span>
      </div>
      <p className="mt-1.5 truncate text-xs font-bold text-gray-800 dark:text-ink-800">{value}</p>
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