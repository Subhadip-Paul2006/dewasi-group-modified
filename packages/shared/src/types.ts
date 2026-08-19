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

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

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
  user: { id?: string; name: string; email?: string; phone?: string | null; isActive?: boolean };
  clinic: { id: string; clinicName: string; city: string | null; address: string | null };
};

export type DoctorRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type DoctorRequest = {
  id: string;
  status: DoctorRequestStatus;
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  fee?: number | null;
  doctorId?: string;
  clinicId?: string;
  doctor?: { id: string; user?: { name: string; email?: string; phone?: string | null } };
  clinic?: { id: string; clinicName: string; city?: string | null; address?: string | null };
  createdAt?: string;
};

export type DoctorLeave = {
  id: string;
  date: string; // YYYY-MM-DD
  reason?: string | null;
  doctorId?: string;
  clinicId?: string;
  createdAt?: string;
};

export type QueueStatus =
  | "WAITING"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED"
  | "ABSENT"
  | "PAUSED"
  | "CLOSED";

export type QueueToken = {
  id: string;
  token: number;
  patientName?: string;
  patientAge?: number | null;
  patientGender?: Gender | null;
  status: QueueStatus;
  bookedAt?: string;
};

export type DoctorQueue = {
  doctorId: string;
  clinicId: string;
  date: string;
  currentToken: number;
  lastTokenIssued: number;
  status: string;
  tokens?: QueueToken[];
};

export type DashboardStats = {
  totalAppointmentsToday?: number;
  completedToday?: number;
  waitingToday?: number;
  pendingRequestsCount?: number;
  associatedClinicsCount?: number;
  activeQueueStatus?: string;
  avgConsultationMinutes?: number;
  [key: string]: unknown;
};

export type ClinicSearchResult = {
  id: string;
  clinicName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  logo: string | null;
  isApproved: boolean;
};

export type NotificationType =
  | "APPOINTMENT_BOOKED"
  | "APPOINTMENT_CANCELLED"
  | "CLINIC_APPROVED"
  | "CLINIC_REVOKED"
  | "DOCTOR_VERIFIED"
  | "CONNECTION_REQUEST_RECEIVED"
  | "CONNECTION_REQUEST_RESPONDED"
  | "GENERAL";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

// ============================================================
// PHASE 03A — DOCTOR PORTAL EXPANSION CONTRACT TYPES
// ============================================================

export type DoctorPatientRecord = {
  id: string;
  patientId: string;
  name: string;
  phone: string | null;
  email: string | null;
  age: number | null;
  gender: Gender | null;
  bloodGroup: string | null;
  totalConsultations: number;
  lastConsultationDate: string;
  clinicId: string;
  clinicName: string;
};

export type PrescriptionItem = {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
};

export type DoctorPrescription = {
  id: string;
  doctorId: string;
  patientId: string;
  clinicId: string;
  appointmentId?: string | null;
  patientName: string;
  clinicName: string;
  diagnosis: string;
  items: PrescriptionItem[];
  notes?: string | null;
  createdAt: string;
};

export type ClinicEarningsBreakdown = {
  clinicId: string;
  clinicName: string;
  totalCompletedConsultations: number;
  consultationFee: number;
  totalEarnings: number;
};

export type DoctorEarningsSummary = {
  period: "daily" | "weekly" | "monthly" | "yearly" | "custom";
  startDate?: string;
  endDate?: string;
  totalEarnings: number;
  totalConsultations: number;
  clinicBreakdown: ClinicEarningsBreakdown[];
};

export type DoctorSettings = {
  doctorId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoAcceptClinicRequests: boolean;
  defaultConsultationFee: number | null;
  digitalSignatureUrl?: string | null;
};
