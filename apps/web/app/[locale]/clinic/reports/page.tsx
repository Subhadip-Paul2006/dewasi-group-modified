"use client";

import { useState } from "react";
import {
  Download,
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

const PERIODS: {
  value: Period;
  label: string;
}[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "custom", label: "Custom Range" },
];

const today = new Date().toISOString().split("T")[0];

export default function ClinicReportsPage() {
  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div>
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-bg-soft)]">
            <BarChart3 className="h-4 w-4 text-[var(--color-primary)]" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Clinic Analytics
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-primary-dark)] sm:text-3xl">
          Analytics & Reports
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Understand your clinic performance, patients, revenue and growth.
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
  const [period, setPeriod] =
    useState<Period>("daily");

  const [date, setDate] = useState(today);

  const [month, setMonth] = useState(
    today.slice(0, 7)
  );

  const [year, setYear] = useState(
    String(new Date().getFullYear())
  );

  const [startDate, setStartDate] = useState(today);

  const [endDate, setEndDate] = useState(today);

  const periodReport = usePeriodReport();

  const download = useDownloadReport();

  const dashboardDate =
    period === "daily" ? date : undefined;

  const { data: dashboard } =
    useDailyDashboard(dashboardDate);

  function currentParams() {
    if (period === "daily") {
      return {
        period,
        date,
      };
    }

    if (period === "monthly") {
      return {
        period,
        month,
      };
    }

    if (period === "yearly") {
      return {
        period,
        year,
      };
    }

    if (period === "custom") {
      return {
        period,
        startDate,
        endDate,
      };
    }

    return {
      period,
      date,
    };
  }

  function handleFetch() {
    periodReport.mutate(currentParams());
  }

  function handleDownload(
    format: "pdf" | "excel"
  ) {
    download.mutate({
      ...currentParams(),
      format,
    });
  }

  const report = periodReport.data;

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      {/* Top accent */}

      <div className="h-1 bg-[var(--color-primary)]" />

      <div className="p-5 sm:p-6">
        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-bg-soft)]">
              <CalendarDays className="h-5 w-5 text-[var(--color-primary)]" />
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-800">
                Patient Report
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                View appointments and patient performance by period.
              </p>
            </div>
          </div>

          {report && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleDownload("pdf")
                }
                disabled={download.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 transition hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary)] disabled:opacity-50"
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
                onClick={() =>
                  handleDownload("excel")
                }
                disabled={download.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 transition hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary)] disabled:opacity-50"
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

        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">
            Report Period
          </p>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() =>
                  setPeriod(p.value)
                }
                className={
                  period === p.value
                    ? "rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition"
                    : "rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-primary)]"
                }
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date controls */}

        <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex flex-wrap items-end gap-3">
            {(period === "daily" ||
              period === "weekly") && (
              <Field
                label={
                  period === "weekly"
                    ? "Any date in the week"
                    : "Date"
                }
              >
                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  className="report-input"
                />
              </Field>
            )}

            {period === "monthly" && (
              <Field label="Month">
                <input
                  type="month"
                  value={month}
                  onChange={(e) =>
                    setMonth(e.target.value)
                  }
                  className="report-input"
                />
              </Field>
            )}

            {period === "yearly" && (
              <Field label="Year">
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value)
                  }
                  className="report-input w-28"
                />
              </Field>
            )}

            {period === "custom" && (
              <>
                <Field label="Start Date">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                    className="report-input"
                  />
                </Field>

                <Field label="End Date">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) =>
                      setEndDate(e.target.value)
                    }
                    className="report-input"
                  />
                </Field>
              </>
            )}

            <button
              type="button"
              onClick={handleFetch}
              disabled={periodReport.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {periodReport.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {periodReport.isPending
                ? "Loading..."
                : "View Report"}
            </button>
          </div>
        </div>

        {/* Report */}

        {report && (
          <div className="mt-6 space-y-6 border-t border-gray-100 pt-6">
            {/* Stats */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ReportStat
                icon={Users}
                label="Total Appointments"
                value={report.totalAppointments}
              />

              <ReportStat
                icon={IndianRupee}
                label="Estimated Revenue"
                value={`₹${report.estimatedRevenue}`}
              />

              {period === "daily" &&
                dashboard && (
                  <>
                    <ReportStat
                      icon={Users}
                      label="New Patients"
                      value={dashboard.newPatients}
                    />

                    <ReportStat
                      icon={CheckCircle2}
                      label="Returning Patients"
                      value={
                        dashboard.returningPatients
                      }
                    />
                  </>
                )}
            </div>

            {/* Status */}

            <div>
              <SectionTitle>
                Status Breakdown
              </SectionTitle>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Object.entries(
                  report.byStatus
                ).map(([status, count]) => (
                  <StatusCard
                    key={status}
                    status={status}
                    count={count}
                  />
                ))}
              </div>
            </div>

            {/* Doctor breakdown */}

            <div>
              <SectionTitle>
                Doctor-wise Breakdown
              </SectionTitle>

              <div className="overflow-hidden rounded-2xl border border-gray-100">
                {Object.entries(
                  report.byDoctor
                ).map(
                  ([doctorName, doctor], index) => (
                    <div
                      key={doctorName}
                      className={
                        "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between " +
                        (index > 0
                          ? "border-t border-gray-100"
                          : "")
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg-soft)]">
                          <Stethoscope className="h-4 w-4 text-[var(--color-primary)]" />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {doctorName}
                          </p>

                          <p className="mt-0.5 text-[11px] text-gray-400">
                            {doctor.totalAppointments}{" "}
                            appointments
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                        <span className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-gray-600">
                          {doctor.totalAppointments} total
                        </span>

                        <span className="rounded-lg bg-green-50 px-2.5 py-1.5 text-green-700">
                          {doctor.completed} completed
                        </span>

                        <span className="rounded-lg bg-[var(--color-bg-soft)] px-2.5 py-1.5 text-[var(--color-primary)]">
                          ₹{doctor.revenue}
                        </span>
                      </div>
                    </div>
                  )
                )}

                {Object.keys(
                  report.byDoctor
                ).length === 0 && (
                  <div className="p-8 text-center">
                    <Stethoscope className="mx-auto h-7 w-7 text-gray-300" />

                    <p className="mt-2 text-xs font-medium text-gray-400">
                      No appointments in this period.
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
  const [granularity, setGranularity] =
    useState<
      "daily" | "weekly" | "monthly" | "yearly"
    >("monthly");

  const [startDate, setStartDate] =
    useState(
      new Date(
        new Date().setMonth(
          new Date().getMonth() - 6
        )
      )
        .toISOString()
        .split("T")[0]
    );

  const [endDate, setEndDate] =
    useState(today);

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
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="h-1 bg-[var(--color-primary)]" />

      <div className="p-5 sm:p-6">
        {/* Header */}

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-bg-soft)]">
            <TrendingUp className="h-5 w-5 text-[var(--color-primary)]" />
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-800">
              Patient Growth
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Track how your patient activity changes over time.
            </p>
          </div>
        </div>

        {/* Controls */}

        <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Granularity">
              <select
                value={granularity}
                onChange={(e) =>
                  setGranularity(
                    e.target.value as typeof granularity
                  )
                }
                className="report-input"
              >
                <option value="daily">
                  Daily
                </option>

                <option value="weekly">
                  Weekly
                </option>

                <option value="monthly">
                  Monthly
                </option>

                <option value="yearly">
                  Yearly
                </option>
              </select>
            </Field>

            <Field label="Start Date">
              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="report-input"
              />
            </Field>

            <Field label="End Date">
              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                className="report-input"
              />
            </Field>

            <button
              type="button"
              onClick={handleFetch}
              disabled={growth.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {growth.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {growth.isPending
                ? "Loading..."
                : "View Growth"}
            </button>
          </div>
        </div>

        {/* Growth result */}

        {data && (
          <div className="mt-6 space-y-6 border-t border-gray-100 pt-6">
            {/* Summary */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <GrowthStat
                label="This Period"
                value={
                  data.summary
                    .currentPeriodPatients
                }
              />

              <GrowthStat
                label="Previous Period"
                value={
                  data.summary
                    .previousPeriodPatients
                }
              />

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  Growth Rate
                </p>

                <div className="mt-2 flex items-center gap-2">
                  {data.summary
                    .growthRatePercent >= 0 ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    </div>
                  )}

                  <span
                    className={
                      "text-lg font-bold " +
                      (data.summary
                        .growthRatePercent >= 0
                        ? "text-green-600"
                        : "text-red-500")
                    }
                  >
                    {data.summary.growthRatePercent}%
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-gray-400">
                  vs previous period
                </p>
              </div>
            </div>

            {/* Trend */}

            <div>
              <SectionTitle>
                Growth Trend
              </SectionTitle>

              <div className="overflow-hidden rounded-2xl border border-gray-100">
                {data.trend.map(
                  (point, index) => (
                    <div
                      key={point.period}
                      className={
                        "p-4 " +
                        (index > 0
                          ? "border-t border-gray-100"
                          : "")
                      }
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {point.period}
                          </p>

                          <p className="mt-0.5 text-[11px] text-gray-400">
                            Patient activity
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                          <span className="rounded-lg bg-[var(--color-bg-soft)] px-2.5 py-1.5 text-[var(--color-primary)]">
                            {point.newPatients} new
                          </span>

                          <span className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-gray-600">
                            {point.returningPatients} returning
                          </span>

                          <span className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-gray-600">
                            {point.totalAppointments} appointments
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {data.trend.length === 0 && (
                  <div className="p-8 text-center">
                    <TrendingUp className="mx-auto h-7 w-7 text-gray-300" />

                    <p className="mt-2 text-xs font-medium text-gray-400">
                      No data in this range.
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
   COMPONENTS
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
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
        {label}
      </span>

      {children}
    </label>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
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
    <div className="rounded-2xl border border-gray-100 bg-[var(--color-bg-soft)] p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
          <Icon className="h-4 w-4 text-[var(--color-primary)]" />
        </div>
      </div>

      <p className="mt-3 text-xl font-bold text-[var(--color-primary-dark)]">
        {value}
      </p>

      <p className="mt-0.5 text-[11px] font-medium text-gray-500">
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
    <div className="rounded-2xl border border-gray-100 bg-[var(--color-bg-soft)] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-[var(--color-primary-dark)]">
        {value}
      </p>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
        <div className="h-full w-2/3 rounded-full bg-[var(--color-primary)]" />
      </div>
    </div>
  );
}

function StatusCard({
  status,
  count,
}: {
  status: string;
  count: number;
}) {
  const isCancelled =
    status === "CANCELLED";

  const isAbsent =
    status === "ABSENT";

  const isCompleted =
    status === "COMPLETED";

  let icon = Users;
  let iconClass =
    "text-[var(--color-primary)]";
  let bgClass =
    "bg-[var(--color-bg-soft)]";
  let textClass =
    "text-[var(--color-primary)]";

  if (isCancelled) {
    icon = XCircle;
    iconClass = "text-red-500";
    bgClass = "bg-red-50";
    textClass = "text-red-600";
  } else if (isAbsent) {
    icon = UserX;
    iconClass = "text-amber-600";
    bgClass = "bg-amber-50";
    textClass = "text-amber-700";
  } else if (isCompleted) {
    icon = CheckCircle2;
    iconClass = "text-green-600";
    bgClass = "bg-green-50";
    textClass = "text-green-700";
  }

  const Icon = icon;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3.5">
      <div className="flex items-center gap-3">
        <div
          className={
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl " +
            bgClass
          }
        >
          <Icon
            className={
              "h-4 w-4 " + iconClass
            }
          />
        </div>

        <div className="min-w-0">
          <p
            className={
              "truncate text-xs font-bold " +
              textClass
            }
          >
            {isAbsent
              ? "No-show"
              : status.charAt(0) +
                status
                  .slice(1)
                  .toLowerCase()}
          </p>

          <p className="mt-0.5 text-lg font-bold text-gray-800">
            {count}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   GLOBAL INPUT STYLE
============================================================ */

<style jsx global>{`
  .report-input {
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    padding: 0.7rem 0.8rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    outline: none;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .report-input:hover {
    border-color: #d1d5db;
  }

  .report-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`}</style>