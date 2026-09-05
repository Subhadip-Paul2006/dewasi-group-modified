"use client";

import { Link } from "@/i18n/routing";

export default function SectionHeader({
  eyebrow,
  title,
  viewAllHref,
  viewAllLabel,
}: {
  eyebrow?: string;
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary-text)]">
            {eyebrow}
          </p>
        )}

        <h2 className="text-xl font-bold tracking-tight text-[var(--color-primary-dark-text)] md:text-2xl">
          {title}
        </h2>
      </div>

      {viewAllHref && viewAllLabel && (
        <Link
          href={viewAllHref}
          className="shrink-0 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg-soft)] px-3.5 py-2 text-xs font-bold text-[var(--color-primary-text)] transition-all hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/10"
        >
          {viewAllLabel}
        </Link>
      )}
    </div>
  );
}