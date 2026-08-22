"use client";

import type { AuthUser } from "@doctor-contract/shared";
import { User, Mail, Phone, Shield, Stethoscope, Award, FileText } from "lucide-react";
import { ProfileField } from "./ProfileField";

interface ProfileInformationProps {
  user: AuthUser | null;
  specialization?: string | null;
  qualification?: string | null;
}

export function ProfileInformation({
  user,
  specialization,
  qualification,
}: ProfileInformationProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Verified Account Information
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Full Name */}
        <ProfileField
          label="Full Name"
          value={user?.name}
          icon={User}
          isLocked={true}
        />

        {/* Email Address */}
        <ProfileField
          label="Email Address"
          value={user?.email}
          icon={Mail}
          isLocked={true}
        />

        {/* Phone Number */}
        <ProfileField
          label="Phone Number"
          value={user?.phone}
          icon={Phone}
          isLocked={true}
          fallbackText="Not provided"
        />

        {/* Account Role */}
        <ProfileField
          label="Account Role"
          value={user?.role}
          icon={Shield}
          isLocked={true}
        />

        {/* Specialization */}
        <ProfileField
          label="Medical Specialization"
          value={specialization}
          icon={Stethoscope}
          isLocked={true}
          fallbackText="Not provided"
        />

        {/* Qualification */}
        <ProfileField
          label="Qualification & Degrees"
          value={qualification}
          icon={Award}
          isLocked={true}
          fallbackText="Not provided"
        />
      </div>

      <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">
        Note: Core identity and contact credentials are managed via single-sign-on verification.
      </p>
    </div>
  );
}
