import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "@/lib/auth-context";
import QueryProvider from "@/components/QueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doctor contract",
  description: "Doctor Appointment & Clinic Management System",
};

// Applies the persisted theme before first paint. Must stay in sync with
// components/ThemeProvider.tsx (same storage key and fallback logic).
const themeScript = `(function(){try{var k=document.documentElement;var t=localStorage.getItem("dc-theme");if(t==="dark"||(!t&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches))k.classList.add("dark");else k.classList.remove("dark");}catch(e){}})()`;

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

  return (
    <html lang={locale} className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <QueryProvider>
              <AuthProvider>
                <Header />
                <div className="flex-1">{children}</div>
                <Footer />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: "var(--toast-bg)",
                      color: "var(--toast-fg)",
                    },
                  }}
                />
              </AuthProvider>
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
