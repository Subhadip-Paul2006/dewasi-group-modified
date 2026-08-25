import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import FeaturedDoctors from "@/components/FeaturedDoctors";
import AllDoctors from "@/components/AllDoctors";
import FeaturedClinics from "@/components/FeaturedClinics";
import AllClinics from "@/components/AllClinics";
import Specialties from "@/components/Specialties";
import HowItWorks from "@/components/HowItWorks";
import ClinicCTA from "@/components/ClinicCTA";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-white dark:bg-[var(--color-bg)]">
      <Hero />
      <FeaturedDoctors />
      <AllDoctors />
      <FeaturedClinics />
      <AllClinics />
      <Specialties />
      <HowItWorks />
      <ClinicCTA />
    </main>
  );
}