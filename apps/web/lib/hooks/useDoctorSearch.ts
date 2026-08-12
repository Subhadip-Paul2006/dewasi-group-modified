import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Doctor } from "@doctor-contract/shared";
import { api } from "@/lib/api";

export function useDoctorSearch(query: string) {
  return useQuery<Doctor[]>({
    queryKey: ["doctors", "search", query],
    queryFn: async () => {
      const { data } = await api.get("/appointments/doctors/search", {
        params: query ? { q: query } : {},
      });
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