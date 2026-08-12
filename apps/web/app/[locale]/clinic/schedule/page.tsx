"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  CalendarDays,
  Clock3,
  CheckCircle2,
  Loader2,
  Building2,
  CalendarOff,
} from "lucide-react";
import {
  useWorkingHours,
  useSetWorkingHours,
  useHolidays,
  useAddHoliday,
  useRemoveHoliday,
  type WorkingHour,
  type DayOfWeek,
} from "@/lib/hooks/useClinic";

const DAYS: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function defaultHours(): WorkingHour[] {
  return DAYS.map((dayOfWeek) => ({
    dayOfWeek,
    isClosed: dayOfWeek === "SUNDAY",
    openTime: "09:00",
    closeTime: "18:00",
  }));
}

function formatDay(day: DayOfWeek) {
  return day.charAt(0) + day.slice(1).toLowerCase();
}

// Premium input styling
const inputClasses =
  "rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15";

export default function ClinicSchedulePage() {
  const { data: savedHours, isLoading } = useWorkingHours();
  const setHours = useSetWorkingHours();
  const { data: holidays } = useHolidays();
  const addHoliday = useAddHoliday();
  const removeHoliday = useRemoveHoliday();

  const [hours, setLocalHours] = useState<WorkingHour[]>(defaultHours());
  const [saved, setSaved] = useState(false);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayReason, setHolidayReason] = useState("");

  useEffect(() => {
    if (savedHours && savedHours.length > 0) {
      setLocalHours(
        DAYS.map(
          (day) =>
            savedHours.find((h) => h.dayOfWeek === day) ?? {
              dayOfWeek: day,
              isClosed: true,
              openTime: null,
              closeTime: null,
            }
        )
      );
    }
  }, [savedHours]);

  function updateDay(day: DayOfWeek, patch: Partial<WorkingHour>) {
    setLocalHours((prev) =>
      prev.map((h) => (h.dayOfWeek === day ? { ...h, ...patch } : h))
    );
  }

  function handleSaveHours(e: React.FormEvent) {
    e.preventDefault();
    setHours.mutate(hours, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
        }, 3000);
      },
    });
  }

  function handleAddHoliday(e: React.FormEvent) {
    e.preventDefault();
    if (!holidayDate) return;

    addHoliday.mutate(
      {
        date: holidayDate,
        reason: holidayReason || undefined,
      },
      {
        onSuccess: () => {
          setHolidayDate("");
          setHolidayReason("");
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-bg-soft)]">
              <Building2 className="h-4 w-4 text-[var(--color-primary)]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Clinic Management
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-primary-dark)] sm:text-3xl">
            Schedule & Holidays
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Define your clinic's working hours and manage off days.
          </p>
        </div>
      </div>

      {/* =====================================================
          WORKING HOURS
      ====================================================== */}
      <form
        onSubmit={handleSaveHours}
        className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.04)]"
      >
        {/* Top border accent */}
        <div className="h-1 bg-[var(--color-primary)]" />

        <div className="p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-bg-soft)]">
              <Clock3 className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">
                Weekly Routine
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Set the opening and closing times for each day of the week.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-gray-100 bg-gray-50/50">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[var(--color-primary)] border-t-transparent" />
                <p className="text-sm font-medium text-gray-500">
                  Loading schedule...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {hours.map((h) => (
                <div
                  key={h.dayOfWeek}
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${
                    h.isClosed
                      ? "border-gray-100 bg-gray-50/70 opacity-80"
                      : "border-gray-200 bg-white shadow-sm hover:border-[var(--color-primary)]/30 hover:shadow-md"
                  }`}
                >
                  {/* Left accent bar if open */}
                  {!h.isClosed && (
                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-[var(--color-primary)]" />
                  )}

                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:pl-5">
                    {/* Day Info */}
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          h.isClosed
                            ? "bg-gray-200 text-gray-400"
                            : "bg-[var(--color-bg-soft)] text-[var(--color-primary)]"
                        }`}
                      >
                        <CalendarDays className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-sm font-bold ${
                            h.isClosed
                              ? "text-gray-500"
                              : "text-[var(--color-primary-dark)]"
                          }`}
                        >
                          {formatDay(h.dayOfWeek)}
                        </p>
                        <p
                          className={`mt-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            h.isClosed ? "text-gray-400" : "text-green-600"
                          }`}
                        >
                          {h.isClosed ? "Closed" : "Open"}
                        </p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                      {/* Premium Toggle Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={!h.isClosed}
                        onClick={() =>
                          updateDay(h.dayOfWeek, { isClosed: !h.isClosed })
                        }
                        className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
                          !h.isClosed ? "bg-[var(--color-primary)]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            !h.isClosed ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>

                      {/* Time Inputs */}
                      {!h.isClosed && (
                        <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/80 p-1.5">
                          <input
                            type="time"
                            value={h.openTime ?? "09:00"}
                            onChange={(e) =>
                              updateDay(h.dayOfWeek, {
                                openTime: e.target.value,
                              })
                            }
                            className={`${inputClasses} w-[110px] border-none !bg-white !py-2 !px-3 shadow-sm`}
                          />
                          <span className="text-xs font-bold text-gray-400">
                            to
                          </span>
                          <input
                            type="time"
                            value={h.closeTime ?? "18:00"}
                            onChange={(e) =>
                              updateDay(h.dayOfWeek, {
                                closeTime: e.target.value,
                              })
                            }
                            className={`${inputClasses} w-[110px] border-none !bg-white !py-2 !px-3 shadow-sm`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={setHours.isPending || isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {setHours.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {setHours.isPending ? "Saving..." : "Save Weekly Routine"}
            </button>

            {saved && (
              <div className="flex items-center gap-1.5 rounded-xl bg-green-50 px-4 py-3 text-xs font-bold text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Working hours updated successfully.
              </div>
            )}
          </div>
        </div>
      </form>

      {/* =====================================================
          HOLIDAYS
      ====================================================== */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
        <div className="h-1 bg-gradient-to-r from-red-400 to-rose-400" />

        <div className="p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
              <CalendarOff className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">
                Special Holidays
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Block off specific dates when the entire clinic will be closed.
              </p>
            </div>
          </div>

          {/* Add Holiday */}
          <form
            onSubmit={handleAddHoliday}
            className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_1fr_auto] sm:items-end">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-gray-600">
                  Select Date
                </span>
                <input
                  type="date"
                  required
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  className={`${inputClasses} w-full`}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-gray-600">
                  Reason / Occasion
                  <span className="ml-1 font-medium text-gray-400">
                    (optional)
                  </span>
                </span>
                <input
                  type="text"
                  value={holidayReason}
                  onChange={(e) => setHolidayReason(e.target.value)}
                  className={`${inputClasses} w-full`}
                  placeholder="e.g. Independence Day, Maintenance"
                />
              </label>

              <button
                type="submit"
                disabled={addHoliday.isPending}
                className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gray-800 px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addHoliday.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {addHoliday.isPending ? "Adding..." : "Add Holiday"}
              </button>
            </div>
          </form>

          {/* Holiday List */}
          <div className="mt-6">
            {(holidays ?? []).length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 shadow-sm">
                  <CalendarDays className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-gray-800">
                  No upcoming holidays
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Your clinic is scheduled to run on its regular weekly routine.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {holidays?.map((holiday) => {
                  const dateObj = new Date(holiday.date);
                  const month = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                  });
                  const day = dateObj.toLocaleDateString("en-US", {
                    day: "2-digit",
                  });
                  const year = dateObj.toLocaleDateString("en-US", {
                    year: "numeric",
                  });

                  return (
                    <div
                      key={holiday.id}
                      className="group flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-gray-200 hover:shadow-md"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {/* Mini Calendar Badge */}
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                          <span className="text-[10px] font-bold uppercase leading-none">
                            {month}
                          </span>
                          <span className="mt-0.5 text-lg font-black leading-none tracking-tight">
                            {day}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800">
                            {holiday.reason || "Clinic Closed"}
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-gray-400">
                            {year}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeHoliday.mutate(holiday.id)}
                        disabled={removeHoliday.isPending}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-400 opacity-0 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 disabled:opacity-50"
                        aria-label="Remove holiday"
                      >
                        {removeHoliday.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}