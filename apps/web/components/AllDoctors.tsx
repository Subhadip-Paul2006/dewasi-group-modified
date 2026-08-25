"use client";

import { useTranslations } from "next-intl";
import { MapPin, Stethoscope } from "lucide-react";

import type { Doctor } from "@doctor-contract/shared";
import { Link } from "@/i18n/routing";
import { usePublicAllDoctors } from "@/lib/hooks/usePublicDirectory";
import SectionHeader from "@/components/SectionHeader";
import ViewAllButton from "@/components/ViewAllButton";
import HorizontalCarousel from "@/components/HorizontalCarousel";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ============================================================
// Compact Doctor Card (used inside the horizontal carousel)
// ============================================================

function DoctorMiniCard({ doctor }: { doctor: Doctor }) {
  const location = doctor.clinic?.city ?? doctor.clinic?.clinicName;

  return (
    <Link
      href="/doctors"
      className="
        group relative block w-[190px] shrink-0 overflow-hidden
        rounded-2xl border border-gray-200/80 bg-white p-4
        shadow-[0_2px_10px_rgba(0,0,0,0.04)]
        transition-all duration-300
        hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]
        sm:w-[210px]
        dark:border-soft-300 dark:bg-surface
      "
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-bg-soft)] to-[var(--color-primary)]/10 text-sm font-bold text-[var(--color-primary-text)] ring-1 ring-gray-100 transition-transform duration-300 group-hover:scale-105 dark:ring-soft-300">
          {initials(doctor.user.name)}
        </div>

        <h4 className="mt-2.5 w-full truncate text-sm font-bold text-[var(--color-primary-dark-text)]">
          {doctor.user.name}
        </h4>

        {doctor.specialization && (
          <p className="mt-0.5 flex w-full items-center justify-center gap-1 truncate text-[11px] font-medium text-gray-500 dark:text-ink-500">
            <Stethoscope className="h-3 w-3 shrink-0 text-[var(--color-primary-text)]" />
            <span className="truncate">{doctor.specialization}</span>
          </p>
        )}

        {location && (
          <p className="mt-1.5 flex w-full items-center justify-center gap-1 truncate text-[11px] text-gray-400 dark:text-ink-400">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{location}</span>
          </p>
        )}
      </div>
    </Link>
  );
}

// ============================================================

export default function AllDoctors() {
  const t = useTranslations("HomePage");
  const { data, isLoading } = usePublicAllDoctors();
  const doctors = data ?? [];

  if (!isLoading && doctors.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
      <SectionHeader eyebrow="Browse the directory" title={t("allDoctors")} />

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[178px] w-[190px] shrink-0 animate-pulse rounded-2xl border border-gray-100 bg-gray-50 sm:w-[210px] dark:border-soft-300 dark:bg-soft-50"
            />
          ))}
        </div>
      ) : (
        <HorizontalCarousel ariaLabel={t("allDoctors")}>
          {doctors.map((doctor) => (
            <DoctorMiniCard key={doctor.id} doctor={doctor} />
          ))}
        </HorizontalCarousel>
      )}

      <ViewAllButton href="/doctors" label={t("viewAllDoctors")} />
    </section>
  );
}