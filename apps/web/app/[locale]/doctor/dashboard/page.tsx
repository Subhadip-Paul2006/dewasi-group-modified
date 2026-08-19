"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Inbox,
  Building2,
  Stethoscope,
  Activity,
} from "lucide-react";
import { useDoctorDashboard } from "@/lib/hooks/useDoctor";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatCard } from "./components/StatCard";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { DashboardError } from "./components/DashboardError";

export default function DoctorDashboardPage() {
  const { data: stats, isLoading, isError, error, refetch } = useDoctorDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    const errorMessage =
      error instanceof Error ? error.message : undefined;
    return <DashboardError onRetry={() => refetch()} message={errorMessage} />;
  }

  const activeQueueStatus = stats?.activeQueueStatus;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <DashboardHeader />

      {/* Queue Status Banner (if provided by API) */}
      {activeQueueStatus && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/80 p-4 transition-colors dark:border-blue-900/50 dark:bg-blue-950/30">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Activity className="h-4.5 w-4.5" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Queue Status: <span className="uppercase text-blue-600 dark:text-blue-400">{activeQueueStatus}</span>
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Live updates active for current patient consultations
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Today's Appointments"
          value={stats?.totalAppointmentsToday}
          subtitle="Total scheduled for today"
          icon={CalendarDays}
          colorScheme="blue"
        />

        <StatCard
          title="Completed Today"
          value={stats?.completedToday}
          subtitle="Consultations finished"
          icon={CheckCircle2}
          colorScheme="emerald"
        />

        <StatCard
          title="Waiting Patients"
          value={stats?.waitingToday}
          subtitle="Currently in queue"
          icon={Clock}
          colorScheme="amber"
        />

        <StatCard
          title="Pending Requests"
          value={stats?.pendingRequestsCount}
          subtitle="Clinic & association requests"
          icon={Inbox}
          colorScheme="indigo"
        />

        <StatCard
          title="Associated Clinics"
          value={stats?.associatedClinicsCount}
          subtitle="Connected medical centers"
          icon={Building2}
          colorScheme="cyan"
        />

        <StatCard
          title="Avg Consultation Time"
          value={
            stats?.avgConsultationMinutes !== undefined &&
            stats?.avgConsultationMinutes !== null
              ? `${stats.avgConsultationMinutes} mins`
              : undefined
          }
          subtitle="Estimated time per patient"
          icon={Stethoscope}
          colorScheme="purple"
        />
      </div>

      {/* Operational Summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Practice Operational Overview
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          All metrics above are synchronized directly from your live clinic database. Select sections from the sidebar to manage specific queues, schedules, or clinic association requests.
        </p>
      </div>
    </div>
  );
}
