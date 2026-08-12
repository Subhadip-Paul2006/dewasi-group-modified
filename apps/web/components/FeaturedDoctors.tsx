"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Award } from "lucide-react";
import type { Doctor } from "@doctor-contract/shared";
import { Link } from "@/i18n/routing";
import { useDoctorSearch } from "@/lib/hooks/useDoctorSearch";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const location = doctor.clinic.city ?? doctor.clinic.clinicName;

  return (
    <Link
      href="/doctors"
      className="block h-full w-full rounded-2xl border-2 border-[var(--color-primary)] bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-center md:gap-4 md:text-left">
        <div className="relative flex h-40 w-32 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-bg-soft)] md:h-36 md:w-28">
          {doctor.experience != null && doctor.experience > 0 && (
            <span className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-white bg-[var(--color-secondary)] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <Award className="h-3 w-3" />
              {doctor.experience} Yrs Exp
            </span>
          )}
          <span className="text-2xl font-bold text-[var(--color-primary)]">
            {initials(doctor.user.name)}
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="truncate text-lg font-bold text-[var(--color-primary-dark)] md:text-xl">
            {doctor.user.name}
          </h3>
          {doctor.qualification && (
            <p className="truncate text-sm font-semibold text-gray-700">
              {doctor.qualification}
            </p>
          )}
          {doctor.specialization && (
            <p className="truncate text-sm text-gray-500">{doctor.specialization}</p>
          )}
          {location && (
            <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-lg border border-[var(--color-primary)]/20 bg-[var(--color-bg-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-primary-dark)]">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedDoctors() {
  const t = useTranslations("HomePage");
  const { data: doctors, isLoading } = useDoctorSearch("");
  const featured = (doctors ?? []).slice(0, 6);

  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || featured.length < 2) return;

    autoSlideRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
    }, 4000);

    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [isMobile, featured.length]);

  function restartAutoSlide() {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    if (!isMobile || featured.length < 2) return;
    autoSlideRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
    }, 4000);
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

  if (isLoading || featured.length === 0) return null;

  const total = featured.length;
  const prevIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--color-primary-dark)] md:text-2xl">
          {t("featuredDoctors")}
        </h2>
        <Link
          href="/doctors"
          className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          {t("viewAll")}
        </Link>
      </div>

      {/* Desktop: static row */}
      <div className="hidden gap-4 md:grid md:grid-cols-3">
        {featured.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {/* Mobile: center-focused swipe carousel */}
      <div
        className="relative h-[24rem] overflow-hidden md:hidden"
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
              className={`absolute top-0 w-[80%] max-w-[300px] transition-all duration-700 ease-out ${styles[position]}`}
            >
              <DoctorCard doctor={doctor} />
            </div>
          );
        })}

        {/* Progress dots */}
        <div className="absolute -bottom-1 left-1/2 z-40 flex -translate-x-1/2 gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                i === index
                  ? "scale-125 bg-[var(--color-primary)]"
                  : "bg-[var(--color-primary)]/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}