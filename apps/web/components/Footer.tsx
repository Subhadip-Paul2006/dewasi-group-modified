"use client";

import { Link } from "@/i18n/routing";
import { Stethoscope } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Navbar");

  return (
    <footer className="border-t border-gray-100 bg-white px-5 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]">
              <Stethoscope className="h-4 w-4 text-white" />
            </span>
            <span className="font-bold text-[var(--color-primary-dark)]">Doctor Contract</span>
          </div>
          <p className="mt-3 text-sm text-gray-500">{t("tagline")}</p>
        </div>

        <FooterCol title={t("platformHeading")} links={[nav("findDoctor"), nav("forClinics"), nav("howItWorks")]} />
        <FooterCol
          title={t("companyHeading")}
          links={[t("aboutUs"), t("contact"), t("privacyPolicy"), t("termsConditions")]}
        />

        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-800">{t("helpHeading")}</h4>
          <p className="text-sm text-gray-500">support@doctorcontract.in</p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
        Doctor Contract. {t("copyright")}
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-gray-800">{title}</h4>
      <ul className="space-y-2 text-sm text-gray-500">
        {links.map((l) => (
          <li key={l}>
            <Link href="#" className="hover:text-[var(--color-primary)]">{l}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
