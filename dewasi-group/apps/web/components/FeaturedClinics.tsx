"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, ShieldCheck, Wifi, Users, Building2 } from "lucide-react";

import { Link } from "@/i18n/routing";
import {
  usePublicFeaturedClinics,
  type PublicClinic,
} from "@/lib/hooks/usePublicDirectory";
import SectionHeader from "@/components/SectionHeader";

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
// Featured Clinic Card (large / prominent)
// ============================================================

function FeaturedClinicCard({
  clinic,
  index,
}: {
  clinic: PublicClinic;
  index: number;
}) {
  const location = [clinic.city, clinic.state].filter(Boolean).join(", ") || clinic.address;
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <Link
      href="/clinics"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
      className="
        animate-in fade-in slide-in-from-top-3
        group relative block h-full w-full overflow-hidden
        rounded-3xl border border-gray-200/80 bg-white p-6
        shadow-[0_2px_16px_rgba(0,0,0,0.05)]
        transition-all duration-300
        hover:-translate-y-1.5 hover:border-gray-300 hover:shadow-[0_22px_50px_rgba(0,0,0,0.10)]
        dark:border-soft-300 dark:bg-surface
      "
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)]" />

      {clinic.isApproved && (
        <div className="absolute left-5 top-6 z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white bg-white/95 px-3 py-1.5 text-[10px] font-bold text-[var(--color-secondary-dark-text)] shadow-sm backdrop-blur dark:border-soft-300 dark:bg-surface/95">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-secondary)]" />
            Verified Clinic
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-5 pt-14 text-center md:flex-row md:items-center md:pt-14 md:text-left">
        <div className="relative shrink-0">
          {clinic.logo && !logoFailed ? (
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl ring-1 ring-gray-100 shadow-sm dark:ring-soft-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={clinic.logo}
                alt={clinic.clinicName}
                onError={() => setLogoFailed(true)}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-bg-soft)] to-[var(--color-primary)]/10 text-2xl font-bold text-[var(--color-primary-text)] shadow-sm ring-1 ring-gray-100 transition-transform duration-300 group-hover:scale-[1.03] dark:ring-soft-300">
              {initials(clinic.clinicName)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold tracking-[-0.01em] text-[var(--color-primary-dark-text)] transition-colors group-hover:text-[var(--color-primary-text)] md:text-xl">
            {clinic.clinicName}
          </h3>

          {clinic.specialties && clinic.specialties.length > 0 && (
            <p className="mt-1 flex items-center justify-center gap-1.5 truncate text-xs font-medium text-gray-500 md:justify-start dark:text-ink-500">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary-text)]" />
              {clinic.specialties.slice(0, 3).join(" · ")}
            </p>
          )}

          {typeof clinic.doctorsCount === "number" && (
            <p className="mt-1 flex items-center justify-center gap-1.5 truncate text-xs font-medium text-gray-500 md:justify-start dark:text-ink-500">
              <Users className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary-text)]" />
              {clinic.doctorsCount} doctor{clinic.doctorsCount === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </div>

      <div className="my-5 h-px bg-gray-100 dark:bg-soft-100" />

      <div className="flex flex-wrap items-center gap-2.5">
        {location && (
          <div className="flex min-w-0 flex-1 items-center rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-2.5 dark:border-soft-300 dark:bg-soft-50">
            <MapPin className="mr-2 h-4 w-4 shrink-0 text-[var(--color-primary-text)]" />
            <span className="truncate text-xs font-semibold text-gray-600 dark:text-ink-600">
              {location}
            </span>
          </div>
        )}

        {clinic.onlineConsultationEnabled && (
          <div className="shrink-0 rounded-xl border border-[var(--color-secondary)]/20 bg-[var(--color-secondary-light)] px-3.5 py-2.5 dark:border-[var(--color-secondary)]/25">
            <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-secondary-dark-text)]">
              <Wifi className="h-3.5 w-3.5" />
              Online
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--color-bg-soft)]/60 px-3.5 py-2.5 transition-colors group-hover:bg-[var(--color-bg-soft)]">
        <span className="text-xs font-bold text-[var(--color-primary-text)]">
          View Clinic
        </span>
        <span className="text-xs font-semibold text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--color-primary-text)] dark:text-ink-400">
          →
        </span>
      </div>
    </Link>
  );
}

// ============================================================

export default function FeaturedClinics() {
  const t = useTranslations("HomePage");
  const { data, isLoading } = usePublicFeaturedClinics();
  const featured = data ?? [];

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <SectionHeader eyebrow="Partner Network" title={t("featuredClinics")} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-3xl border border-gray-100 bg-gray-50 dark:border-soft-300 dark:bg-soft-50"
            />
          ))}
        </div>
      </section>
    );
  }

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <SectionHeader
        eyebrow="Partner Network"
        title={t("featuredClinics")}
        viewAllHref="/clinics"
        viewAllLabel={t("viewAll")}
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((clinic, i) => (
          <FeaturedClinicCard key={clinic.id} clinic={clinic} index={i} />
        ))}
      </div>
    </section>
  );
}