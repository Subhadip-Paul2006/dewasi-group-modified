"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

const locales = [
  { code: "bn", label: "Bangla" },
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(code: string) {
    router.replace(pathname, { locale: code });
  }

  return (
    <div className="flex gap-2">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => switchTo(l.code)}
          className={
            "rounded px-3 py-1 text-sm transition " +
            (locale === l.code
              ? "bg-[var(--color-primary)] text-white"
              : "border border-gray-300 text-gray-600")
          }
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
