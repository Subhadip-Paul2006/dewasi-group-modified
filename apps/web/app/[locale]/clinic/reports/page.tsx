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
} from "lucide-react";

import {
  usePeriodReport,
  useDownloadReport,
  useDailyDashboard,
  useGrowthReport,
  type Period,
} from "@/lib/hooks/useReports";

const today = new Date().toISOString().split("T")[0];

export default function ClinicReportsPage() {
  const t = useTranslations("ClinicReports");

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
            <BarChart3 className="h-4 w-4" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {t("tagline")}
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          {t("heading")}
        </h1>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {t("subtitle")}
        </p>
      </div>

      <PeriodReportCard />

      <GrowthCard />
    </div>
  );
}

/* ============================================================
   PERIOD REPORT
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
    <section className="rounded-xl border border-slate-200 bg-white shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t("patientReportTitle")}
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80 shadow-xs"
              >
                {download.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileText className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                )}
                PDF
              </button>

              <button
                type="button"
                onClick={() => handleDownload("excel")}
                disabled={download.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80 shadow-xs"
              >
                {download.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
                Excel
              </button>
            </div>
          )}
        </div>

        {/* Period selector */}
        <div className="mt-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
                    ? "rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition"
                    : "rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60"
                }
              >
                {t(p.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Date controls */}
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
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
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </Field>
            )}

            {period === "monthly" && (
              <Field label={t("monthLabel")}>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 w-28"
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
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </Field>

                <Field label={t("endDateLabel")}>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </Field>
              </>
            )}

            <button
              type="button"
              onClick={handleFetch}
              disabled={periodReport.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
          <div className="mt-6 space-y-6 border-t border-slate-100 pt-5 dark:border-slate-800">
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

              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                {Object.entries(report.byDoctor).map(
                  ([doctorName, doctor]) => (
                    <div
                      key={doctorName}
                      className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <Stethoscope className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {doctorName}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            {doctor.totalAppointments} {t("appointmentsShort")}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {doctor.totalAppointments} {t("totalAppointments")}
                        </span>

                        <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50">
                          {doctor.completed} {tStatus("COMPLETED")}
                        </span>

                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50">
                          ₹{doctor.revenue}
                        </span>
                      </div>
                    </div>
                  )
                )}

                {Object.keys(report.byDoctor).length === 0 && (
                  <div className="p-6 text-center">
                    <Stethoscope className="mx-auto h-6 w-6 text-slate-400 dark:text-slate-500" />

                    <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {t("noAppointmentsPeriod")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   GROWTH REPORT
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
    <section className="rounded-xl border border-slate-200 bg-white shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <TrendingUp className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              {t("patientGrowthTitle")}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {t("patientGrowthSub")}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex flex-wrap items-end gap-3">
            <Field label={t("granularityLabel")}>
              <select
                value={granularity}
                onChange={(e) =>
                  setGranularity(e.target.value as typeof granularity)
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </Field>

            <Field label={t("endDateLabel")}>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </Field>

            <button
              type="button"
              onClick={handleFetch}
              disabled={growth.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
          <div className="mt-6 space-y-6 border-t border-slate-100 pt-5 dark:border-slate-800">
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

              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t("growthRate")}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  {data.summary.growthRatePercent >= 0 ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <TrendingUp className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                      <TrendingDown className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <span
                    className={
                      "text-base font-bold " +
                      (data.summary.growthRatePercent >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400")
                    }
                  >
                    {data.summary.growthRatePercent}%
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {t("vsPreviousPeriod")}
                </p>
              </div>
            </div>

            {/* Trend */}
            <div>
              <SectionTitle>{t("growthTrend")}</SectionTitle>

              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                {data.trend.map((point) => (
                  <div
                    key={point.period}
                    className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {point.period}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                          {t("patientActivity")}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50">
                          {point.newPatients} {t("newShort")}
                        </span>

                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {point.returningPatients} {t("returningShort")}
                        </span>

                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {point.totalAppointments} {t("appointmentsShort")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {data.trend.length === 0 && (
                  <div className="p-6 text-center">
                    <TrendingUp className="mx-auto h-6 w-6 text-slate-400 dark:text-slate-500" />

                    <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {t("noDataRange")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
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
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </span>

      {children}
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
      <div className="flex items-center justify-between gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>

      <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </p>

      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
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
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>

      <p className="mt-1.5 text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </p>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full w-2/3 rounded-full bg-blue-600" />
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tStatus: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}) {
  const isCancelled = status === "CANCELLED";
  const isAbsent = status === "ABSENT";
  const isCompleted = status === "COMPLETED";

  let icon = Users;
  let iconClass = "text-blue-600 dark:text-blue-400";
  let bgClass = "bg-blue-50 dark:bg-blue-950/40";
  let textClass = "text-blue-700 dark:text-blue-400";

  if (isCancelled) {
    icon = XCircle;
    iconClass = "text-rose-600 dark:text-rose-400";
    bgClass = "bg-rose-50 dark:bg-rose-950/40";
    textClass = "text-rose-700 dark:text-rose-400";
  } else if (isAbsent) {
    icon = UserX;
    iconClass = "text-amber-600 dark:text-amber-400";
    bgClass = "bg-amber-50 dark:bg-amber-950/40";
    textClass = "text-amber-700 dark:text-amber-400";
  } else if (isCompleted) {
    icon = CheckCircle2;
    iconClass = "text-emerald-600 dark:text-emerald-400";
    bgClass = "bg-emerald-50 dark:bg-emerald-950/40";
    textClass = "text-emerald-700 dark:text-emerald-400";
  }

  const Icon = icon;

  const displayStatus = isAbsent
    ? t("noShow")
    : tStatus.has(status)
      ? tStatus(status)
      : status;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
      <div className="flex items-center gap-3">
        <div
          className={
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md " +
            bgClass
          }
        >
          <Icon className={"h-4 w-4 " + iconClass} />
        </div>

        <div className="min-w-0">
          <p className={"truncate text-xs font-semibold " + textClass}>
            {displayStatus}
          </p>

          <p className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">
            {count}
          </p>
        </div>
      </div>
    </div>
  );
}