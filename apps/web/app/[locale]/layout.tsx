import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Bengali, Noto_Sans_Devanagari } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "@/lib/auth-context";
import QueryProvider from "@/components/QueryProvider";
import Header from "@/components/Header";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});
const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-sans-bn",
  weight: ["400", "500", "600", "700", "800"],
});
const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-sans-dev",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Doctor Contract",
  description: "Doctor Appointment & Clinic Management System",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const fontVars =
    notoSans.variable + " " + notoSansBengali.variable + " " + notoSansDevanagari.variable;

  return (
    <html lang={locale} className={fontVars + " h-full antialiased"}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AuthProvider>
              <Header />
              {children}
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
