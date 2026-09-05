"use client";

import { HeartPulse, Baby, Bone, Brain, Eye, Stethoscope } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Specialties() {
  const t = useTranslations("Specialties");

  const specialties = [
    { icon: HeartPulse, label: t("cardiology") },
    { icon: Baby, label: t("pediatrics") },
    { icon: Bone, label: t("orthopedics") },
    { icon: Brain, label: t("neurology") },
    { icon: Eye, label: t("ophthalmology") },
    { icon: Stethoscope, label: t("generalPhysician") },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-center text-2xl font-bold text-[var(--color-primary-dark-text)]">
        {t("heading")}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-center text-sm text-gray-500 dark:text-ink-500">
        {t("subtitle")}
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {specialties.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="group flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-md dark:border-soft-300 dark:bg-surface"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-secondary-light)] transition group-hover:bg-[var(--color-primary)]">
              <Icon className="h-6 w-6 text-[var(--color-primary-text)] transition group-hover:text-white dark:text-[var(--color-primary-text)]" />
            </span>
            <span className="text-center text-xs font-medium text-gray-700 dark:text-ink-700">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
