"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { registerSchema, type RegisterInput } from "@doctor-contract/shared";
import { api } from "@/lib/api";

const CLINIC_PHONE = "+919777777777";
const CLINIC_WHATSAPP = "919777777777";
const CLINIC_EMAIL = "clinics@doctorcontract.in";

export default function RegisterPage() {
  const t = useTranslations("AuthPage");
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setServerError("");
    try {
      await api.post("/auth/register", values);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setServerError(err?.response?.data?.message || t("genericError"));
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center gap-6 bg-[var(--color-bg-soft)] px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-blue-900/5"
      >
        <h1 className="text-center text-2xl font-bold text-[var(--color-primary-dark)]">
          {t("registerHeading")}
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">{t("registerSubtitle")}</p>

        <div className="mt-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">{t("nameLabel")}</label>
          <input
            {...register("name")}
            placeholder={t("namePlaceholder")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">{t("emailLabel")}</label>
          <input
            {...register("email")}
            type="email"
            placeholder={t("emailPlaceholder")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t("phoneLabel")} <span className="text-gray-400">{t("phoneOptional")}</span>
          </label>
          <input
            {...register("phone")}
            placeholder={t("phonePlaceholder")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">{t("passwordLabel")}</label>
          <input
            {...register("password")}
            type="password"
            placeholder={t("passwordPlaceholder")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        {serverError && <p className="mt-3 text-sm text-red-600">{serverError}</p>}
        {success && <p className="mt-3 text-sm text-green-600">{t("registerSuccess")}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
        >
          {isSubmitting ? t("submitRegisterLoading") : t("submitRegister")}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          {t("haveAccount")}{" "}
          <Link href="/login" className="font-semibold text-[var(--color-primary)]">
            {t("loginLink")}
          </Link>
        </p>
      </form>

      <div className="w-full max-w-md rounded-2xl border border-dashed border-[var(--color-primary)]/40 bg-white p-6 text-center">
        <h2 className="font-semibold text-[var(--color-primary-dark)]">{t("clinicHeading")}</h2>
        <p className="mt-1 text-sm text-gray-500">{t("clinicSubtitle")}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href={"tel:" + CLINIC_PHONE}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <Phone className="h-4 w-4" /> {t("clinicCall")}
          </a>
          <a
            href={"https://wa.me/" + CLINIC_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)]"
          >
            <MessageCircle className="h-4 w-4" /> {t("clinicWhatsapp")}
          </a>
          <a
            href={"mailto:" + CLINIC_EMAIL}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <Mail className="h-4 w-4" /> {t("clinicEmail")}
          </a>
        </div>
      </div>
    </main>
  );
}
