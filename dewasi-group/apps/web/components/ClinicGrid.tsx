"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, ShieldCheck, Wifi, Building2, Clock } from "lucide-react";

import {
  usePublicAllClinics,
  type PublicClinic,
} from "@/lib/hooks/usePublicDirectory";

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
// Clinic Card
// ============================================================

function ClinicCard({ clinic }: { clinic: PublicClinic }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const location = [clinic.address, clinic.city, clinic.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className="
        group relative overflow-hidden rounded-3xl
        border border-gray-200/80 bg-white p-5
        shadow-[0_2px_12px_rgba(0,0,0,0.04)]
        transition-all duration-300
        hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_18px_45px_rgba(0,0,0,0.09)]
        dark:border-soft-300 dark:bg-surface
      "
      role="article"
      aria-label={`Clinic: ${clinic.clinicName}`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] opacity-90" />

      <div className="flex items-center gap-4 pt-3">
        {clinic.logo && !logoFailed ? (
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-1 ring-gray-100 dark:ring-soft-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clinic.logo}
              alt={clinic.clinicName}
              onError={() => setLogoFailed(true)}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-bg-soft)] to-[var(--color-primary)]/10 text-lg font-bold text-[var(--color-primary-text)] ring-1 ring-gray-100 dark:ring-soft-300">
            {initials(clinic.clinicName)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-bold text-[var(--color-primary-dark-text)]">
              {clinic.clinicName}
            </h3>
            {clinic.isApproved && (
              <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--color-secondary)]" />
            )}
          </div>

          {typeof clinic.doctorsCount === "number" && (
            <p className="mt-0.5 truncate text-xs font-medium text-gray-500 dark:text-ink-500">
              {clinic.doctorsCount} doctor{clinic.doctorsCount === 1 ? "" : "s"} associated
            </p>
          )}
        </div>
      </div>

      <div className="my-4 h-px bg-gray-100 dark:bg-soft-100" />

      <div className="space-y-2.5">
        {location && (
          <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-ink-600">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-primary-text)]" />
            <span className="line-clamp-2">{location}</span>
          </div>
        )}

        {clinic.specialties && clinic.specialties.length > 0 && (
          <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-ink-600">
            <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-primary-text)]" />
            <span className="line-clamp-2">{clinic.specialties.join(", ")}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {clinic.onlineConsultationEnabled && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-secondary-light)] px-3 py-1.5 text-[11px] font-bold text-[var(--color-secondary-dark-text)]">
            <Wifi className="h-3.5 w-3.5" />
            Online Consultation
          </span>
        )}

        {clinic.isApproved && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg-soft)] px-3 py-1.5 text-[11px] font-bold text-[var(--color-primary-text)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Clinic Grid (with client-side search filter)
// ============================================================

export default function ClinicGrid({ query = "" }: { query?: string }) {
  const t = useTranslations("ClinicSearch");
  const { data, isLoading, isError } = usePublicAllClinics();

  const filtered = useMemo(() => {
    const clinics = data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return clinics;

    return clinics.filter((clinic) => {
      const haystack = [clinic.clinicName, clinic.city, clinic.state, clinic.address]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [data, query]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-52 animate-pulse rounded-3xl border border-gray-100 bg-gray-50 dark:border-soft-300 dark:bg-soft-50"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-dashed border-red-200 bg-red-50/60 p-14 text-center dark:border-red-500/25 dark:bg-red-500/5">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          {t("loadError") || "Could not load clinics right now. Please try again shortly."}
        </p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="col-span-full rounded-3xl border border-dashed border-gray-200 bg-gray-50/70 p-14 text-center dark:border-soft-300 dark:bg-soft-50/70">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-surface dark:ring-soft-300">
          <Clock className="h-7 w-7 text-gray-400 dark:text-ink-400" />
        </div>

        <p className="text-lg font-bold text-gray-800 dark:text-ink-800">
          {t("noResults") || "No clinics found."}
        </p>

        <p className="mt-1.5 text-sm text-gray-500 dark:text-ink-500">
          Try adjusting your search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {filtered.map((clinic) => (
        <ClinicCard key={clinic.id} clinic={clinic} />
      ))}
    </div>
  );
}