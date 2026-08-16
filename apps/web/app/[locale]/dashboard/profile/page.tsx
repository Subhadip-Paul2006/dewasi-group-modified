"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, User, Mail, Phone } from "lucide-react";
import { updateProfileSchema, type UpdateProfileInput } from "@doctor-contract/shared";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useMyPatientProfile } from "@/lib/hooks/useAppointments";

function toDateInputValue(iso: string | null | undefined) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export default function ProfilePage() {
  const t = useTranslations("Dashboard");
  const { user } = useAuth();
  const { data: patient, isLoading } = useMyPatientProfile();
  const queryClient = useQueryClient();

  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UpdateProfileInput>({ resolver: zodResolver(updateProfileSchema) });

  useEffect(() => {
    if (patient) {
      reset({
        dob: toDateInputValue(patient.dob),
        gender: patient.gender ?? undefined,
        bloodGroup: patient.bloodGroup ?? "",
        address: patient.address ?? "",
      });
    }
  }, [patient, reset]);

  async function onSubmit(values: UpdateProfileInput) {
    setServerError("");
    setSuccess(false);
    try {
      const payload: Record<string, unknown> = { ...values };
      if (values.dob) {
        payload.dob = new Date(values.dob).toISOString();
      } else {
        delete payload.dob;
      }
      if (!values.gender) delete payload.gender;

      await api.patch("/patient/me", payload);
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["patient", "me"] });
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[var(--color-primary-text)] dark:text-ink-500"
      >
        <ArrowLeft className="h-4 w-4" /> {t("backToDashboard")}
      </Link>

      <h1 className="text-2xl font-bold text-[var(--color-primary-dark-text)]">{t("editProfile")}</h1>

      <div className="mt-4 rounded-xl border border-gray-100 bg-white p-5 dark:border-soft-300 dark:bg-surface">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-ink-600">
          <User className="h-4 w-4 text-[var(--color-primary-text)]" />
          <span>{t("profileName")}: {user?.name}</span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-600 dark:text-ink-600">
          <Mail className="h-4 w-4 text-[var(--color-primary-text)]" />
          <span>{t("profileEmail")}: {user?.email}</span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-600 dark:text-ink-600">
          <Phone className="h-4 w-4 text-[var(--color-primary-text)]" />
          <span>{t("profilePhone")}: {user?.phone || t("profileNotSet")}</span>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-gray-500 dark:text-ink-500">{t("loadingAppointments")}</p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 rounded-xl border border-gray-100 bg-white p-5 dark:border-soft-300 dark:bg-surface"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-ink-700">{t("profileDob")}</label>
            <input
              {...register("dob")}
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] dark:border-soft-300 dark:bg-surface-100 dark:text-ink-800"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-ink-700">{t("profileGender")}</label>
            <select
              {...register("gender")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] dark:border-soft-300 dark:bg-surface-100 dark:text-ink-800"
            >
              <option value="">{t("selectGender")}</option>
              <option value="MALE">{t("genderMale")}</option>
              <option value="FEMALE">{t("genderFemale")}</option>
              <option value="OTHER">{t("genderOther")}</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-ink-700">{t("profileBloodGroup")}</label>
            <input
              {...register("bloodGroup")}
              placeholder={t("bloodGroupPlaceholder")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] dark:border-soft-300 dark:bg-surface-100 dark:text-ink-800 dark:placeholder:text-ink-400"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-ink-700">Address</label>
            <textarea
              {...register("address")}
              placeholder={t("addressPlaceholder")}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] dark:border-soft-300 dark:bg-surface-100 dark:text-ink-800 dark:placeholder:text-ink-400"
            />
          </div>

          {serverError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{serverError}</p>}
          {success && <p className="mt-3 text-sm text-green-600 dark:text-green-400">{t("profileUpdated")}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
          >
            {isSubmitting ? t("savingChanges") : t("saveChanges")}
          </button>
        </form>
      )}
    </div>
  );
}
