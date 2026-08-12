"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, MapPin, Stethoscope, Calendar, User } from "lucide-react";
import type { Doctor } from "@doctor-contract/shared";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "@/i18n/routing";
import { useDoctorSearch, useBookAppointment } from "@/lib/hooks/useDoctorSearch";

export default function DoctorSearchPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("DoctorSearch");
  const hero = useTranslations("Hero");

  const [doctorName, setDoctorName] = useState(searchParams.get("doctorName") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [appliedFilters, setAppliedFilters] = useState({
    doctorName: searchParams.get("doctorName") ?? "",
    city: searchParams.get("city") ?? "",
  });

  const { data: doctors, isLoading } = useDoctorSearch(appliedFilters);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setAppliedFilters({ doctorName, city });
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm md:flex-row"
      >
        <div className="flex flex-1 items-center gap-2 rounded-xl px-4 py-3">
          <Stethoscope className="h-5 w-5 text-[var(--color-primary)]" />
          <input
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            placeholder={hero("searchDoctorPlaceholder")}
            className="w-full text-sm outline-none placeholder:text-gray-400"
          />
        </div>
        <div className="hidden w-px bg-gray-100 md:block" />
        <div className="flex flex-1 items-center gap-2 rounded-xl px-4 py-3">
          <MapPin className="h-5 w-5 text-[var(--color-primary)]" />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={hero("searchLocationPlaceholder")}
            className="w-full text-sm outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
        >
          <Search className="h-4 w-4" />
          {hero("searchButton")}
        </button>
      </form>

      <h1 className="mt-8 text-xl font-bold text-[var(--color-primary-dark)]">{t("heading")}</h1>

      <div className="mt-4 space-y-4">
        {isLoading && <p className="text-sm text-gray-500">...</p>}

        {!isLoading && doctors?.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">{t("noResults")}</p>
          </div>
        )}

        {doctors?.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const t = useTranslations("DoctorSearch");
  const { user } = useAuth();
  const router = useRouter();
  const [showBooking, setShowBooking] = useState(false);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const bookMutation = useBookAppointment();

  function handleBookClick() {
    if (!user) {
      router.push("/login");
      return;
    }
    setShowBooking((v) => !v);
  }

  function handleConfirm() {
    if (!date) return;
    bookMutation.mutate(
      { doctorId: doctor.id, clinicId: doctor.clinicId, date },
      {
        onSuccess: (appointment) => {
          setMessage({
            type: "success",
            text: t("bookSuccess") + " #" + appointment.token,
          });
        },
        onError: () => {
          setMessage({ type: "error", text: t("bookError") });
        },
      }
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-secondary-light)]">
            <User className="h-5 w-5 text-[var(--color-primary)]" />
          </span>
          <div>
            <p className="font-semibold text-gray-800">{doctor.user.name}</p>
            <p className="text-sm text-gray-500">
              {doctor.specialization ?? doctor.qualification ?? ""}
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" /> {doctor.clinic.clinicName}
              {doctor.clinic.city ? ", " + doctor.clinic.city : ""}
            </p>
            {doctor.experience != null && (
              <p className="mt-0.5 text-xs text-gray-400">
                {doctor.experience} {t("experience")}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          {doctor.fee != null && (
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              {t("consultationFee")}: Rs. {doctor.fee}
            </p>
          )}
          <button
            onClick={handleBookClick}
            className="mt-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
          >
            {t("bookButton")}
          </button>
        </div>
      </div>

      {showBooking && user && (
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-50 pt-4">
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
            <Calendar className="h-4 w-4 text-[var(--color-primary)]" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm outline-none"
            />
          </div>
          <button
            onClick={handleConfirm}
            disabled={!date || bookMutation.isPending}
            className="rounded-lg bg-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {bookMutation.isPending ? t("bookingLoading") : t("confirmBooking")}
          </button>
          {message && (
            <span
              className={
                "text-sm " + (message.type === "success" ? "text-green-600" : "text-red-600")
              }
            >
              {message.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
