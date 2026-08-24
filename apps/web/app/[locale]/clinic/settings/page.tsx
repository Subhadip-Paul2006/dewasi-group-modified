"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Loader2,
  CheckCircle2,
  Building2,
  LogOut,
  Camera,
  Mail,
  Phone,
  Clock3,
  Users,
  UserRound,
  Activity,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "@/i18n/routing";
import toast from "react-hot-toast";
import {
  useClinicProfile,
  useUploadClinicLogo,
  useClinicDoctors,
  useClinicReceptionists,
} from "@/lib/hooks/useClinic";

// ============================================================
// GRADIENT BORDER CARD COMPONENT
// ============================================================

function GradientCard({
  children,
  className = "",
  gradient = "from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]",
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div className={`relative rounded-2xl p-[3.0px] bg-gradient-to-r ${gradient} shadow-lg ${className}`}>
      <div className="rounded-[calc(1rem-1px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT - OVERVIEW PAGE (View Only)
// ============================================================

export default function ClinicOverviewPage() {
  const t = useTranslations("ClinicOverview");
  const tNav = useTranslations("ClinicNav");
  const { data: clinic, isLoading } = useClinicProfile();
  const { data: doctors } = useClinicDoctors();
  const { data: receptionists } = useClinicReceptionists();
  const uploadLogo = useUploadClinicLogo();

  const { user, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => {
    if (clinic) {
      setLastSynced(new Date());
    }
  }, [clinic]);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleLogoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      await uploadLogo.mutateAsync(file);
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      setLogoPreview(null);
      toast.error("Failed to upload logo");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  // ============================================================
  // COMPUTED VALUES
  // ============================================================

  const fullAddress = useMemo(() => {
    return [clinic?.address, clinic?.city, clinic?.state, clinic?.pincode]
      .filter(Boolean)
      .join(", ");
  }, [clinic?.address, clinic?.city, clinic?.state, clinic?.pincode]);

  const logoUrl = useMemo(() => {
    return logoPreview || clinic?.logo || null;
  }, [logoPreview, clinic?.logo]);

  const totalStaff = (doctors?.length ?? 0) + (receptionists?.length ?? 0);

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (isLoading || !clinic) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-3xl" />
        <div className="h-96 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER - Settings Style
      ====================================================== */}
      <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-[#1e3a8a]/30">
                  <Building2 className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1e40af]">
                  {tNav("overview")}
                </p>
                {clinic.isApproved && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#1e40af]/10 px-2 py-1 text-[9px] font-bold text-[#1e40af]">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {t("heading")}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {t("subtitle")}
              </p>

              {lastSynced && (
                <p className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Clock3 className="h-3 w-3" />
                  {t("lastSynced")}: {lastSynced.toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f5576c] to-[#fda085] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#f5576c]/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </GradientCard>

      {/* =====================================================
          PROFILE CARD - Settings Style
      ====================================================== */}
      <GradientCard gradient="from-[#667eea] via-[#764ba2] to-[#f093fb]">
        <div className="p-5 sm:p-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Avatar + Name */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-[#1e3a8a]/30">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Clinic logo"
                      className="h-full w-full object-cover rounded-2xl"
                    />
                  ) : (
                    <Building2 className="h-8 w-8" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadLogo.isPending}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[#059669] to-[#10b981] text-white shadow-md shadow-green-500/30 hover:scale-110 transition-transform"
                >
                  {uploadLogo.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Camera className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoPick}
              />

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-slate-900">
                  {clinic.clinicName}
                </h2>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-slate-500 sm:justify-start">
                  <Mail className="h-4 w-4 text-[#1e40af]" />
                  {user?.email || "admin@clinic.com"}
                </p>
                {fullAddress && (
                  <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-400 sm:justify-start">
                    <MapPin className="h-3.5 w-3.5 text-[#1e40af]" />
                    {fullAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Clinic Information */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-md shadow-blue-500/30">
                  <Users className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-slate-500">{tNav("doctors")}</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{doctors?.length ?? 0}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-md shadow-indigo-500/30">
                  <UserRound className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-slate-500">{tNav("receptionists")}</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{receptionists?.length ?? 0}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#059669] to-[#10b981] text-white shadow-md shadow-green-500/30">
                  <Activity className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-slate-500">Total Staff</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{totalStaff}</p>
            </div>
          </div>

          {/* Online Consultation Toggle */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#059669] to-[#10b981] text-white shadow-md shadow-green-500/30">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Online Consultation</p>
                  <p className="text-xs text-slate-500">Status: {clinic.onlineConsultationEnabled ? "Active" : "Inactive"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GradientCard>
    </div>
  );
}