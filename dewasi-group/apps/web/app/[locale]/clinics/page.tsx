"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import ClinicGrid from "@/components/ClinicGrid";

export default function ClinicsPage() {
  const t = useTranslations("ClinicSearch");
  const [query, setQuery] = useState("");

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <h1 className="mb-4 text-2xl font-bold text-[var(--color-primary-dark-text)]">
        {t("heading")}
      </h1>

      {/* ================= SEARCH BAR ================= */}
      <div className="mb-6 flex items-center gap-2 rounded-full border-2 border-[var(--color-primary)]/20 bg-white px-4 py-2.5 shadow-sm transition-colors focus-within:border-[var(--color-primary)] dark:bg-surface">
        <Search className="h-4 w-4 shrink-0 text-[var(--color-primary-text)]" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder") || "Search clinics by name or city..."}
          className="w-full min-w-0 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-ink-800 dark:placeholder:text-ink-400"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="flex shrink-0 items-center justify-center rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-soft-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ================= CLINIC GRID ================= */}
      <ClinicGrid query={query} />
    </main>
  );
}