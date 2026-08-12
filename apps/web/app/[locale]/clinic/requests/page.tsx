"use client";

import {
  Check,
  X,
  Inbox,
  Send,
  CalendarDays,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import {
  useReceivedDoctorRequests,
  useSentDoctorRequests,
  useRespondToDoctorRequest,
  type SentDoctorRequest,
} from "@/lib/hooks/useClinic";

export default function ClinicRequestsPage() {
  const { data: received, isLoading: loadingReceived } =
    useReceivedDoctorRequests();
  const { data: sent, isLoading: loadingSent } = useSentDoctorRequests();
  const respond = useRespondToDoctorRequest();

  const pending = (received ?? []).filter((r) => r.status === "PENDING");

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="flex flex-col gap-1">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-bg-soft)]">
            <Inbox className="h-4 w-4 text-[var(--color-primary)]" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Network
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-primary-dark)] sm:text-3xl">
          Doctor Requests
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage incoming association requests and track the ones you've sent.
        </p>
      </div>

      {/* =====================================================
          INCOMING REQUESTS
      ====================================================== */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
        <div className="h-1 bg-[var(--color-primary)]" />

        <div className="p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-bg-soft)]">
              <Inbox className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">
                Incoming Requests
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Doctors requesting to join your clinic.
              </p>
            </div>
          </div>

          {loadingReceived ? (
            <div className="flex min-h-[150px] items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/50">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
                <p className="text-sm font-medium text-gray-500">
                  Loading requests...
                </p>
              </div>
            </div>
          ) : pending.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-gray-800">
                All caught up
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                You have no pending incoming requests right now.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {pending.map((r) => (
                <IncomingRow
                  key={r.id}
                  request={r}
                  onRespond={(action) =>
                    respond.mutate({ associationId: r.id, action })
                  }
                  busy={respond.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          SENT REQUESTS
      ====================================================== */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
        <div className="h-1 bg-gray-200" />

        <div className="p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <Send className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">
                Sent Requests
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Invitations you have sent to doctors.
              </p>
            </div>
          </div>

          {loadingSent ? (
            <div className="flex min-h-[150px] items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/50">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <p className="text-sm font-medium text-gray-500">
                  Loading sent requests...
                </p>
              </div>
            </div>
          ) : !sent || sent.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Send className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-gray-800">
                No requests sent
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                You haven't sent any association requests to doctors yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {sent.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                      <span className="text-sm font-bold text-gray-500">
                        {getInitials(r.doctor?.user?.name ?? "Doctor")}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-800">
                        {r.doctor?.user?.name ?? "Unknown Doctor"}
                      </p>
                      {r.dayOfWeek && (
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                            <span>{r.dayOfWeek}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            <span>
                              {r.startTime} – {r.endTime}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Incoming Row Component
// ============================================================
function IncomingRow({
  request,
  onRespond,
  busy,
}: {
  request: SentDoctorRequest;
  onRespond: (action: "ACCEPT" | "REJECT") => void;
  busy: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/5 p-4 transition hover:bg-[var(--color-primary)]/10 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {/* Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
          <span className="text-sm font-bold text-[var(--color-primary)]">
            {getInitials(request.doctor?.user?.name ?? "Doctor")}
          </span>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[var(--color-primary-dark)]">
            {request.doctor?.user?.name ?? "Unknown Doctor"}
          </p>
          {request.dayOfWeek && (
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-gray-600">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                <span>{request.dayOfWeek}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                <span>
                  {request.startTime} – {request.endTime}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-2 sm:ml-auto">
        <button
          type="button"
          disabled={busy}
          onClick={() => onRespond("ACCEPT")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <Check className="h-4 w-4" />
          Accept
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onRespond("REJECT")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 shadow-sm transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X className="h-4 w-4" />
          Reject
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Status Badge Component
// ============================================================
function StatusBadge({ status }: { status: string }) {
  if (status === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Approved
      </span>
    );
  }
  
  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700">
        <XCircle className="h-3.5 w-3.5" />
        Rejected
      </span>
    );
  }

  // PENDING or other
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
      <Clock3 className="h-3.5 w-3.5" />
      Pending
    </span>
  );
}

// ============================================================
// Utility Component
// ============================================================
function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}