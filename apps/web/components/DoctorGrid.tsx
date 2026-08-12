"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Calendar } from "lucide-react";
import type { Doctor } from "@doctor-contract/shared";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "@/i18n/routing";
import { useDoctorSearch, useBookAppointment } from "@/lib/hooks/useDoctorSearch";

export default function DoctorGrid({ query }: { query: string }) {
  const t = useTranslations("DoctorSearch");
  const { data: doctors, isLoading } = useDoctorSearch(query);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading && (
        <p className="col-span-full text-center text-sm text-gray-500">...</p>
      )}

      {!isLoading && doctors?.length === 0 && (
        <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">{t("noResults")}</p>
        </div>
      )}

      {doctors?.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}

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
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {doctor.experience != null && (
        <span className="absolute left-0 top-4 rounded-r-full bg-[var(--color-secondary)] py-1 pl-3 pr-4 text-xs font-bold text-white shadow-sm">
          {doctor.experience} {t("experienceShort")}
        </span>
      )}

      <div className="flex flex-col gap-4 p-6 pt-12">
        <div className="flex items-start gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-bg-soft)] text-lg font-bold text-[var(--color-primary)]">
            {initials(doctor.user.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold text-[var(--color-primary-dark)]">
              {doctor.user.name}
            </p>
            {doctor.qualification && (
              <p className="truncate text-sm font-semibold text-gray-700">
                {doctor.qualification}
              </p>
            )}
            {doctor.specialization && (
              <p className="truncate text-sm text-gray-500">{doctor.specialization}</p>
            )}
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[var(--color-bg-soft)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
          <MapPin className="h-3 w-3" />
          {doctor.clinic.city ?? doctor.clinic.clinicName}
        </span>

        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
          {doctor.fee != null ? (
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              {t("consultationFee")}: Rs. {doctor.fee}
            </p>
          ) : (
            <span />
          )}
          <button
            onClick={handleBookClick}
            className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--color-primary-dark)]"
          >
            {t("bookButton")}
          </button>
        </div>

        {showBooking && user && (
          <div className="flex flex-wrap items-center gap-3 border-t border-gray-50 pt-4">
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
    </div>
  );
}