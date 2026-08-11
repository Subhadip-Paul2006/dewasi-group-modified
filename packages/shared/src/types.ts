// Types mirroring the backend's Prisma models / API response shapes.
// Keep these in sync with backend/prisma/schema.prisma when it changes.

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "CLINIC"
  | "RECEPTIONIST"
  | "DOCTOR"
  | "PATIENT";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
};

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type PatientProfile = {
  id: string;
  userId: string | null;
  dob: string | null;
  age: number | null;
  gender: Gender | null;
  bloodGroup: string | null;
  address: string | null;
};

export type AppointmentStatus =
  | "WAITING"
  | "CHECKED_IN"
  | "ABSENT"
  | "COMPLETED"
  | "CANCELLED";

export type Appointment = {
  id: string;
  token: number;
  date: string;
  status: AppointmentStatus;
  queueMode?: "LIVE" | "PRIVATE";
  patientsAhead?: number;
  estimatedWaitMinutes?: number | null;
  doctor?: { user?: { name: string } };
  clinic?: { clinicName: string };
};

export type Doctor = {
  id: string;
  specialization: string | null;
  qualification: string | null;
  experience: number | null;
  fee: number | null;
  clinicId: string;
  user: { name: string };
  clinic: { id: string; clinicName: string; city: string | null; address: string | null };
};
