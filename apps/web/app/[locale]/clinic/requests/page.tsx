"use client";

import { Check, X } from "lucide-react";
import {
  useReceivedDoctorRequests,
  useSentDoctorRequests,
  useRespondToDoctorRequest,
  type SentDoctorRequest,
} from "@/lib/hooks/useClinic";

export default function ClinicRequestsPage() {
  const { data: received, isLoading: loadingReceived } = useReceivedDoctorRequests();
  const { data: sent, isLoading: loadingSent } = useSentDoctorRequests();
  const respond = useRespondToDoctorRequest();

  const pending = (received ?? []).filter((r) => r.status === "PENDING");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-primary-dark)]">Doctor Requests</h1>

      {/* Incoming: doctors asking to join this clinic */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-bold text-gray-800">Incoming Requests</p>

        {loadingReceived && <p className="text-sm text-gray-500">Loading...</p>}

        {!loadingReceived && pending.length === 0 && (
          <p className="text-sm text-gray-400">No pending requests right now.</p>
        )}

        <div className="space-y-2">
          {pending.map((r) => (
            <IncomingRow
              key={r.id}
              request={r}
              onRespond={(action) => respond.mutate({ associationId: r.id, action })}
              busy={respond.isPending}
            />
          ))}
        </div>
      </div>

      {/* Sent: requests this clinic has sent to doctors */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-bold text-gray-800">Requests You've Sent to Doctors</p>

        {loadingSent && <p className="text-sm text-gray-500">Loading...</p>}

        {!loadingSent && (!sent || sent.length === 0) && (
          <p className="text-sm text-gray-400">No requests sent yet.</p>
        )}

        <div className="space-y-2">
          {sent?.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {r.doctor?.user?.name ?? "Doctor"}
                </p>
                {r.dayOfWeek && (
                  <p className="text-xs text-gray-500">
                    {r.dayOfWeek} · {r.startTime}–{r.endTime}
                  </p>
                )}
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-gray-800">
          {request.doctor?.user?.name ?? "Doctor"}
        </p>
        {request.dayOfWeek && (
          <p className="text-xs text-gray-500">
            Wants: {request.dayOfWeek} · {request.startTime}–{request.endTime}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => onRespond("ACCEPT")}
          className="flex items-center gap-1 rounded-full bg-[var(--color-secondary)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          <Check className="h-3.5 w-3.5" />
          Accept
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onRespond("REJECT")}
          className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-60"
        >
          <X className="h-3.5 w-3.5" />
          Reject
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={
        "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase " +
        (status === "APPROVED"
          ? "bg-green-100 text-green-700"
          : status === "REJECTED"
            ? "bg-red-100 text-red-600"
            : "bg-gray-100 text-gray-600")
      }
    >
      {status}
    </span>
  );
}