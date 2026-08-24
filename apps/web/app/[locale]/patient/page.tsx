"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import { useMyAppointments } from "@/lib/hooks/useAppointments";
import { Link } from "@/i18n/routing";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Stethoscope,
  Building2,
  Sparkles,
  TrendingUp,
  Award,
  Activity,
  ChevronRight,
  HeartPulse,
  Shield,
} from "lucide-react";

// ============================================================
// GRADIENT BORDER CARD COMPONENT
// ============================================================

function GradientCard({
  children,
  className = "",
  gradient = "from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]",
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div className={`relative rounded-2xl p-[3px] bg-gradient-to-r ${gradient} shadow-xl ${className}`}>
      <div className="rounded-[calc(1rem-2px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  WAITING: "bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white border-transparent",
  CHECKED_IN: "bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white border-transparent",
  ABSENT: "bg-gradient-to-r from-[#6b7280] to-[#9ca3af] text-white border-transparent",
  COMPLETED: "bg-gradient-to-r from-[#059669] to-[#10b981] text-white border-transparent",
  CANCELLED: "bg-gradient-to-r from-[#f5576c] to-[#fda085] text-white border-transparent",
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
  const completed = (appointments ?? []).filter((a) => a.status === "COMPLETED").length;
  const cancelled = (appointments ?? []).filter((a) => a.status === "CANCELLED").length;

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER - Gradient Border
      ====================================================== */}
      <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30">
                  <Activity className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1e40af]">
                  Dashboard
                </p>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {t("welcome")}, {user?.name}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {t("subtitle")}
              </p>
            </div>

            <Link
              href="/#search"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Stethoscope className="h-4 w-4" />
              {t("findDoctorCta")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </GradientCard>

      {/* =====================================================
          STATS CARDS
      ====================================================== */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Upcoming */}
        <GradientCard gradient="from-[#f59e0b] via-[#f97316] to-[#ef4444]">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-white shadow-lg shadow-orange-500/30">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{upcoming.length}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">{t("upcomingCount")}</p>
          </div>
        </GradientCard>

        {/* Total */}
        <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{total}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">{t("totalCount")}</p>
          </div>
        </GradientCard>

        {/* Completed */}
        <GradientCard gradient="from-[#059669] via-[#10b981] to-[#34d399]">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#059669] to-[#10b981] text-white shadow-lg shadow-green-500/30">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{completed}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">Completed</p>
          </div>
        </GradientCard>

        {/* Cancelled */}
        <GradientCard gradient="from-[#f5576c] via-[#f093fb] to-[#fda085]">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f5576c] to-[#fda085] text-white shadow-lg shadow-pink-500/30">
                <HeartPulse className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{cancelled}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">Cancelled</p>
          </div>
        </GradientCard>
      </div>

      {/* =====================================================
          APPOINTMENTS LIST
      ====================================================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-md shadow-blue-500/30">
            <Calendar className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">{t("myAppointments")}</h2>
        </div>

        {isLoading && (
          <div className="flex min-h-[200px] items-center justify-center rounded-3xl border border-slate-100 bg-slate-50/50">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#1e40af] border-t-transparent" />
              <p className="text-sm font-medium text-slate-500">{t("loadingAppointments")}</p>
            </div>
          </div>
        )}

        {!isLoading && appointments?.length === 0 && (
          <GradientCard gradient="from-[#667eea] via-[#764ba2] to-[#f093fb]">
            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg shadow-purple-500/30">
                <Calendar className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-800">{t("noAppointments")}</h3>
              <p className="mt-1 text-xs text-slate-500">{t("noAppointmentsDesc")}</p>
              <Link
                href="/#search"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Stethoscope className="h-4 w-4" />
                {t("noAppointmentsCta")}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </GradientCard>
        )}

        {appointments?.map((appt) => (
          <GradientCard 
            key={appt.id} 
            gradient="from-[#667eea] via-[#764ba2] to-[#f093fb]"
          >
            <div className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  
                  <div>
                    <p className="font-semibold text-slate-900">
                      {appt.doctor?.user?.name ?? "Doctor"}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                      <Building2 className="h-3.5 w-3.5 text-[#1e40af]" /> {appt.clinic?.clinicName}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-[#1e40af]" /> {new Date(appt.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span
                  className={
                    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-md " +
                    (STATUS_STYLES[appt.status] ?? "")
                  }
                >
                  <Sparkles className="h-3 w-3" />
                  {t(STATUS_LABEL_KEYS[appt.status] ?? "statusWaiting")}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-500/30">
                  <Award className="h-3.5 w-3.5" />
                  {t("token")} #{appt.token}
                </span>

                {appt.queueMode === "PRIVATE" ? (
                  <span className="text-xs text-slate-400">{t("privateQueue")}</span>
                ) : (
                  appt.status === "WAITING" && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Users className="h-3.5 w-3.5 text-[#1e40af]" />
                      {appt.patientsAhead} {t("patientsAhead")}
                      {appt.estimatedWaitMinutes != null && (
                        <>
                          {" "}
                          <Clock className="ml-2 h-3.5 w-3.5 text-[#f59e0b]" />
                          {t("estimatedWait")}: {appt.estimatedWaitMinutes} {t("minutes")}
                        </>
                      )}
                    </span>
                  )
                )}
              </div>
            </div>
          </GradientCard>
        ))}
      </div>
    </div>
  );
}