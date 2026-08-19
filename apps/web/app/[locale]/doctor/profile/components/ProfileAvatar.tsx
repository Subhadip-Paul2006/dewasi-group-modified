"use client";

import { Camera, User, Stethoscope } from "lucide-react";
import Image from "next/image";

interface ProfileAvatarProps {
  name: string;
  photoUrl?: string | null;
  onOpenPhotoModal: () => void;
}

export function ProfileAvatar({
  name,
  photoUrl,
  onOpenPhotoModal,
}: ProfileAvatarProps) {
  // Generate initials fallback
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "DR";

  return (
    <div className="flex flex-col items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        {/* Avatar Container */}
        <div className="relative">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-600 font-bold text-white shadow-md">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-2xl font-black tracking-wider">{initials}</span>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenPhotoModal}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white shadow-md ring-2 ring-white hover:bg-blue-600 transition-colors dark:bg-slate-800 dark:ring-slate-900"
            title="Upload Profile Photo"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Doctor Identity Info */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {name || "Doctor"}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
              <Stethoscope className="h-3 w-3" />
              Doctor Practitioner
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Medical Practitioner • Verified Practitioner Profile
          </p>
        </div>
      </div>

      {/* Upload Action CTA Button */}
      <button
        type="button"
        onClick={onOpenPhotoModal}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60 transition-colors sm:mt-0"
      >
        <Camera className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
        <span>Change Profile Photo</span>
      </button>
    </div>
  );
}
