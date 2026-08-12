"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Calendar, Star, Heart, Clock, DollarSign, ChevronRight } from "lucide-react";
import type { Doctor } from "@doctor-contract/shared";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "@/i18n/routing";
import { useDoctorSearch, useBookAppointment } from "@/lib/hooks/useDoctorSearch";

// Main Grid Component
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {isLoading && (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-500">{t("loading") || "Loading doctors..."}</p>
        </div>
      )}

      {!isLoading && doctors?.length === 0 && (
        <div className="col-span-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-700">{t("noResults")}</p>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {doctors?.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}

// Helper function for initials
function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Individual Doctor Card Component
function DoctorCard({ doctor }: { doctor: Doctor }) {
  const t = useTranslations("DoctorSearch");
  const { user } = useAuth();
  const router = useRouter();
  
  // State management
  const [showBooking, setShowBooking] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const bookMutation = useBookAppointment();

  // Handlers
  function handleBookClick() {
    if (!user) {
      router.push("/login?redirect=/doctors");
      return;
    }
    setMessage(null);
    setShowBooking((v) => !v);
    if (!showBooking) {
      // Reset form when opening
      setDate("");
      setTime("");
    }
  }

  function handleConfirmBooking() {
    if (!date || !time) {
      setMessage({ type: "error", text: t("pleaseSelectDateTime") || "Please select date and time" });
      return;
    }

    const dateTime = new Date(`${date}T${time}`);
    if (dateTime < new Date()) {
      setMessage({ type: "error", text: t("pastDateError") || "Please select a future date and time" });
      return;
    }

    bookMutation.mutate(
      { doctorId: doctor.id, clinicId: doctor.clinicId, date: dateTime.toISOString() },
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
            text: error.message || t("bookError") 
          });
        },
      }
    );
  }

  function handleFavoriteToggle() {
    setIsFavorite(!isFavorite);
    // You can add API call here to save favorites
  }

  // Format experience display
  const experienceYears = doctor.experience ?? 0;
  const experienceDisplay = experienceYears > 0 
    ? `${experienceYears}+ ${t("experienceShort")}` 
    : t("newDoctor") || "New";

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      role="article"
      aria-label={`Doctor profile: ${doctor.user.name}`}
    >
      {/* Professional Badge - Ribbon style */}
      {experienceYears > 0 && (
        <div className="absolute left-0 top-6 z-10">
          <div className="flex items-center rounded-r-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-dark)] py-1.5 pl-3 pr-5 shadow-lg">
            <Star className="mr-1.5 h-3.5 w-3.5 text-yellow-300" />
            <span className="text-xs font-bold text-white">
              {experienceDisplay}
            </span>
          </div>
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteToggle}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:shadow-lg"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart 
          className={`h-5 w-5 transition-colors ${
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
          }`}
        />
      </button>

      {/* Card Content */}
      <div className="flex flex-col gap-4 p-5 pt-16 sm:p-6 sm:pt-16">
        {/* Doctor Profile */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-bg-soft)] to-[var(--color-primary)]/10 text-xl font-bold text-[var(--color-primary)] shadow-sm ring-2 ring-white">
              {initials(doctor.user.name)}
            </div>
            {/* Online Status Indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-green-400">
              <span className="sr-only">Online</span>
            </span>
          </div>

          {/* Doctor Info */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-[var(--color-primary-dark)] group-hover:text-[var(--color-primary)] transition-colors">
              {doctor.user.name}
            </h3>
            
            {doctor.qualification && (
              <p className="truncate text-sm font-semibold text-gray-700">
                {doctor.qualification}
              </p>
            )}
            
            {doctor.specialization && (
              <p className="mt-0.5 truncate text-sm text-gray-500">
                {doctor.specialization}
              </p>
            )}

            {/* Rating Placeholder - You can add real rating data */}
            <div className="mt-1 flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= 4.5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-xs text-gray-500">(4.5)</span>
            </div>
          </div>
        </div>

        {/* Location & Details */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg-soft)] px-3 py-1.5 text-xs font-medium text-[var(--color-primary)]">
            <MapPin className="h-3.5 w-3.5" />
            {doctor.clinic.city ?? doctor.clinic.clinicName}
          </span>
          
          {doctor.fee != null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
              <DollarSign className="h-3.5 w-3.5" />
              Rs. {doctor.fee}
            </span>
          )}
        </div>

        {/* Next Available - Simulated */}
        <div className="flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
          <Clock className="h-3.5 w-3.5" />
          <span>Next available: Tomorrow, 10:00 AM</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
          {/* View Profile Button */}
          <button
            onClick={() => router.push(`/doctors/${doctor.id}`)}
            className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-700 transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary)]"
            aria-label={`View full profile of ${doctor.user.name}`}
          >
            View Profile
            <ChevronRight className="ml-1 inline h-3.5 w-3.5" />
          </button>

          {/* Book Button - Primary Action */}
          <button
            onClick={handleBookClick}
            className="flex-1 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            aria-label={`Book appointment with ${doctor.user.name}`}
          >
            {showBooking ? t("cancelBooking") || "Cancel" : t("bookButton")}
          </button>
        </div>

        {/* Booking Section - Smooth Expand */}
        {showBooking && user && (
          <div className="animate-in slide-in-from-top-2 fade-in duration-200 border-t border-gray-100 pt-4">
            <div className="space-y-3 rounded-xl bg-gray-50/80 p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Date Input */}
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
                  <Calendar className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setMessage(null);
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-transparent text-sm outline-none"
                    aria-label="Select appointment date"
                  />
                </div>

                {/* Time Input */}
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
                  <Clock className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
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
                    className="w-full bg-transparent text-sm outline-none"
                    aria-label="Select appointment time"
                  />
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmBooking}
                disabled={!date || !time || bookMutation.isPending}
                className="w-full rounded-lg bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-dark)] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {bookMutation.isPending ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    <span className="ml-2">{t("bookingLoading")}</span>
                  </>
                ) : (
                  t("confirmBooking")
                )}
              </button>

              {/* Message Display */}
              {message && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                  role="alert"
                >
                  <p className="flex items-center gap-2">
                    {message.type === "success" ? "✅" : "❌"}
                    {message.text}
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