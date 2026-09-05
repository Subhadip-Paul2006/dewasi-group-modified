import { useQuery } from "@tanstack/react-query";
import type { Appointment, PatientProfile } from "@doctor-contract/shared";
import { api } from "@/lib/api";

export function useMyAppointments() {
  return useQuery<Appointment[]>({
    queryKey: ["appointments", "me"],
    queryFn: async () => {
      const { data } = await api.get("/appointments/me");
      return data.data.appointments;
    },
  });
}

export function useMyPatientProfile() {
  return useQuery<PatientProfile>({
    queryKey: ["patient", "me"],
    queryFn: async () => {
      const { data } = await api.get("/patient/me");
      return data.data.patient;
    },
  });
}
