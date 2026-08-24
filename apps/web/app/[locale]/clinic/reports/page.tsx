"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  CalendarDays,
  Users,
  IndianRupee,
  Stethoscope,
  CheckCircle2,
  XCircle,
  UserX,
  Loader2,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Award,
  Activity,
} from "lucide-react";

import {
  usePeriodReport,
  useDownloadReport,
  useDailyDashboard,
  useGrowthReport,
  type Period,
} from "@/lib/hooks/useReports";

const today = new Date().toISOString().split("T")[0];

// ============================================================
// GRADIENT BORDER CARD COMPONENT
// ============================================================

function GradientCard({
  children,
  className = "",
  gradient = "from-[#667eea] via-[#764ba2] to-[#f093fb]",
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

export default function ClinicReportsPage() {
  const t = useTranslations("ClinicReports");

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER - Gradient Border
      ====================================================== */}
      <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]">
        <div className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30">
              <BarChart3 className="h-4 w-4" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-[#1e40af]">
              {t("tagline")}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#059669] to-[#10b981] px-2 py-0.5 text-[9px] font-bold text-white">
              <Sparkles className="h-3 w-3" />
              Analytics
            </span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {t("heading")}
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            {t("subtitle")}
          </p>
        </div>
      </GradientCard>

      <PeriodReportCard />

      <GrowthCard />
    </div>
  );
}

/* ============================================================
   PERIOD REPORT - Gradient Border
============================================================ */

function PeriodReportCard() {
  const t = useTranslations("ClinicReports");
  const tStatus = useTranslations("Status");

  const PERIODS: {
    value: Period;
    labelKey: "daily" | "weekly" | "monthly" | "yearly" | "custom";
  }[] = [
    { value: "daily", labelKey: "daily" },
    { value: "weekly", labelKey: "weekly" },
    { value: "monthly", labelKey: "monthly" },
    { value: "yearly", labelKey: "yearly" },
    { value: "custom", labelKey: "custom" },
  ];

  const [period, setPeriod] = useState<Period>("daily");
  const [date, setDate] = useState(today);
  const [month, setMonth] = useState(today.slice(0, 7));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const periodReport = usePeriodReport();
  const download = useDownloadReport();

  const dashboardDate = period === "daily" ? date : undefined;
  const { data: dashboard } = useDailyDashboard(dashboardDate);

  function currentParams() {
    if (period === "daily") {
      return { period, date };
    }
    if (period === "monthly") {
      return { period, month };
    }
    if (period === "yearly") {
      return { period, year };
    }
    if (period === "custom") {
      return { period, startDate, endDate };
    }
    return { period, date };
  }

  function handleFetch() {
    periodReport.mutate(currentParams());
  }

  function handleDownload(format: "pdf" | "excel") {
    download.mutate({
      ...currentParams(),
      format,
    });
  }

  const report = periodReport.data;

  return (
    <GradientCard gradient="from-[#667eea] via-[#764ba2] to-[#f093fb]">
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg shadow-purple-500/30">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {t("patientReportTitle")}
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {t("patientReportSub")}
              </p>
            </div>
          </div>

          {report && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownload("pdf")}
                disabled={download.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#f5576c] to-[#fda085] px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-pink-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
              >
                {download.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileText className="h-3.5 w-3.5" />
                )}
                PDF
              </button>

              <button
                type="button"
                onClick={() => handleDownload("excel")}
                disabled={download.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#059669] to-[#10b981] px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-green-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
              >
                {download.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                )}
                Excel
              </button>
            </div>
          )}
        </div>

        {/* Period selector */}
        <div className="mt-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t("reportPeriod")}
          </p>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPeriod(p.value)}
                className={
                  period === p.value
                    ? "rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/30 transition"
                    : "rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:border-[#1e40af]/30 hover:bg-[#1e40af]/5"
                }
              >
                {t(p.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Date controls */}
        <div className="mt-4 rounded-lg border border-[#1e40af]/10 bg-gradient-to-r from-[#1e40af]/5 to-transparent p-3.5">
          <div className="flex flex-wrap items-end gap-3">
            {(period === "daily" || period === "weekly") && (
              <Field
                label={
                  period === "weekly" ? t("weekDateLabel") : t("dateLabel")
                }
              >
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
                />
              </Field>
            )}

            {period === "monthly" && (
              <Field label={t("monthLabel")}>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
                />
              </Field>
            )}

            {period === "yearly" && (
              <Field label={t("yearLabel")}>
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 w-28"
                />
              </Field>
            )}

            {period === "custom" && (
              <>
                <Field label={t("startDateLabel")}>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
                  />
                </Field>

                <Field label={t("endDateLabel")}>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
                  />
                </Field>
              </>
            )}

            <button
              type="button"
              onClick={handleFetch}
              disabled={periodReport.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {periodReport.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {periodReport.isPending ? t("loading") : t("viewReportBtn")}
            </button>
          </div>
        </div>

        {/* Report Results */}
        {report && (
          <div className="mt-6 space-y-6 border-t border-slate-100 pt-5">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ReportStat
                icon={Users}
                label={t("totalAppointments")}
                value={report.totalAppointments}
              />

              <ReportStat
                icon={IndianRupee}
                label={t("estimatedRevenue")}
                value={`₹${report.estimatedRevenue}`}
              />

              {period === "daily" && dashboard && (
                <>
                  <ReportStat
                    icon={Users}
                    label={t("newPatients")}
                    value={dashboard.newPatients}
                  />

                  <ReportStat
                    icon={CheckCircle2}
                    label={t("returningPatients")}
                    value={dashboard.returningPatients}
                  />
                </>
              )}
            </div>

            {/* Status */}
            <div>
              <SectionTitle>{t("statusBreakdown")}</SectionTitle>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.entries(report.byStatus).map(([status, count]) => (
                  <StatusCard
                    key={status}
                    status={status}
                    count={count}
                    tStatus={tStatus}
                    t={t}
                  />
                ))}
              </div>
            </div>

            {/* Doctor breakdown */}
            <div>
              <SectionTitle>{t("doctorWiseBreakdown")}</SectionTitle>

              <div className="overflow-hidden rounded-lg border border-slate-200 divide-y divide-slate-100">
                {Object.entries(report.byDoctor).map(
                  ([doctorName, doctor]) => (
                    <div
                      key={doctorName}
                      className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between hover:bg-[#1e40af]/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-md shadow-blue-500/30">
                          <Stethoscope className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {doctorName}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {doctor.totalAppointments} {t("appointmentsShort")}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                        <span className="rounded-md bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-2.5 py-1 text-white shadow-md shadow-blue-500/30">
                          {doctor.totalAppointments} {t("totalAppointments")}
                        </span>

                        <span className="rounded-md bg-gradient-to-r from-[#059669] to-[#10b981] px-2.5 py-1 text-white shadow-md shadow-green-500/30">
                          {doctor.completed} {tStatus("COMPLETED")}
                        </span>

                        <span className="rounded-md bg-gradient-to-r from-[#f59e0b] to-[#f97316] px-2.5 py-1 text-white shadow-md shadow-orange-500/30">
                          ₹{doctor.revenue}
                        </span>
                      </div>
                    </div>
                  )
                )}

                {Object.keys(report.byDoctor).length === 0 && (
                  <div className="p-6 text-center">
                    <Stethoscope className="mx-auto h-6 w-6 text-slate-400" />

                    <p className="mt-2 text-xs font-medium text-slate-500">
                      {t("noAppointmentsPeriod")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </GradientCard>
  );
}

/* ============================================================
   GROWTH REPORT - Gradient Border
============================================================ */

function GrowthCard() {
  const t = useTranslations("ClinicReports");

  const [granularity, setGranularity] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");

  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 6))
      .toISOString()
      .split("T")[0]
  );

  const [endDate, setEndDate] = useState(today);

  const growth = useGrowthReport();

  function handleFetch() {
    growth.mutate({
      granularity,
      startDate,
      endDate,
    });
  }

  const data = growth.data;

  return (
    <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#059669]">
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#059669] to-[#10b981] text-white shadow-lg shadow-green-500/30">
            <TrendingUp className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              {t("patientGrowthTitle")}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {t("patientGrowthSub")}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 rounded-lg border border-[#059669]/10 bg-gradient-to-r from-[#059669]/5 to-transparent p-3.5">
          <div className="flex flex-wrap items-end gap-3">
            <Field label={t("granularityLabel")}>
              <select
                value={granularity}
                onChange={(e) =>
                  setGranularity(e.target.value as typeof granularity)
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
              >
                <option value="daily">{t("daily")}</option>
                <option value="weekly">{t("weekly")}</option>
                <option value="monthly">{t("monthly")}</option>
                <option value="yearly">{t("yearly")}</option>
              </select>
            </Field>

            <Field label={t("startDateLabel")}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
              />
            </Field>

            <Field label={t("endDateLabel")}>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
              />
            </Field>

            <button
              type="button"
              onClick={handleFetch}
              disabled={growth.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#059669] to-[#10b981] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-green-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {growth.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {growth.isPending ? t("loading") : t("viewGrowthBtn")}
            </button>
          </div>
        </div>

        {/* Growth result */}
        {data && (
          <div className="mt-6 space-y-6 border-t border-slate-100 pt-5">
            {/* Summary */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <GrowthStat
                label={t("thisPeriod")}
                value={data.summary.currentPeriodPatients}
              />

              <GrowthStat
                label={t("previousPeriod")}
                value={data.summary.previousPeriodPatients}
              />

              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t("growthRate")}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  {data.summary.growthRatePercent >= 0 ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-r from-[#059669] to-[#10b981] text-white shadow-md shadow-green-500/30">
                      <TrendingUp className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-r from-[#f5576c] to-[#fda085] text-white shadow-md shadow-pink-500/30">
                      <TrendingDown className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <span
                    className={
                      "text-base font-bold " +
                      (data.summary.growthRatePercent >= 0
                        ? "text-[#059669]"
                        : "text-[#f5576c]")
                    }
                  >
                    {data.summary.growthRatePercent}%
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-slate-500">
                  {t("vsPreviousPeriod")}
                </p>
              </div>
            </div>

            {/* Trend */}
            <div>
              <SectionTitle>{t("growthTrend")}</SectionTitle>

              <div className="overflow-hidden rounded-lg border border-slate-200 divide-y divide-slate-100">
                {data.trend.map((point) => (
                  <div
                    key={point.period}
                    className="p-3.5 hover:bg-[#1e40af]/5 transition-colors"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {point.period}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {t("patientActivity")}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                        <span className="rounded-md bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-2.5 py-1 text-white shadow-md shadow-blue-500/30">
                          {point.newPatients} {t("newShort")}
                        </span>

                        <span className="rounded-md bg-gradient-to-r from-[#059669] to-[#10b981] px-2.5 py-1 text-white shadow-md shadow-green-500/30">
                          {point.returningPatients} {t("returningShort")}
                        </span>

                        <span className="rounded-md bg-gradient-to-r from-[#f59e0b] to-[#f97316] px-2.5 py-1 text-white shadow-md shadow-orange-500/30">
                          {point.totalAppointments} {t("appointmentsShort")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {data.trend.length === 0 && (
                  <div className="p-6 text-center">
                    <TrendingUp className="mx-auto h-6 w-6 text-slate-400" />

                    <p className="mt-2 text-xs font-medium text-slate-500">
                      {t("noDataRange")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </GradientCard>
  );
}

/* ============================================================
   HELPERS & SUB-COMPONENTS
============================================================ */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>

      {children}
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
      {children}
    </p>
  );
}

function ReportStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-md shadow-blue-500/30">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>

      <p className="mt-2 text-lg font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-0.5 text-[11px] text-slate-500">
        {label}
      </p>
    </div>
  );
}

function GrowthStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-lg font-bold text-slate-900">
        {value}
      </p>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6]" />
      </div>
    </div>
  );
}

function StatusCard({
  status,
  count,
  tStatus,
  t,
}: {
  status: string;
  count: number;
  tStatus: any;
  t: any;
}) {
  const isCancelled = status === "CANCELLED";
  const isAbsent = status === "ABSENT";
  const isCompleted = status === "COMPLETED";

  let icon = Users;
  let gradient = "from-[#1e3a8a] to-[#3b82f6]"; // Royal Blue
  let textClass = "text-[#1e40af]";

  if (isCancelled) {
    icon = XCircle;
    gradient = "from-[#f5576c] to-[#fda085]"; // Pink/Red
    textClass = "text-[#f5576c]";
  } else if (isAbsent) {
    icon = UserX;
    gradient = "from-[#f59e0b] to-[#f97316]"; // Amber/Orange
    textClass = "text-[#f59e0b]";
  } else if (isCompleted) {
    icon = CheckCircle2;
    gradient = "from-[#059669] to-[#10b981]"; // Leaf Green
    textClass = "text-[#059669]";
  }

  const Icon = icon;

  const displayStatus = isAbsent
    ? t("noShow")
    : tStatus.has(status)
      ? tStatus(status)
      : status;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-r ${gradient} text-white shadow-md`}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className={`truncate text-xs font-semibold ${textClass}`}>
            {displayStatus}
          </p>

          <p className="mt-0.5 text-base font-bold text-slate-900">
            {count}
          </p>
        </div>
      </div>
    </div>
  );
}