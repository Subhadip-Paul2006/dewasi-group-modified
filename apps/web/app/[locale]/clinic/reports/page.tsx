"use client";

import { useState } from "react";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import {
  usePeriodReport,
  useDownloadReport,
  useDailyDashboard,
  useGrowthReport,
  type Period,
} from "@/lib/hooks/useReports";

const PERIODS: { value: Period; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "custom", label: "Custom Range" },
];

const today = new Date().toISOString().split("T")[0];

export default function ClinicReportsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[var(--color-primary-dark)]">
        Analytics &amp; Reports
      </h1>

      {/* Reports 1-10: New / Returning / Doctor-wise all live inside this one card,
          since the backend returns them together per period. */}
      <PeriodReportCard />

      <GrowthCard />
    </div>
  );
}

// ---------------- Daily / Weekly / Monthly / Yearly / Custom + breakdowns ----------------

function PeriodReportCard() {
  const [period, setPeriod] = useState<Period>("daily");
  const [date, setDate] = useState(today);
  const [month, setMonth] = useState(today.slice(0, 7));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const periodReport = usePeriodReport();
  const download = useDownloadReport();

  // New/Returning patient counts for a single date come from the daily dashboard
  const dashboardDate = period === "daily" ? date : undefined;
  const { data: dashboard } = useDailyDashboard(dashboardDate);

  function currentParams() {
    if (period === "daily") return { period, date };
    if (period === "monthly") return { period, month };
    if (period === "yearly") return { period, year };
    if (period === "custom") return { period, startDate, endDate };
    return { period, date }; // weekly uses `date` to find the containing week
  }

  function handleFetch() {
    periodReport.mutate(currentParams());
  }

  function handleDownload(format: "pdf" | "excel") {
    download.mutate({ ...currentParams(), format });
  }

  const report = periodReport.data;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="mb-4 text-sm font-bold text-gray-800">Patient Report by Period</p>

      {/* Period tabs */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPeriod(p.value)}
            className={
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors " +
              (period === p.value
                ? "bg-[var(--color-primary)] text-white"
                : "border border-gray-200 text-gray-600 hover:border-[var(--color-primary)]/30")
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Date inputs per period */}
      <div className="mt-4 flex flex-wrap items-end gap-3">
        {(period === "daily" || period === "weekly") && (
          <Field label={period === "weekly" ? "Any date in the week" : "Date"}>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
          </Field>
        )}
        {period === "monthly" && (
          <Field label="Month">
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="input" />
          </Field>
        )}
        {period === "yearly" && (
          <Field label="Year">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="input w-28"
            />
          </Field>
        )}
        {period === "custom" && (
          <>
            <Field label="Start Date">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="End Date">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input"
              />
            </Field>
          </>
        )}

        <button
          type="button"
          onClick={handleFetch}
          disabled={periodReport.isPending}
          className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {periodReport.isPending ? "Loading..." : "View Report"}
        </button>

        {report && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDownload("pdf")}
              disabled={download.isPending}
              className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:border-[var(--color-primary)]/30"
            >
              <Download className="h-3.5 w-3.5" />
              PDF
            </button>
            <button
              type="button"
              onClick={() => handleDownload("excel")}
              disabled={download.isPending}
              className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:border-[var(--color-primary)]/30"
            >
              <Download className="h-3.5 w-3.5" />
              Excel
            </button>
          </div>
        )}
      </div>

      {report && (
        <div className="mt-6 space-y-5 border-t border-gray-50 pt-5">
          {/* Top stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Total Appointments" value={report.totalAppointments} />
            <Stat label="Est. Revenue" value={"₹" + report.estimatedRevenue} />
            {period === "daily" && dashboard && (
              <>
                <Stat label="New Patients" value={dashboard.newPatients} />
                <Stat label="Returning Patients" value={dashboard.returningPatients} />
              </>
            )}
          </div>

          {/* Status breakdown -> covers Cancellation Report + No-show Report */}
          <div>
            <p className="mb-2 text-xs font-semibold text-gray-600">Status Breakdown</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(report.byStatus).map(([status, count]) => (
                <span
                  key={status}
                  className={
                    "rounded-full px-3 py-1 text-xs font-medium " +
                    (status === "CANCELLED"
                      ? "bg-red-50 text-red-600"
                      : status === "ABSENT"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-[var(--color-bg-soft)] text-[var(--color-primary)]")
                  }
                >
                  {status === "ABSENT" ? "No-show" : status}: {count}
                </span>
              ))}
            </div>
          </div>

          {/* Doctor-wise breakdown -> Doctor-wise Patient Report */}
          <div>
            <p className="mb-2 text-xs font-semibold text-gray-600">Doctor-wise Breakdown</p>
            <div className="space-y-1.5">
              {Object.entries(report.byDoctor).map(([doctorName, d]) => (
                <div
                  key={doctorName}
                  className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-gray-800">{doctorName}</span>
                  <span className="text-xs text-gray-500">
                    {d.totalAppointments} total · {d.completed} completed · ₹{d.revenue}
                  </span>
                </div>
              ))}
              {Object.keys(report.byDoctor).length === 0 && (
                <p className="text-xs text-gray-400">No appointments in this period.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- Growth trend (Patient Growth Report) ----------------

function GrowthCard() {
  const [granularity, setGranularity] = useState<"daily" | "weekly" | "monthly" | "yearly">(
    "monthly"
  );
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(today);

  const growth = useGrowthReport();

  function handleFetch() {
    growth.mutate({ granularity, startDate, endDate });
  }

  const data = growth.data;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="mb-4 text-sm font-bold text-gray-800">Patient Growth Report</p>

      <div className="flex flex-wrap items-end gap-3">
        <Field label="Granularity">
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as typeof granularity)}
            className="input"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </Field>
        <Field label="Start Date">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="End Date">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input"
          />
        </Field>
        <button
          type="button"
          onClick={handleFetch}
          disabled={growth.isPending}
          className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {growth.isPending ? "Loading..." : "View Growth"}
        </button>
      </div>

      {data && (
        <div className="mt-6 space-y-4 border-t border-gray-50 pt-5">
          <div className="flex flex-wrap items-center gap-4">
            <Stat label="This Period" value={data.summary.currentPeriodPatients} />
            <Stat label="Previous Period" value={data.summary.previousPeriodPatients} />
            <div className="flex items-center gap-1.5">
              {data.summary.growthRatePercent >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  "text-sm font-bold " +
                  (data.summary.growthRatePercent >= 0 ? "text-green-600" : "text-red-500")
                }
              >
                {data.summary.growthRatePercent}% vs previous period
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            {data.trend.map((point) => (
              <div
                key={point.period}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2 text-sm"
              >
                <span className="font-medium text-gray-800">{point.period}</span>
                <span className="text-xs text-gray-500">
                  {point.newPatients} new · {point.returningPatients} returning ·{" "}
                  {point.totalAppointments} appointments
                </span>
              </div>
            ))}
            {data.trend.length === 0 && (
              <p className="text-xs text-gray-400">No data in this range.</p>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .input {
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-[var(--color-bg-soft)] px-4 py-3">
      <p className="text-lg font-bold text-[var(--color-primary-dark)]">{value}</p>
      <p className="text-xs font-medium text-gray-500">{label}</p>
    </div>
  );
}