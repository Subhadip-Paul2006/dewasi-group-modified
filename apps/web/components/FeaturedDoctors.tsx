"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Award, ShieldCheck, Stethoscope } from "lucide-react";

import type { Doctor } from "@doctor-contract/shared";
import { Link } from "@/i18n/routing";
import { usePublicFeaturedDoctors } from "@/lib/hooks/usePublicDirectory";
import SectionHeader from "@/components/SectionHeader";

// ============================================================
// Initials
// ============================================================

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
// Featured Doctor Card (large / prominent)
// ============================================================

function FeaturedDoctorCard({
  doctor,
  index,
}: {
  doctor: Doctor;
  index: number;
}) {
  const location = doctor.clinic?.city ?? doctor.clinic?.clinicName;
  const experience = doctor.experience ?? 0;

  return (
    <Link
      href="/doctors"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
      className="
        animate-in fade-in slide-in-from-top-3
        group relative block h-full w-full overflow-hidden
        rounded-3xl
        border border-gray-200/80
        bg-white
        p-6
        shadow-[0_2px_16px_rgba(0,0,0,0.05)]
        transition-all duration-300
        hover:-translate-y-1.5
        hover:border-gray-300
        hover:shadow-[0_22px_50px_rgba(0,0,0,0.10)]
        dark:border-soft-300
        dark:bg-surface
        dark:hover:border-soft-300
      "
    >
      {/* Top Accent */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)]" />

      {experience > 0 && (
        <div className="absolute left-5 top-6 z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white bg-white/95 px-3 py-1.5 text-[10px] font-bold text-[var(--color-secondary-dark-text)] shadow-sm backdrop-blur dark:border-soft-300 dark:bg-surface/95">
            <Award className="h-3.5 w-3.5 text-[var(--color-secondary)]" />
            {experience}+ Yrs Exp
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-5 pt-14 text-center md:flex-row md:items-center md:pt-14 md:text-left">
        <div className="relative shrink-0">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-bg-soft)] to-[var(--color-primary)]/10 text-2xl font-bold text-[var(--color-primary-text)] shadow-sm ring-1 ring-gray-100 transition-transform duration-300 group-hover:scale-[1.03] dark:ring-soft-300">
            {initials(doctor.user.name)}
          </div>

          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white bg-green-500 shadow-sm dark:border-surface">
            <ShieldCheck className="h-3 w-3 text-white" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold tracking-[-0.01em] text-[var(--color-primary-dark-text)] transition-colors group-hover:text-[var(--color-primary-text)] md:text-xl">
            {doctor.user.name}
          </h3>

          {doctor.qualification && (
            <p className="mt-0.5 truncate text-sm font-semibold text-gray-700 dark:text-ink-700">
              {doctor.qualification}
            </p>
          )}

          {doctor.specialization && (
            <p className="mt-1 flex items-center justify-center gap-1.5 truncate text-xs font-medium text-gray-500 md:justify-start dark:text-ink-500">
              <Stethoscope className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary-text)]" />
              {doctor.specialization}
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

        {doctor.fee != null && (
          <div className="shrink-0 rounded-xl border border-[var(--color-secondary)]/20 bg-[var(--color-secondary-light)] px-3.5 py-2.5 dark:border-[var(--color-secondary)]/25">
            <span className="text-xs font-bold text-[var(--color-secondary-dark-text)]">
              ₹{doctor.fee}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--color-bg-soft)]/60 px-3.5 py-2.5 transition-colors group-hover:bg-[var(--color-bg-soft)]">
        <span className="text-xs font-bold text-[var(--color-primary-text)]">
          View Doctor Profile
        </span>
        <span className="text-xs font-semibold text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--color-primary-text)] dark:text-ink-400">
          →
        </span>
      </div>
    </Link>
  );
}

// ============================================================

export default function FeaturedDoctors() {
  const t = useTranslations("HomePage");

  const { data, isLoading } = usePublicFeaturedDoctors();
  const featured = data ?? [];

  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ==========================================================
  // Mobile Detection
  // ==========================================================

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ==========================================================
  // Auto Slide (mobile only)
  // ==========================================================

  useEffect(() => {
    if (!isMobile || featured.length < 2) return;

    autoSlideRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
    }, 4500);

    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [isMobile, featured.length]);

  function restartAutoSlide() {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    if (!isMobile || featured.length < 2) return;

    autoSlideRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
    }, 4500);
  }

  function goTo(i: number) {
    setIndex(i);
    restartAutoSlide();
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setIndex((i) => (i + 1) % featured.length);
      } else {
        setIndex((i) => (i - 1 + featured.length) % featured.length);
      }
    }

    touchStartX.current = null;
    restartAutoSlide();
  }

  // ==========================================================
  // Loading / Empty
  // ==========================================================

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <SectionHeader eyebrow="Trusted Healthcare" title={t("featuredDoctors")} />
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

  const total = featured.length;
  const prevIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <SectionHeader
        eyebrow="Trusted Healthcare"
        title={t("featuredDoctors")}
        viewAllHref="/doctors"
        viewAllLabel={t("viewAll")}
      />

      {/* Tablet / Desktop Grid */}
      <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
        {featured.map((doctor, i) => (
          <FeaturedDoctorCard key={doctor.id} doctor={doctor} index={i} />
        ))}
      </div>

      {/* Mobile - Swipe Carousel */}
      <div
        className="relative h-[26rem] overflow-hidden md:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {featured.map((doctor, i) => {
          let position: "center" | "left" | "right" | "hidden" = "hidden";

          if (i === index) position = "center";
          else if (i === prevIndex) position = "left";
          else if (i === nextIndex) position = "right";

          const styles: Record<typeof position, string> = {
            center: "left-1/2 -translate-x-1/2 scale-100 opacity-100 blur-0 z-30",
            left: "left-0 -translate-x-[10%] scale-[0.85] opacity-60 blur-[2px] z-20",
            right: "left-full -translate-x-[110%] scale-[0.85] opacity-60 blur-[2px] z-20",
            hidden: "opacity-0 pointer-events-none",
          };

          return (
            <div
              key={doctor.id}
              className={`absolute top-0 w-[84%] max-w-[320px] transition-all duration-700 ease-out ${styles[position]}`}
            >
              <FeaturedDoctorCard doctor={doctor} index={i} />
            </div>
          );
        })}

        {/* Progress Dots */}
        <div className="absolute bottom-0 left-1/2 z-40 flex -translate-x-1/2 gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? "h-2 w-6 bg-[var(--color-primary)]"
                  : "h-2 w-2 bg-[var(--color-primary)]/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}