"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
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
        DAYS.map((day) => savedHours.find((h) => h.dayOfWeek === day) ?? {
          dayOfWeek: day,
          isClosed: true,
          openTime: null,
          closeTime: null,
        })
      );
    }
  }, [savedHours]);

  function updateDay(day: DayOfWeek, patch: Partial<WorkingHour>) {
    setLocalHours((prev) => prev.map((h) => (h.dayOfWeek === day ? { ...h, ...patch } : h)));
  }

  function handleSaveHours(e: React.FormEvent) {
    e.preventDefault();
    setHours.mutate(hours, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  }

  function handleAddHoliday(e: React.FormEvent) {
    e.preventDefault();
    if (!holidayDate) return;
    addHoliday.mutate(
      { date: holidayDate, reason: holidayReason || undefined },
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
      <h1 className="text-2xl font-bold text-[var(--color-primary-dark)]">Schedule</h1>

      {/* Working hours */}
      <form
        onSubmit={handleSaveHours}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
      >
        <p className="mb-4 text-sm font-bold text-gray-800">Working Hours</p>

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-2.5">
            {hours.map((h) => (
              <div
                key={h.dayOfWeek}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 px-3 py-2.5"
              >
                <span className="w-24 shrink-0 text-sm font-semibold text-gray-700">
                  {h.dayOfWeek[0] + h.dayOfWeek.slice(1).toLowerCase()}
                </span>

                <label className="flex items-center gap-1.5 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={h.isClosed}
                    onChange={(e) => updateDay(h.dayOfWeek, { isClosed: e.target.checked })}
                  />
                  Closed
                </label>

                {!h.isClosed && (
                  <>
                    <input
                      type="time"
                      value={h.openTime ?? "09:00"}
                      onChange={(e) => updateDay(h.dayOfWeek, { openTime: e.target.value })}
                      className="input w-28"
                    />
                    <span className="text-xs text-gray-400">to</span>
                    <input
                      type="time"
                      value={h.closeTime ?? "18:00"}
                      onChange={(e) => updateDay(h.dayOfWeek, { closeTime: e.target.value })}
                      className="input w-28"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={setHours.isPending}
          className="mt-4 rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {setHours.isPending ? "Saving..." : "Save Working Hours"}
        </button>
        {saved && <p className="mt-2 text-sm text-green-600">Working hours updated.</p>}
      </form>

      {/* Holidays */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-bold text-gray-800">Holidays</p>

        <form onSubmit={handleAddHoliday} className="flex flex-wrap items-end gap-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">Date</span>
            <input
              type="date"
              required
              value={holidayDate}
              onChange={(e) => setHolidayDate(e.target.value)}
              className="input"
            />
          </label>
          <label className="block flex-1 min-w-[150px]">
            <span className="mb-1 block text-xs font-semibold text-gray-600">Reason (optional)</span>
            <input
              value={holidayReason}
              onChange={(e) => setHolidayReason(e.target.value)}
              className="input"
            />
          </label>
          <button
            type="submit"
            disabled={addHoliday.isPending}
            className="flex items-center gap-1 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </form>

        <div className="mt-4 space-y-2">
          {(holidays ?? []).length === 0 && (
            <p className="text-sm text-gray-400">No holidays added.</p>
          )}
          {holidays?.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2"
            >
              <span className="text-sm text-gray-700">
                {new Date(h.date).toLocaleDateString()} {h.reason ? "· " + h.reason : ""}
              </span>
              <button
                type="button"
                onClick={() => removeHoliday.mutate(h.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

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