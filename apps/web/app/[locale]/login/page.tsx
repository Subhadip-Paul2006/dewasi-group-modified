"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useState } from "react";
import { loginSchema, type LoginInput } from "@doctor-contract/shared";
import { api, setAccessToken } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const t = useTranslations("AuthPage");
  const router = useRouter();
  const { setUser } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setServerError("");
    try {
      const { data } = await api.post("/auth/login", values);
      setAccessToken(data.data.accessToken);
      setUser(data.data.user);

      switch (data.data.user.role) {
        case "PATIENT":
          router.push("/dashboard");
          break;
        case "CLINIC":
          router.push("/clinic");
          break;
        case "DOCTOR":
          router.push("/doctor/dashboard");
          break;
        case "DIAGNOSTIC_CENTER":
          router.push("/diagnosticCenter/dashboard");
          break;
        case "DIAGNOSTIC_STAFF":
          router.push("/diagnosticCenter/referrals");
          break;
        case "SUPER_ADMIN":
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
        default:
          router.push("/");
      }
    } catch (err: any) {
      setServerError(err?.response?.data?.message || t("genericError"));
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[var(--color-bg-soft)] px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-blue-900/5 dark:border-soft-300 dark:bg-surface dark:shadow-black/30"
      >
        <h1 className="text-center text-2xl font-bold text-[var(--color-primary-dark-text)]">
          {t("loginHeading")}
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500 dark:text-ink-500">{t("loginSubtitle")}</p>

        <div className="mt-6">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-ink-700">{t("emailLabel")}</label>
          <input
            {...register("email")}
            type="email"
            placeholder={t("emailPlaceholder")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] dark:border-soft-300 dark:bg-surface-100 dark:text-ink-800 dark:placeholder:text-ink-400"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>}
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-ink-700">{t("passwordLabel")}</label>
          <input
            {...register("password")}
            type="password"
            placeholder={t("passwordPlaceholder")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] dark:border-soft-300 dark:bg-surface-100 dark:text-ink-800 dark:placeholder:text-ink-400"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>}
        </div>

        {serverError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
        >
          {isSubmitting ? t("submitLoginLoading") : t("submitLogin")}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-ink-500">
          {t("noAccount")}{" "}
          <Link href="/register" className="font-semibold text-[var(--color-primary-text)]">
            {t("signUpLink")}
          </Link>
        </p>
      </form>
    </main>
  );
}
