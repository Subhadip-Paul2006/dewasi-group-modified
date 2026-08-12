"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  MapPin,
  Image as ImageIcon,
  Loader2,
  Users,
  UserRound,
  CheckCircle2,
  Clock3,
  Pencil,
  Wifi,
  X,
  AlertTriangle,
  Save,
  RefreshCw,
  History,
} from "lucide-react";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  useClinicProfile,
  useUpdateClinicProfile,
  useUploadClinicLogo,
  useToggleOnlineConsultation,
  useClinicDoctors,
  useClinicReceptionists,
} from "@/lib/hooks/useClinic";

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const clinicFormSchema = z.object({
  clinicName: z.string().min(3, "Clinic name must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{5,6}$/, "Enter a valid 5-6 digit pincode"),
});

type ClinicFormData = z.infer<typeof clinicFormSchema>;

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ClinicOverviewPage() {
  const queryClient = useQueryClient();
  const { data: clinic, isLoading } = useClinicProfile();
  const { data: doctors } = useClinicDoctors();
  const { data: receptionists } = useClinicReceptionists();

  const updateProfile = useUpdateClinicProfile();
  const uploadLogo = useUploadClinicLogo();
  const toggleOnline = useToggleOnlineConsultation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ClinicFormData>({
    clinicName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ClinicFormData, string>>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [activityLog, setActivityLog] = useState<string[]>([]);

  // ============================================================
  // EFFECTS
  // ============================================================

  // Update last synced time when clinic data changes
  useEffect(() => {
    if (clinic) {
      setLastSynced(new Date());
    }
  }, [clinic]);

  // Warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // ============================================================
  // HANDLERS
  // ============================================================

  const logActivity = useCallback((action: string) => {
    const timestamp = new Date().toLocaleString();
    setActivityLog((prev) => [`${timestamp} - ${action}`, ...prev].slice(0, 50));
  }, []);

  const startEditing = useCallback(() => {
    if (clinic) {
      setForm({
        clinicName: clinic.clinicName,
        address: clinic.address ?? "",
        city: clinic.city ?? "",
        state: clinic.state ?? "",
        pincode: clinic.pincode ?? "",
      });
      setErrors({});
    }
    setEditing(true);
  }, [clinic]);

  // ✅ সংশোধিত handleSave ফাংশন (Optimistic Update এবং Cache-এর সমস্যা সমাধান করা হয়েছে)
  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate form
      const result = clinicFormSchema.safeParse(form);
      if (!result.success) {
        const formattedErrors: Partial<Record<keyof ClinicFormData, string>> = {};
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result.error.issues.forEach((err: any) => {
          const path = err.path[0] as keyof ClinicFormData;
          formattedErrors[path] = err.message;
        });
        
        setErrors(formattedErrors);
        toast.error("Please fix the errors before saving");
        return;
      }

      const queryKey = ["clinic", "profile"];
      // Optimistic update - সেভ করার জন্য আগের ডাটা রেখে দেওয়া হলো
      const previousClinic = queryClient.getQueryData(queryKey);

      try {
        // UI আগে আপডেট করে দেওয়া হলো
        queryClient.setQueryData(queryKey, (old: any) => ({
          ...old,
          ...form,
        }));

        // API Call করা হলো
        await updateProfile.mutateAsync(form);

        setEditing(false);
        setSaved(true);
        setHasUnsavedChanges(false);
        setErrors({});
        logActivity("Updated clinic profile");
        toast.success("Clinic profile updated successfully!");

        setTimeout(() => {
          setSaved(false);
        }, 3000);
      } catch (error) {
        // Rollback on error - কোনো কারণে এরর আসলে আগের ডাটায় ফিরে যাওয়া
        queryClient.setQueryData(queryKey, previousClinic);
        toast.error("Failed to update profile. Please try again.");
        logActivity("Failed to update clinic profile");
      }
    },
    [form, queryClient, updateProfile, logActivity]
  );

  const handleLogoPick = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      try {
        await uploadLogo.mutateAsync(file);
        toast.success("Logo uploaded successfully!");
        logActivity("Uploaded clinic logo");
      } catch (error) {
        setLogoPreview(null);
        toast.error("Failed to upload logo");
        logActivity("Failed to upload clinic logo");
      }
    },
    [uploadLogo, logActivity]
  );

  const handleToggleOnline = useCallback(async () => {
    if (clinic?.onlineConsultationEnabled) {
      setConfirmToggle(true);
    } else {
      try {
        await toggleOnline.mutateAsync(true);
        toast.success("Online consultation enabled");
        logActivity("Enabled online consultation");
      } catch (error) {
        toast.error("Failed to toggle online consultation");
        logActivity("Failed to toggle online consultation");
      }
    }
  }, [clinic?.onlineConsultationEnabled, toggleOnline, logActivity]);

  const confirmToggleOnline = useCallback(async () => {
    try {
      await toggleOnline.mutateAsync(false);
      toast.success("Online consultation disabled");
      logActivity("Disabled online consultation");
      setConfirmToggle(false);
    } catch (error) {
      toast.error("Failed to toggle online consultation");
      logActivity("Failed to toggle online consultation");
    }
  }, [toggleOnline, logActivity]);

  const handleCancelEdit = useCallback(() => {
    setEditing(false);
    setErrors({});
    setHasUnsavedChanges(false);
  }, []);

  const handleFormChange = useCallback(
    (field: keyof ClinicFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setHasUnsavedChanges(true);
      // Clear error for this field as user types
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  // ============================================================
  // COMPUTED VALUES
  // ============================================================

  const fullAddress = useMemo(() => {
    return [clinic?.address, clinic?.city, clinic?.state, clinic?.pincode]
      .filter(Boolean)
      .join(", ");
  }, [clinic?.address, clinic?.city, clinic?.state, clinic?.pincode]);

  const logoUrl = useMemo(() => {
    return logoPreview || clinic?.logo || null;
  }, [logoPreview, clinic?.logo]);

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (isLoading || !clinic) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-64 bg-gray-200 rounded mt-2" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>

        {/* Main card skeleton */}
        <div className="h-96 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Clinic Management
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-primary-dark)] sm:text-3xl">
            Clinic Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your clinic information, team and online consultation.
          </p>

          {lastSynced && (
            <p className="mt-1 text-[10px] text-gray-400">
              Last synced: {lastSynced.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Activity Log Button */}
        <button
          type="button"
          onClick={() => {
            toast.custom((t) => (
              <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-800">Activity Log</h3>
                  <button onClick={() => toast.dismiss(t.id)}>
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto text-xs space-y-1">
                  {activityLog.length === 0 ? (
                    <p className="text-gray-400">No recent activity</p>
                  ) : (
                    activityLog.map((log, i) => (
                      <p key={i} className="text-gray-600">
                        {log}
                      </p>
                    ))
                  )}
                </div>
              </div>
            ));
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          <History className="h-3.5 w-3.5" />
          Activity
        </button>
      </div>

      {/* =====================================================
          APPROVAL WARNING
      ====================================================== */}

      {!clinic.isApproved && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <Clock3 className="h-4 w-4 text-amber-700" />
          </div>

          <div>
            <p className="text-sm font-bold">Approval pending</p>
            <p className="mt-0.5 text-xs leading-5 text-amber-700">
              Your clinic is not yet approved by admin. It won't be visible in
              doctor search until it is approved.
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          icon={UserRound}
          label="Doctors"
          value={doctors?.length ?? 0}
        />

        <StatCard
          icon={Users}
          label="Receptionists"
          value={receptionists?.length ?? 0}
        />

        <div className="col-span-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-bg-soft)]">
              <CheckCircle2 className="h-5 w-5 text-[var(--color-primary)]" />
            </div>

            <span
              className={`
                rounded-full px-2.5 py-1 text-[10px] font-bold
                ${
                  clinic.isApproved
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
                }
              `}
            >
              {clinic.isApproved ? "Approved" : "Pending"}
            </span>
          </div>

          <p className="mt-4 text-lg font-bold text-gray-800">Clinic Status</p>
          <p className="mt-0.5 text-xs font-medium text-gray-500">
            {clinic.isApproved
              ? "Your clinic is visible on the platform."
              : "Waiting for admin approval."}
          </p>
        </div>
      </div>

      {/* =====================================================
          CLINIC PROFILE
      ====================================================== */}

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)]" />

        <div className="p-5 sm:p-6">
          {/* =================================================
              PROFILE HEADER
          ================================================== */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {/* Logo */}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLogo.isPending}
                className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-[var(--color-bg-soft)] shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/20 hover:shadow-md disabled:cursor-not-allowed"
                aria-label="Change clinic logo"
              >
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt="Clinic logo"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <ImageIcon className="h-7 w-7 text-[var(--color-primary)]" />
                )}

                {/* Upload overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {uploadLogo.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Change"
                  )}
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoPick}
              />

              {/* Clinic Info */}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-bold text-[var(--color-primary-dark)] sm:text-xl">
                    {clinic.clinicName}
                  </h2>

                  {clinic.isApproved && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>

                {fullAddress && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-gray-500">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
                    <span>{fullAddress}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Edit */}

            {!editing && (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex items-center justify-center gap-1.5 self-start rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg-soft)] px-4 py-2 text-xs font-bold text-[var(--color-primary)] transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/10"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Profile
              </button>
            )}
          </div>

          {/* =================================================
              EDIT FORM
          ================================================== */}

          {editing && (
            <form
              onSubmit={handleSave}
              className="mt-6 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5"
            >
              <div className="mb-4">
                <p className="text-sm font-bold text-gray-800">
                  Edit clinic information
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Update the details patients see about your clinic.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Clinic Name" error={errors.clinicName}>
                  <input
                    required
                    value={form.clinicName}
                    onChange={(e) =>
                      handleFormChange("clinicName", e.target.value)
                    }
                    className={`w-full rounded-xl border ${
                      errors.clinicName ? "border-red-300" : "border-gray-200"
                    } bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15`}
                    placeholder="Enter clinic name"
                  />
                </Field>

                <Field label="City" error={errors.city}>
                  <input
                    value={form.city}
                    onChange={(e) => handleFormChange("city", e.target.value)}
                    className={`w-full rounded-xl border ${
                      errors.city ? "border-red-300" : "border-gray-200"
                    } bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15`}
                    placeholder="Enter city"
                  />
                </Field>

                <Field label="Address" full error={errors.address}>
                  <input
                    value={form.address}
                    onChange={(e) => handleFormChange("address", e.target.value)}
                    className={`w-full rounded-xl border ${
                      errors.address ? "border-red-300" : "border-gray-200"
                    } bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15`}
                    placeholder="Street, area, locality"
                  />
                </Field>

                <Field label="State" error={errors.state}>
                  <input
                    value={form.state}
                    onChange={(e) => handleFormChange("state", e.target.value)}
                    className={`w-full rounded-xl border ${
                      errors.state ? "border-red-300" : "border-gray-200"
                    } bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15`}
                    placeholder="Enter state"
                  />
                </Field>

                <Field label="Pincode" error={errors.pincode}>
                  <input
                    value={form.pincode}
                    onChange={(e) => handleFormChange("pincode", e.target.value)}
                    className={`w-full rounded-xl border ${
                      errors.pincode ? "border-red-300" : "border-gray-200"
                    } bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15`}
                    placeholder="Enter pincode"
                  />
                </Field>
              </div>

              {/* Form actions */}

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {updateProfile.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (clinic) {
                      setForm({
                        clinicName: clinic.clinicName,
                        address: clinic.address ?? "",
                        city: clinic.city ?? "",
                        state: clinic.state ?? "",
                        pincode: clinic.pincode ?? "",
                      });
                      setErrors({});
                      setHasUnsavedChanges(false);
                      toast.success("Reset to original values");
                    }
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 inline mr-1" />
                  Reset
                </button>
              </div>
            </form>
          )}

          {/* Saved Message */}

          {saved && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-3.5 py-3 text-xs font-semibold text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              Profile updated successfully.
            </div>
          )}

          {/* =================================================
              ONLINE CONSULTATION
          ================================================== */}

          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`
                  flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors
                  ${
                    clinic.onlineConsultationEnabled
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }
                `}
              >
                <Wifi
                  className={`
                    h-5 w-5
                    ${
                      clinic.onlineConsultationEnabled
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  `}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-800">
                    Online Consultation
                  </p>

                  <span
                    className={`
                      rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide
                      ${
                        clinic.onlineConsultationEnabled
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-500"
                      }
                    `}
                  >
                    {clinic.onlineConsultationEnabled ? "On" : "Off"}
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-gray-500">
                  Allow patients to book online with your doctors.
                </p>
              </div>
            </div>

            {/* Toggle */}

            <button
              type="button"
              role="switch"
              aria-checked={clinic.onlineConsultationEnabled}
              onClick={handleToggleOnline}
              disabled={toggleOnline.isPending}
              className={`
                relative h-7 w-12 shrink-0 rounded-full p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60
                ${
                  clinic.onlineConsultationEnabled
                    ? "bg-[var(--color-secondary)]"
                    : "bg-gray-300"
                }
              `}
            >
              <span
                className={`
                  block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200
                  ${
                    clinic.onlineConsultationEnabled
                      ? "translate-x-5"
                      : "translate-x-0"
                  }
                `}
              />
            </button>
          </div>

          {/* =================================================
              ONLINE CONSULTATION CONFIRMATION DIALOG
          ================================================== */}

          {confirmToggle && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-800">
                    Disable Online Consultation?
                  </p>
                  <p className="mt-1 text-xs text-red-700">
                    This will prevent patients from booking online appointments
                    with your doctors. Existing appointments will not be
                    affected.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={confirmToggleOnline}
                      disabled={toggleOnline.isPending}
                      className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      {toggleOnline.isPending && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      Yes, disable
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmToggle(false)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STAT CARD COMPONENT
// ============================================================

const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-bg-soft)]">
        <Icon className="h-5 w-5 text-[var(--color-primary)]" />
      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight text-[var(--color-primary-dark)]">
        {value}
      </p>

      <p className="mt-0.5 text-xs font-semibold text-gray-500">{label}</p>
    </div>
  );
};

// ============================================================
// FORM FIELD COMPONENT
// ============================================================

const Field = ({
  label,
  children,
  full,
  error,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
  error?: string;
}) => {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-bold text-gray-600">
        {label}
      </span>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
};