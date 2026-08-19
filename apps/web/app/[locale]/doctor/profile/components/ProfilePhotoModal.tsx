"use client";

import { useState, useRef } from "react";
import { X, Upload, Camera, Loader2, AlertCircle } from "lucide-react";
import { useUploadDoctorProfilePhoto } from "@/lib/hooks/useDoctor";
import type { Doctor } from "@doctor-contract/shared";
import toast from "react-hot-toast";
import Image from "next/image";

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (doctor?: Doctor) => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ProfilePhotoModal({
  isOpen,
  onClose,
  onSuccess,
}: ProfilePhotoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadDoctorProfilePhoto();

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setValidationError(null);

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setValidationError("Please select a valid image file (JPEG, PNG, or WebP).");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError("Image file size must be less than 5 MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseModal = () => {
    handleClearSelection();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select an image file to upload.");
      return;
    }

    try {
      const updatedDoctor = await uploadMutation.mutateAsync(selectedFile);
      toast.success("Profile photo updated successfully!");
      if (onSuccess) onSuccess(updatedDoctor);
      handleCloseModal();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to upload profile photo. Please try again.";
      toast.error(errorMsg);
    }
  };

  const isPending = uploadMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upload Profile Photo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update your doctor avatar image (Max 5 MB)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            disabled={isPending}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* File Drag-and-Drop / Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
              previewUrl
                ? "border-blue-300 bg-blue-50/40 dark:border-blue-800/60 dark:bg-blue-950/20"
                : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:bg-slate-800/80"
            }`}
          >
            {previewUrl ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-blue-600 shadow-md">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  disabled={isPending}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                >
                  Choose Different Image
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Drag and drop your image here, or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 underline dark:text-blue-400"
                  >
                    browse
                  </button>
                </p>
                <p className="text-[11px] text-slate-400">
                  Supports JPEG, PNG, WebP up to 5 MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isPending}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending || !selectedFile}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isPending ? "Uploading..." : "Save Profile Photo"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
