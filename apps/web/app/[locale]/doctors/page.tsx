"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Loader2, Pencil, X } from "lucide-react";
import DoctorGrid from "@/components/DoctorGrid";
import { useLocationCity } from "@/lib/hooks/useLocationCity";

export default function DoctorsPage() {
  const t = useTranslations("DoctorSearch");
  const { city, status, setManualCity } = useLocationCity();

  const [editingLocation, setEditingLocation] = useState(false);
  const [manualInput, setManualInput] = useState("");

  function applyManualLocation(e: React.FormEvent) {
    e.preventDefault();
    if (manualInput.trim()) {
      setManualCity(manualInput.trim());
      setEditingLocation(false);
    }
  }

  function clearLocation() {
    setManualCity("");
    setManualInput("");
    setEditingLocation(false);
  }

  function cancelEditing() {
    setEditingLocation(false);
    setManualInput("");
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <h1 className="mb-4 text-2xl font-bold text-[var(--color-primary-dark-text)]">
        {t("heading")}
      </h1>

      {/* ================= LOCATION BAR ================= */}
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-[var(--color-bg-soft)] px-4 py-3 dark:border-soft-300">
        <MapPin className="h-4 w-4 shrink-0 text-[var(--color-primary-text)]" />

        {status === "loading" && (
          <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-ink-600">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {t("locationDetecting")}
          </span>
        )}

        {status !== "loading" && !editingLocation && city && (
          <span className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-700 dark:text-ink-700">
              {t("locationShowing")} <strong className="text-[var(--color-primary-dark-text)]">{city}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setManualInput(city);
                setEditingLocation(true);
              }}
              className="flex items-center gap-1 rounded-full border border-[var(--color-primary)]/25 bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary-text)] hover:bg-[var(--color-primary)]/5 transition-colors dark:bg-surface"
            >
              <Pencil className="h-3 w-3" />
              {t("locationChange")}
            </button>
            <button
              type="button"
              onClick={clearLocation}
              className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/15"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          </span>
        )}

        {status !== "loading" && !editingLocation && !city && (
          <span className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-ink-600">
            {t("locationPrompt")}
            <button
              type="button"
              onClick={() => setEditingLocation(true)}
              className="rounded-full border border-[var(--color-primary)]/25 bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary-text)] hover:bg-[var(--color-primary)]/5 transition-colors dark:bg-surface"
            >
              {t("locationChange")}
            </button>
          </span>
        )}

        {editingLocation && (
          <form onSubmit={applyManualLocation} className="flex flex-wrap items-center gap-2 w-full">
            <input
              autoFocus
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder={t("locationInputPlaceholder") || "Enter city name..."}
              className="flex-1 min-w-[150px] rounded-full border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all dark:border-soft-300 dark:bg-surface dark:text-ink-800 dark:placeholder:text-ink-400"
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("locationApply")}
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="rounded-full border border-gray-300 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors dark:border-soft-300 dark:text-ink-600 dark:hover:bg-soft-50"
            >
              {t("cancel") || "Cancel"}
            </button>
          </form>
        )}
      </div>

      {/* ================= DOCTOR GRID ================= */}
      <DoctorGrid query="" city={city ?? undefined} />
    </main>
  );
}