"use client";

import { Search, CalendarCheck, Timer } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("HowItWorks");

  const steps = [
    { icon: Search, title: t("step1Title"), desc: t("step1Desc") },
    { icon: CalendarCheck, title: t("step2Title"), desc: t("step2Desc") },
    { icon: Timer, title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <section id="how" className="bg-[var(--color-bg-soft)] px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold text-[var(--color-primary-dark)]">
          {t("heading")}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl bg-white p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-primary)]">
                <Icon className="h-5 w-5 text-white" />
              </span>
              <h3 className="mt-4 font-semibold text-gray-800">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
