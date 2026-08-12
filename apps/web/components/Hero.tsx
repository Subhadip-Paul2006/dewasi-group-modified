"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import DoctorGrid from "./DoctorGrid";

export default function Hero() {
  const t = useTranslations("Hero");
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setAppliedQuery(query);
  }

  return (
    <section id="search" className="bg-[var(--color-bg-soft)] px-5 py-10 md:py-14">
      <form
        onSubmit={handleSearch}
        className="mx-auto flex max-w-2xl items-center gap-3 rounded-full border-2 border-[var(--color-primary)]/20 bg-white px-6 py-3 shadow-lg shadow-blue-900/[0.06] transition-colors focus-within:border-[var(--color-primary)]"
      >
        <Search className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchUnifiedPlaceholder")}
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
        >
          <Search className="h-4 w-4" />
          {t("searchButton")}
        </button>
      </form>

      {/* Search results show here ONLY after the person actually searches.
          Before that, "Featured Doctors" below already shows a preview list —
          rendering this too would duplicate every doctor on the page. */}
      {appliedQuery && (
        <div className="mx-auto mt-8 max-w-6xl">
          <DoctorGrid query={appliedQuery} />
        </div>
      )}
    </section>
  );
}