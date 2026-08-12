"use client";

import { Search, MapPin, Stethoscope, Activity, Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";

export default function Hero() {
  const t = useTranslations("Hero");
  const router = useRouter();
  const [doctorName, setDoctorName] = useState("");
  const [city, setCity] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (doctorName) params.set("doctorName", doctorName);
    if (city) params.set("city", city);
    router.push("/doctors?" + params.toString());
  }

  return (
    <section
      id="search"
      className="relative overflow-hidden bg-[var(--color-bg-soft)] px-5 pb-24 pt-16 md:pt-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[var(--color-primary)]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-[var(--color-secondary)]/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/15 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--color-primary-dark)] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-secondary)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-secondary)]" />
            </span>
            {t("badge")}
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-[var(--color-primary-dark)] md:text-6xl">
            {t("titleLine1")}
            <br />
            <span className="text-[var(--color-primary)]">{t("titleLine2")}</span>
          </h1>

          <p className="mt-5 max-w-lg text-lg text-gray-600">{t("subtitle")}</p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl shadow-blue-900/[0.06] md:flex-row"
          >
            <div className="flex flex-1 items-center gap-2 rounded-xl px-4 py-3">
              <Stethoscope className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
              <input
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder={t("searchDoctorPlaceholder")}
                className="w-full text-sm outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="hidden w-px bg-gray-100 md:block" />
            <div className="flex flex-1 items-center gap-2 rounded-xl px-4 py-3">
              <MapPin className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t("searchLocationPlaceholder")}
                className="w-full text-sm outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)] hover:shadow-lg"
            >
              <Search className="h-4 w-4" />
              {t("searchButton")}
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-gray-500">
            <Stat value="120+" label={t("statDoctors")} />
            <Stat value="35+" label={t("statClinics")} />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-2xl shadow-blue-900/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Sunrise Clinic
              </span>
              <span className="flex items-center gap-1 rounded-full bg-[var(--color-secondary-light)] px-2.5 py-1 text-xs font-semibold text-[var(--color-primary-dark)]">
                <Activity className="h-3 w-3" />
                {t("statQueueValue")}
              </span>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-[var(--color-primary)]/25 bg-[var(--color-bg-soft)] p-6 text-center">
              <p className="text-xs font-medium text-gray-500">Your token</p>
              <p className="mt-1 text-6xl font-extrabold tracking-tight text-[var(--color-primary)]">
                24
              </p>
              <p className="mt-1 text-xs text-gray-500">Dr. Ananya Sharma - Cardiologist</p>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-white px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock3 className="h-4 w-4 text-[var(--color-primary)]" />
                Estimated wait
              </div>
              <span className="text-sm font-bold text-[var(--color-primary-dark)]">12 min</span>
            </div>

            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />
            </div>
          </div>

          <div className="absolute -bottom-5 -left-6 hidden items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-lg shadow-blue-900/10 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]">
              <Stethoscope className="h-4 w-4 text-white" />
            </span>
            <div>
              <p className="text-xs font-semibold text-gray-800">Verified Doctors</p>
              <p className="text-[11px] text-gray-400">Checked & approved</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-lg font-bold text-[var(--color-primary)]">{value}</span>
      <span>{label}</span>
    </div>
  );
}
