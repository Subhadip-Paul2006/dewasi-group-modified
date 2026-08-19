import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type PatientLookup = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  age: number | null;
  gender: string | null;
  isGuest: boolean;
};

export type DiagnosticCenterLookup = {
  id: string;
  centerName: string;
  city: string | null;
  address: string | null;
  logo: string | null;
};

export type SentReferral = {
  id: string;
  testNames: string[];
  notes: string | null;
  createdAt: string;
  patient: { name: string; phone: string | null; user?: { name: string; phone: string | null } };
  diagnosticCenter: { centerName: string };
};

export function useSearchPatientByPhone() {
  return useMutation({
    mutationFn: async (phone: string) => {
      try {
        const { data } = await api.get("/patient/search", { params: { phone } });
        return (data?.data?.patient ?? data?.data ?? null) as PatientLookup | null;
      } catch {
        return null;
      }
    },
  });
}

export function useSearchDiagnosticCenters() {
  return useMutation({
    mutationFn: async (name: string) => {
      try {
        const { data } = await api.get("/diagnostic-centers/search", { params: { name } });
        return (data?.data?.centers ?? data?.data ?? []) as DiagnosticCenterLookup[];
      } catch {
        return [];
      }
    },
  });
}

export function useCreateReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      patientId: string;
      diagnosticCenterId: string;
      testNames: string[];
      notes?: string;
      appointmentId?: string;
    }) => {
      const res = await api.post("/test-referrals", payload);
      return res.data?.data?.referral ?? res.data?.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["referrals", "sent"] }),
  });
}

export function useSentReferrals() {
  return useQuery<SentReferral[]>({
    queryKey: ["referrals", "sent"],
    queryFn: async () => {
      try {
        const res = await api.get("/test-referrals/sent");
        return (
          res.data?.data?.referrals ??
          res.data?.data ??
          res.data?.referrals ??
          []
        );
      } catch {
        return [];
      }
    },
  });
}