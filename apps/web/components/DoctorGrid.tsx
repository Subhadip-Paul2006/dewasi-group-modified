"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Calendar,
  Star,
  Heart,
  Clock,
  DollarSign,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import type { Doctor } from "@doctor-contract/shared";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "@/i18n/routing";
import {
  useDoctorSearch,
  useBookAppointment,
} from "@/lib/hooks/useDoctorSearch";

// ============================================================
// Doctor Grid
// ============================================================

export default function DoctorGrid({
  query,
  city,
}: {
  query: string;
  city?: string;
}) {
  const t = useTranslations("DoctorSearch");
  const { data: doctors, isLoading } = useDoctorSearch(query, city);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {/* Loading */}
      {isLoading && (
        <div className="col-span-full flex flex-col items-center justify-center py-16">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--color-primary)] border-t-transparent" />

          <p className="mt-4 text-sm font-medium text-gray-500">
            {t("loading") || "Finding the best doctors..."}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && doctors?.length === 0 && (
        <div className="col-span-full rounded-3xl border border-dashed border-gray-200 bg-gray-50/70 p-14 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <Clock className="h-7 w-7 text-gray-400" />
          </div>

          <p className="text-lg font-bold text-gray-800">
            {t("noResults")}
          </p>

          <p className="mt-1.5 text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Doctors */}
      {doctors?.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}

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
// Doctor Card
// ============================================================

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const t = useTranslations("DoctorSearch");
  const { user } = useAuth();
  const router = useRouter();

  // -----------------------------
  // State
  // -----------------------------

  const [showBooking, setShowBooking] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const bookMutation = useBookAppointment();

  // -----------------------------
  // Booking
  // -----------------------------

  function handleBookClick() {
    if (!user) {
      router.push("/login?redirect=/doctors");
      return;
    }

    setMessage(null);
    setShowBooking((v) => !v);

    if (!showBooking) {
      setDate("");
      setTime("");
    }
  }

  function handleConfirmBooking() {
    if (!date || !time) {
      setMessage({
        type: "error",
        text:
          t("pleaseSelectDateTime") ||
          "Please select date and time",
      });

      return;
    }

    const dateTime = new Date(`${date}T${time}`);

    if (dateTime < new Date()) {
      setMessage({
        type: "error",
        text:
          t("pastDateError") ||
          "Please select a future date and time",
      });

      return;
    }

    bookMutation.mutate(
      {
        doctorId: doctor.id,
        clinicId: doctor.clinicId,
        date: dateTime.toISOString(),
      },
      {
        onSuccess: (appointment) => {
          setMessage({
            type: "success",
            text: `${t("bookSuccess")} #${appointment.token}`,
          });

          setDate("");
          setTime("");

          setTimeout(() => {
            setShowBooking(false);
            setMessage(null);
          }, 5000);
        },

        onError: (error) => {
          setMessage({
            type: "error",
            text: error.message || t("bookError"),
          });
        },
      }
    );
  }

  function handleFavoriteToggle() {
    setIsFavorite(!isFavorite);
    // Add API call here later if favorites are persisted.
  }

  // -----------------------------
  // Doctor Data
  // -----------------------------

  const experienceYears = doctor.experience ?? 0;

  const experienceDisplay =
    experienceYears > 0
      ? `${experienceYears}+ ${t("experienceShort")}`
      : t("newDoctor") || "New";

  return (
    <div
      className="
        group relative overflow-hidden rounded-3xl
        border border-gray-200/80
        bg-white
        shadow-[0_2px_12px_rgba(0,0,0,0.04)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-gray-300
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.09)]
      "
      role="article"
      aria-label={`Doctor profile: ${doctor.user.name}`}
    >
      {/* =====================================================
          Top Accent
      ====================================================== */}

      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] opacity-90" />

      {/* =====================================================
          Experience Badge
      ====================================================== */}

      {experienceYears > 0 && (
        <div className="absolute left-4 top-5 z-10">
          <div
            className="
              inline-flex items-center gap-1.5
              rounded-full
              border border-white/80
              bg-white/95
              px-3 py-1.5
              text-[11px] font-bold
              text-[var(--color-secondary-dark)]
              shadow-sm
              backdrop-blur
            "
          >
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />

            <span>{experienceDisplay}</span>
          </div>
        </div>
      )}

      {/* =====================================================
          Favorite
      ====================================================== */}

      <button
        type="button"
        onClick={handleFavoriteToggle}
        className="
          absolute right-4 top-5 z-10
          flex h-9 w-9 items-center justify-center
          rounded-full
          border border-gray-100
          bg-white/95
          shadow-sm
          backdrop-blur
          transition-all duration-200
          hover:scale-105
          hover:border-gray-200
          hover:shadow-md
          active:scale-95
        "
        aria-label={
          isFavorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        <Heart
          className={`h-[17px] w-[17px] transition-colors ${
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-400 group-hover:text-gray-500"
          }`}
        />
      </button>

      {/* =====================================================
          Card Content
      ====================================================== */}

      <div className="flex flex-col p-5 pt-[4.5rem]">
        {/* ===================================================
            Doctor Profile
        ==================================================== */}

        <div className="flex items-center gap-4">
          {/* Avatar */}

          <div className="relative shrink-0">
            <div
              className="
                flex h-[68px] w-[68px]
                items-center justify-center
                rounded-2xl
                bg-gradient-to-br
                from-[var(--color-bg-soft)]
                to-[var(--color-primary)]/10
                text-lg font-bold
                text-[var(--color-primary)]
                shadow-sm
                ring-1 ring-gray-100
                transition-transform duration-300
                group-hover:scale-[1.03]
              "
            >
              {initials(doctor.user.name)}
            </div>

            {/* Online / Available */}

            <span
              className="
                absolute -bottom-1 -right-1
                flex h-5 w-5
                items-center justify-center
                rounded-full
                border-[3px] border-white
                bg-green-500
                shadow-sm
              "
            >
              <span className="sr-only">Available</span>
            </span>
          </div>

          {/* Doctor Info */}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3
                className="
                  truncate
                  text-[17px]
                  font-bold
                  tracking-[-0.01em]
                  text-[var(--color-primary-dark)]
                  transition-colors
                  group-hover:text-[var(--color-primary)]
                "
              >
                {doctor.user.name}
              </h3>

              <CheckCircle2
                className="
                  h-4 w-4 shrink-0
                  text-[var(--color-primary)]
                "
              />
            </div>

            {doctor.qualification && (
              <p className="mt-0.5 truncate text-sm font-semibold text-gray-700">
                {doctor.qualification}
              </p>
            )}

            {doctor.specialization && (
              <p className="mt-0.5 truncate text-xs font-medium text-gray-500">
                {doctor.specialization}
              </p>
            )}

            {/* Rating */}

            <div className="mt-2 inline-flex items-center gap-1.5">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="
                      h-3.5 w-3.5
                      fill-yellow-400
                      text-yellow-400
                    "
                  />
                ))}
              </div>

              <span className="text-xs font-semibold text-gray-700">
                4.5
              </span>

              <span className="text-[11px] text-gray-400">
                Excellent
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            Divider
        ==================================================== */}

        <div className="my-5 h-px bg-gray-100" />

        {/* ===================================================
            Clinic / Fee
        ==================================================== */}

        <div className="flex flex-wrap gap-2">
          {/* Location */}

          <span
            className="
              inline-flex min-w-0 max-w-full
              items-center gap-1.5
              rounded-xl
              border border-gray-100
              bg-gray-50
              px-3 py-2
              text-xs font-semibold
              text-gray-600
            "
          >
            <MapPin
              className="
                h-3.5 w-3.5 shrink-0
                text-[var(--color-primary)]
              "
            />

            <span className="truncate">
              {doctor.clinic.city ?? doctor.clinic.clinicName}
            </span>
          </span>

          {/* Fee */}

          {doctor.fee != null && (
            <span
              className="
                inline-flex items-center gap-1.5
                rounded-xl
                border border-green-100
                bg-green-50
                px-3 py-2
                text-xs font-bold
                text-green-700
              "
            >
              <DollarSign className="h-3.5 w-3.5" />

              Rs. {doctor.fee}
            </span>
          )}
        </div>

        {/* ===================================================
            Availability
        ==================================================== */}

        <div
          className="
            mt-4 flex items-center justify-between
            rounded-xl
            border border-[var(--color-primary)]/10
            bg-[var(--color-bg-soft)]/60
            px-3.5 py-3
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg
                bg-white
                shadow-sm
              "
            >
              <Clock
                className="
                  h-4 w-4
                  text-[var(--color-primary)]
                "
              />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Next available
              </p>

              <p className="mt-0.5 text-xs font-bold text-gray-700">
                Tomorrow, 10:00 AM
              </p>
            </div>
          </div>

          <span
            className="
              hidden rounded-full
              bg-green-100
              px-2.5 py-1
              text-[10px] font-bold
              text-green-700
              sm:inline-flex
            "
          >
            Available
          </span>
        </div>

        {/* ===================================================
            Action Buttons
        ==================================================== */}

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {/* View Profile */}

          <button
            type="button"
            onClick={() => router.push(`/doctors/${doctor.id}`)}
            className="
              flex items-center justify-center
              rounded-xl
              border border-gray-200
              bg-white
              px-4 py-2.5
              text-xs font-bold
              text-gray-700
              transition-all duration-200
              hover:border-[var(--color-primary)]/30
              hover:bg-[var(--color-bg-soft)]
              hover:text-[var(--color-primary)]
              active:scale-[0.98]
            "
            aria-label={`View full profile of ${doctor.user.name}`}
          >
            View Profile

            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </button>

          {/* Book */}

          <button
            type="button"
            onClick={handleBookClick}
            className="
              flex items-center justify-center
              rounded-xl
              bg-gradient-to-r
              from-[var(--color-primary)]
              to-[var(--color-primary-dark)]
              px-4 py-2.5
              text-xs font-bold
              text-white
              shadow-sm
              transition-all duration-200
              hover:-translate-y-0.5
              hover:shadow-lg
              active:translate-y-0
              active:scale-[0.98]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--color-primary)]/30
            "
            aria-label={`Book appointment with ${doctor.user.name}`}
          >
            {showBooking
              ? t("cancelBooking") || "Cancel"
              : t("bookButton")}
          </button>
        </div>

        {/* ===================================================
            Booking Section
        ==================================================== */}

        {showBooking && user && (
          <div className="animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
              {/* Booking Header */}

              <div className="mb-3">
                <p className="text-sm font-bold text-gray-800">
                  Book an appointment
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Select your preferred date and time.
                </p>
              </div>

              {/* Date + Time */}

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {/* Date */}

                <div
                  className="
                    flex items-center gap-2
                    rounded-xl
                    border border-gray-200
                    bg-white
                    px-3 py-2.5
                    transition-all
                    focus-within:border-[var(--color-primary)]
                    focus-within:ring-2
                    focus-within:ring-[var(--color-primary)]/10
                  "
                >
                  <Calendar
                    className="
                      h-4 w-4 shrink-0
                      text-[var(--color-primary)]
                    "
                  />

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setMessage(null);
                    }}
                    min={new Date()
                      .toISOString()
                      .split("T")[0]}
                    className="
                      w-full
                      bg-transparent
                      text-xs font-medium
                      text-gray-700
                      outline-none
                    "
                    aria-label="Select appointment date"
                  />
                </div>

                {/* Time */}

                <div
                  className="
                    flex items-center gap-2
                    rounded-xl
                    border border-gray-200
                    bg-white
                    px-3 py-2.5
                    transition-all
                    focus-within:border-[var(--color-primary)]
                    focus-within:ring-2
                    focus-within:ring-[var(--color-primary)]/10
                  "
                >
                  <Clock
                    className="
                      h-4 w-4 shrink-0
                      text-[var(--color-primary)]
                    "
                  />

                  <input
                    type="time"
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                      setMessage(null);
                    }}
                    min="08:00"
                    max="20:00"
                    step="1800"
                    className="
                      w-full
                      bg-transparent
                      text-xs font-medium
                      text-gray-700
                      outline-none
                    "
                    aria-label="Select appointment time"
                  />
                </div>
              </div>

              {/* Confirm */}

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={
                  !date ||
                  !time ||
                  bookMutation.isPending
                }
                className="
                  mt-3 flex w-full
                  items-center justify-center
                  rounded-xl
                  bg-gradient-to-r
                  from-[var(--color-secondary)]
                  to-[var(--color-secondary-dark)]
                  px-4 py-2.5
                  text-xs font-bold
                  text-white
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-md
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  disabled:hover:translate-y-0
                "
              >
                {bookMutation.isPending ? (
                  <>
                    <span
                      className="
                        inline-block
                        h-4 w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white
                        border-t-transparent
                      "
                    />

                    <span className="ml-2">
                      {t("bookingLoading")}
                    </span>
                  </>
                ) : (
                  t("confirmBooking")
                )}
              </button>

              {/* Message */}

              {message && (
                <div
                  className={`mt-3 rounded-xl border p-3 text-xs ${
                    message.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                  role="alert"
                >
                  <p className="flex items-start gap-2 font-medium">
                    <span>
                      {message.type === "success"
                        ? "✅"
                        : "❌"}
                    </span>

                    <span>{message.text}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}