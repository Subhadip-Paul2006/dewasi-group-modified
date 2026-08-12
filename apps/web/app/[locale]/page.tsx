import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import FeaturedDoctors from "@/components/FeaturedDoctors";
import Specialties from "@/components/Specialties";
import HowItWorks from "@/components/HowItWorks";
import ClinicCTA from "@/components/ClinicCTA";
import Footer from "@/components/Footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <FeaturedDoctors />
      <Specialties />
      <HowItWorks />
      <ClinicCTA />
      <Footer />
    </main>
  );
}