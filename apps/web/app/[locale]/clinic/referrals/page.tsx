"use client";

import { useState } from "react";
import { Search, X, Send } from "lucide-react";
import {
  useSearchPatientByPhone,
  useSearchDiagnosticCenters,
  useCreateReferral,
  useSentReferrals,
  type PatientLookup,
  type DiagnosticCenterLookup,
} from "@/lib/hooks/useReferrals";

export default function ClinicReferralsPage() {
  const { data: sent, isLoading: loadingSent } = useSentReferrals();

  // Patient search
  const searchPatient = useSearchPatientByPhone();
  const [phone, setPhone] = useState("");
  const [patient, setPatient] = useState<PatientLookup | null>(null);
  const [patientNotFound, setPatientNotFound] = useState(false);

  // Center search
  const searchCenters = useSearchDiagnosticCenters();
  const [centerQuery, setCenterQuery] = useState("");
  const [centers, setCenters] = useState<DiagnosticCenterLookup[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<DiagnosticCenterLookup | null>(null);

  // Tests + notes
  const [testInput, setTestInput] = useState("");
  const [tests, setTests] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const createReferral = useCreateReferral();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handlePatientSearch(e: React.FormEvent) {
    e.preventDefault();
    setPatientNotFound(false);
    setPatient(null);
    searchPatient.mutate(phone, {
      onSuccess: (result) => {
        if (result) setPatient(result);
        else setPatientNotFound(true);
      },
    });
  }

  function handleCenterSearch(e: React.FormEvent) {
    e.preventDefault();
    setSelectedCenter(null);
    searchCenters.mutate(centerQuery, {
      onSuccess: (result) => setCenters(result),
    });
  }

  function addTest() {
    const t = testInput.trim();
    if (t && !tests.includes(t)) {
      setTests([...tests, t]);
      setTestInput("");
    }
  }

  function removeTest(t: string) {
    setTests(tests.filter((x) => x !== t));
  }

  function handleSend() {
    setError("");
    if (!patient || !selectedCenter || tests.length === 0) return;

    createReferral.mutate(
      {
        patientId: patient.id,
        diagnosticCenterId: selectedCenter.id,
        testNames: tests,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setPatient(null);
          setPhone("");
          setSelectedCenter(null);
          setCenters([]);
          setCenterQuery("");
          setTests([]);
          setNotes("");
          setTimeout(() => setSuccess(false), 3000);
        },
        onError: (err: any) =>
          setError(err?.response?.data?.message || "Failed to send referral"),
      }
    );
  }

  const canSend = !!patient && !!selectedCenter && tests.length > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-primary-dark)]">
        Send Test Referral
      </h1>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        {/* Step 1: find patient */}
        <p className="mb-2 text-sm font-bold text-gray-800">1. Find Patient</p>
        <form onSubmit={handlePatientSearch} className="flex gap-2">
          <input
            required
            placeholder="Patient phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input flex-1"
          />
          <button
            type="submit"
            disabled={searchPatient.isPending}
            className="flex items-center gap-1 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>

        {patientNotFound && (
          <p className="mt-2 text-sm text-red-600">
            No patient found with this phone number.
          </p>
        )}

        {patient && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--color-bg-soft)] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {patient.name} {patient.isGuest && "(Guest)"}
              </p>
              <p className="text-xs text-gray-500">
                {patient.phone} {patient.age ? "· " + patient.age + "y" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPatient(null)}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: find center */}
        <p className="mb-2 mt-6 text-sm font-bold text-gray-800">2. Find Diagnostic Center</p>
        <form onSubmit={handleCenterSearch} className="flex gap-2">
          <input
            required
            placeholder="Diagnostic center name"
            value={centerQuery}
            onChange={(e) => setCenterQuery(e.target.value)}
            className="input flex-1"
          />
          <button
            type="submit"
            disabled={searchCenters.isPending}
            className="flex items-center gap-1 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>

        {centers.length > 0 && !selectedCenter && (
          <div className="mt-3 space-y-1.5">
            {centers.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCenter(c)}
                className="block w-full rounded-xl border border-gray-100 px-4 py-2.5 text-left text-sm hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-bg-soft)]"
              >
                <span className="font-semibold text-gray-800">{c.centerName}</span>
                {c.city && <span className="text-gray-500"> · {c.city}</span>}
              </button>
            ))}
          </div>
        )}

        {selectedCenter && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--color-bg-soft)] px-4 py-3">
            <p className="text-sm font-semibold text-gray-800">
              {selectedCenter.centerName}
              {selectedCenter.city && (
                <span className="font-normal text-gray-500"> · {selectedCenter.city}</span>
              )}
            </p>
            <button
              type="button"
              onClick={() => setSelectedCenter(null)}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 3: tests + notes */}
        <p className="mb-2 mt-6 text-sm font-bold text-gray-800">3. Tests</p>
        <div className="flex gap-2">
          <input
            placeholder="e.g. CBC, Blood Sugar"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTest();
              }
            }}
            className="input flex-1"
          />
          <button
            type="button"
            onClick={addTest}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600"
          >
            Add
          </button>
        </div>

        {tests.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tests.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--color-primary)]"
              >
                {t}
                <button type="button" onClick={() => removeTest(t)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input mt-3 w-full"
          rows={2}
        />

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-2 text-sm text-green-600">Referral sent.</p>}

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend || createReferral.isPending}
          className="mt-4 flex items-center gap-2 rounded-full bg-[var(--color-secondary)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
          {createReferral.isPending ? "Sending..." : "Send Referral"}
        </button>
      </div>

      {/* Sent history */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-bold text-gray-800">Referrals Sent</p>

        {loadingSent && <p className="text-sm text-gray-500">Loading...</p>}

        {!loadingSent && (!sent || sent.length === 0) && (
          <p className="text-sm text-gray-400">No referrals sent yet.</p>
        )}

        <div className="space-y-2">
          {sent?.map((r) => (
            <div key={r.id} className="rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-800">
                  {r.patient.user?.name || r.patient.name} →{" "}
                  {r.diagnosticCenter.centerName}
                </p>
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600">{r.testNames.join(", ")}</p>
              {r.notes && <p className="mt-0.5 text-xs text-gray-400">{r.notes}</p>}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .input {
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}