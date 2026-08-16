"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("Theme");

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={t("toggleLabel")}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-soft-100 hover:text-[var(--color-primary-text)]"
    >
      {/* CSS-only icon swap avoids any hydration mismatch */}
      <Sun className="hidden h-4 w-4 dark:block" />
      <Moon className="h-4 w-4 dark:hidden" />
    </button>
  );
}
