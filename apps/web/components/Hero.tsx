"use client";

import { Search, MapPin, Stethoscope } from "lucide-react";
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
    router.push("/dashboard/doctors?" + params.toString());
  }

  return (
    <section
      id="search"
      className="relative overflow-hidden bg-gradient-to-b from-[var(--color-bg-soft)] to-white px-5 pb-20 pt-16 md:pt-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <span className="mb-4 inline-block rounded-full bg-[var(--color-secondary-light)] px-4 py-1 text-xs font-semibold tracking-wide text-[var(--color-primary-dark)]">
          {t("badge")}
        </span>
        <h1 className="text-4xl font-extrabold leading-tight text-[var(--color-primary-dark)] md:text-5xl">
          {t("titleLine1")}
          <br className="hidden md:block" /> {t("titleLine2")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
          {t("subtitle")}
        </p>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-lg shadow-blue-900/5 md:flex-row"
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl px-4 py-3">
            <Stethoscope className="h-5 w-5 text-[var(--color-primary)]" />
            <input
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder={t("searchDoctorPlaceholder")}
              className="w-full text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <div className="hidden w-px bg-gray-100 md:block" />
          <div className="flex flex-1 items-center gap-2 rounded-xl px-4 py-3">
            <MapPin className="h-5 w-5 text-[var(--color-primary)]" />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t("searchLocationPlaceholder")}
              className="w-full text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
          >
            <Search className="h-4 w-4" />
            {t("searchButton")}
          </button>
        </form>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-gray-500">
          <Stat value="120+" label={t("statDoctors")} />
          <Stat value="35+" label={t("statClinics")} />
          <Stat value={t("statQueueValue")} label={t("statQueue")} />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-[var(--color-primary)]">{value}</span>
      <span>{label}</span>
    </div>
  );
}
