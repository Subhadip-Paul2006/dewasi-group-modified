"use client";

import { Link } from "@/i18n/routing";
import { Stethoscope, Phone, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Navbar");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-white px-5 py-10 dark:border-soft-300 dark:bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]">
              <Stethoscope className="h-4 w-4 text-white" />
            </span>
            <span className="font-bold text-[var(--color-primary-dark-text)]">Doctor Contact</span>
          </div>
          <p className="mt-3 text-sm text-gray-500 dark:text-ink-500">{t("tagline")}</p>
        </div>

        <FooterCol title={t("platformHeading")} links={[nav("findDoctor"), nav("forClinics"), nav("howItWorks")]} />
        <FooterCol
          title={t("companyHeading")}
          links={[t("aboutUs"), t("contract"), t("privacyPolicy"), t("termsConditions")]}
        />

        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-ink-800">{t("helpHeading")}</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-ink-500">
            <li>
              <a href="mailto:support@doctorcontract.in" className="hover:text-[var(--color-primary-text)]">
                support@doctorcontract.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center gap-3 border-t border-gray-100 pt-6 text-xs text-gray-400 sm:flex-row sm:justify-between dark:border-soft-100 dark:text-ink-400">
        <span>&copy; {year} Doctor Contact. All rights reserved.</span>

        <span className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-3">
          <span>
            Developed by{" "}
            <a
              href="https://soumyachatterjee.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-500 underline decoration-dotted underline-offset-2 hover:text-[var(--color-primary-text)] dark:text-ink-500 dark:hover:text-[var(--color-primary-text)]"
            >
              Soumya Chatterjee
            </a>
          </span>
          <span className="flex items-center gap-2">
            <a
              href="tel:+916296398479"
              className="flex items-center gap-1 hover:text-[var(--color-primary-text)]"
            >
              <Phone className="h-3.5 w-3.5" />
              +91 62963 98479
            </a>
            <a
              href="https://wa.me/916296398479"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          </span>
        </span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-ink-800">{title}</h4>
      <ul className="space-y-2 text-sm text-gray-500 dark:text-ink-500">
        {links.map((l) => (
          <li key={l}>
            <Link href="#" className="hover:text-[var(--color-primary-text)] dark:hover:text-[var(--color-primary-text)]">{l}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}