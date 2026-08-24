"use client";

import React from "react";

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  innerClassName?: string;
}

export function GradientCard({
  children,
  className = "",
  gradient = "from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]",
  innerClassName = "",
}: GradientCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-[2.5px] bg-gradient-to-r ${gradient} shadow-lg shadow-blue-900/5 transition-all duration-300 hover:shadow-xl ${className}`}
    >
      <div
        className={`rounded-[calc(1rem-1px)] bg-white dark:bg-slate-900 h-full ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
