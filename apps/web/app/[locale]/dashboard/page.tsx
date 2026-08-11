"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import { useMyAppointments } from "@/lib/hooks/useAppointments";
import { Link } from "@/i18n/routing";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  WAITING: "bg-amber-50 text-amber-700 border-amber-200",
  CHECKED_IN: "bg-blue-50 text-blue-700 border-blue-200",
  ABSENT: "bg-gray-100 text-gray-600 border-gray-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABEL_KEYS: Record<string, string> = {
  WAITING: "statusWaiting",
  CHECKED_IN: "statusCheckedIn",
  ABSENT: "statusAbsent",
  COMPLETED: "statusCompleted",
  CANCELLED: "statusCancelled",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const t = useTranslations("Dashboard");
  const { data: appointments, isLoading } = useMyAppointments();

  const upcoming = (appointments ?? []).filter(
    (a) => a.status === "WAITING" || a.status === "CHECKED_IN"
  );
  const total = appointments?.length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-primary-dark)]">
        {t("welcome")}, {user?.name}
      </h1>
      <p className="mt-1 text-sm text-gray-500">{t("subtitle")}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-sm">
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <p className="text-2xl font-bold text-[var(--color-primary)]">{upcoming.length}</p>
          <p className="text-xs text-gray-500">{t("upcomingCount")}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <p className="text-2xl font-bold text-[var(--color-primary)]">{total}</p>
          <p className="text-xs text-gray-500">{t("totalCount")}</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">{t("myAppointments")}</h2>
        <Link
          href="/#search"
          className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
        >
          {t("findDoctorCta")}
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading && <p className="text-sm text-gray-500">{t("loadingAppointments")}</p>}

        {!isLoading && appointments?.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">{t("noAppointments")}</p>
            <Link
              href="/#search"
              className="mt-3 inline-block rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
            >
              {t("noAppointmentsCta")}
            </Link>
          </div>
        )}

        {appointments?.map((appt) => (
          <div key={appt.id} className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-800">
                  {appt.doctor?.user?.name ?? "Doctor"}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5" /> {appt.clinic?.clinicName}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-3.5 w-3.5" /> {new Date(appt.date).toLocaleDateString()}
                </p>
              </div>

              <span
                className={
                  "rounded-full border px-3 py-1 text-xs font-semibold " +
                  (STATUS_STYLES[appt.status] ?? "")
                }
              >
                {t(STATUS_LABEL_KEYS[appt.status] ?? "statusWaiting")}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-gray-50 pt-3 text-sm">
              <span className="font-medium text-[var(--color-primary)]">
                {t("token")} #{appt.token}
              </span>

              {appt.queueMode === "PRIVATE" ? (
                <span className="text-xs text-gray-400">{t("privateQueue")}</span>
              ) : (
                appt.status === "WAITING" && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="h-3.5 w-3.5" />
                    {appt.patientsAhead} {t("patientsAhead")}
                    {appt.estimatedWaitMinutes != null && (
                      <>
                        {" "}
                        <Clock className="ml-2 h-3.5 w-3.5" />
                        {t("estimatedWait")}: {appt.estimatedWaitMinutes} {t("minutes")}
                      </>
                    )}
                  </span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
