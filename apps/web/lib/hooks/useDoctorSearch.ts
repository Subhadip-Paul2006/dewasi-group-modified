import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Doctor } from "@doctor-contract/shared";
import { api } from "@/lib/api";

export function useDoctorSearch(filters: { doctorName?: string; city?: string }) {
  return useQuery<Doctor[]>({
    queryKey: ["doctors", "search", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.doctorName) params.set("doctorName", filters.doctorName);
      if (filters.city) params.set("city", filters.city);
      const { data } = await api.get("/appointments/doctors/search?" + params.toString());
      return data.data.doctors;
    },
  });
}

type BookPayload = { doctorId: string; clinicId: string; date: string };

export function useBookAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BookPayload) => {
      const { data } = await api.post("/appointments/book/online", payload);
      return data.data.appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
    },
  });
}
