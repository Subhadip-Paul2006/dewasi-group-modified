/**
 * Core domain types for Dewasi Group Mobile.
 * Mirrored faithfully from backend and Web shared contracts.
 */

export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'CLINIC'
  | 'RECEPTIONIST'
  | 'DOCTOR'
  | 'PATIENT'
  | 'DIAGNOSTIC_CENTER'
  | 'DIAGNOSTIC_STAFF';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface PatientProfile {
  id: string;
  userId: string | null;
  dob: string | null;
  age?: number | null;
  gender: Gender | null;
  bloodGroup: string | null;
  address: string | null;
}

export interface UpdateProfileInput {
  dob?: string;
  gender?: Gender;
  bloodGroup?: string;
  address?: string;
}

export type AppointmentStatus =
  | 'WAITING'
  | 'CHECKED_IN'
  | 'ABSENT'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Clinic {
  id: string;
  clinicName: string;
  city?: string | null;
  address?: string | null;
  phone?: string | null;
}

export interface Doctor {
  id: string;
  specialization: string | null;
  qualification: string | null;
  experience: number | null;
  fee: number | null;
  clinicId: string;
  user: {
    id?: string;
    name: string;
    email?: string;
    phone?: string | null;
    isActive?: boolean;
  };
  clinic: {
    id: string;
    clinicName: string;
    city: string | null;
    address: string | null;
  };
}

export interface Appointment {
  id: string;
  token: number;
  date: string;
  status: AppointmentStatus;
  queueMode?: 'LIVE' | 'PRIVATE';
  patientsAhead?: number;
  estimatedWaitMinutes?: number | null;
  doctor?: { user?: { name: string } };
  clinic?: { clinicName: string };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}
