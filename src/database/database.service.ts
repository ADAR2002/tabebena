import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { PostgrestError } from '@supabase/supabase-js';

// Define types that match your Prisma models
export enum UserRole {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
  ADMIN = 'ADMIN'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum BloodType {
  A_POSITIVE = 'A_POSITIVE',
  A_NEGATIVE = 'A_NEGATIVE',
  B_POSITIVE = 'B_POSITIVE',
  B_NEGATIVE = 'B_NEGATIVE',
  AB_POSITIVE = 'AB_POSITIVE',
  AB_NEGATIVE = 'AB_NEGATIVE',
  O_POSITIVE = 'O_POSITIVE',
  O_NEGATIVE = 'O_NEGATIVE'
}
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  bio?: string;
  role: UserRole;
  specialty?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  refreshToken?: string;
  profileComplete: boolean;
  consultationFee?: number;
  experienceYears?: number;
  profilePhotoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  doctorUserId: string;
  fullName: string;
  dateOfBirth: Date;
  gender: Gender;
  phone: string;
  bloodType?: BloodType;
  allergies?: string;
  medicalHistory?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Visit {
  id: string;
  patientId: string;
  visitDate: Date;
  reason?: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  vitalSigns?: string;
  notes?: string;
  consultationFee: number;
  paidAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private supabaseService: SupabaseService) {}

  // Helper method to handle Supabase errors
  private handleError(error: PostgrestError | null, operation: string): never {
    if (error) {
      this.logger.error(`${operation} failed: ${error.message}`, error.details);
      throw new Error(`Database operation failed: ${error.message}`);
    }
    throw new Error(`Unexpected error in ${operation}`);
  }

  // User operations
  async createUser(userData: Partial<User>): Promise<User> {
    const { data, error } = await this.supabaseService.create<User>('users', userData);
    if (error) this.handleError(error, 'createUser');
    if (!data) throw new Error('Failed to create user');
    return data;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabaseService.findOne<User>('users', { email });
    if (error && error.code !== 'PGRST116') this.handleError(error, 'findUserByEmail');
    return data;
  }

  async findUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabaseService.findById<User>('users', id);
    if (error && error.code !== 'PGRST116') this.handleError(error, 'findUserById');
    return data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const { data, error } = await this.supabaseService.update<User>('users', id, userData);
    if (error) this.handleError(error, 'updateUser');
    if (!data) throw new Error('Failed to update user');
    return data;
  }

  async deleteUser(id: string): Promise<User> {
    const { data, error } = await this.supabaseService.delete<User>('users', id);
    if (error) this.handleError(error, 'deleteUser');
    if (!data) throw new Error('Failed to delete user');
    return data;
  }

  // Patient operations
  async createPatient(patientData: Partial<Patient>): Promise<Patient> {
    const { data, error } = await this.supabaseService.create<Patient>('patients', patientData);
    if (error) this.handleError(error, 'createPatient');
    if (!data) throw new Error('Failed to create patient');
    return data;
  }

  async findPatientsByDoctor(doctorUserId: string): Promise<Patient[]> {
    const { data, error } = await this.supabaseService.findMany<Patient>('patients', { doctorUserId });
    if (error) this.handleError(error, 'findPatientsByDoctor');
    return data || [];
  }

  async findPatientById(id: string): Promise<Patient | null> {
    const { data, error } = await this.supabaseService.findById<Patient>('patients', id);
    if (error && error.code !== 'PGRST116') this.handleError(error, 'findPatientById');
    return data;
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient> {
    const { data, error } = await this.supabaseService.update<Patient>('patients', id, patientData);
    if (error) this.handleError(error, 'updatePatient');
    if (!data) throw new Error('Failed to update patient');
    return data;
  }

  async deletePatient(id: string): Promise<Patient> {
    const { data, error } = await this.supabaseService.delete<Patient>('patients', id);
    if (error) this.handleError(error, 'deletePatient');
    if (!data) throw new Error('Failed to delete patient');
    return data;
  }

  // Visit operations
  async createVisit(visitData: Partial<Visit>): Promise<Visit> {
    const { data, error } = await this.supabaseService.create<Visit>('visits', visitData);
    if (error) this.handleError(error, 'createVisit');
    if (!data) throw new Error('Failed to create visit');
    return data;
  }

  async findVisitsByPatient(patientId: string): Promise<Visit[]> {
    const { data, error } = await this.supabaseService.findMany<Visit>('visits', { patientId });
    if (error) this.handleError(error, 'findVisitsByPatient');
    return data || [];
  }

  async findVisitById(id: string): Promise<Visit | null> {
    const { data, error } = await this.supabaseService.findById<Visit>('visits', id);
    if (error && error.code !== 'PGRST116') this.handleError(error, 'findVisitById');
    return data;
  }

  async updateVisit(id: string, visitData: Partial<Visit>): Promise<Visit> {
    const { data, error } = await this.supabaseService.update<Visit>('visits', id, visitData);
    if (error) this.handleError(error, 'updateVisit');
    if (!data) throw new Error('Failed to update visit');
    return data;
  }

  async deleteVisit(id: string): Promise<Visit> {
    const { data, error } = await this.supabaseService.delete<Visit>('visits', id);
    if (error) this.handleError(error, 'deleteVisit');
    if (!data) throw new Error('Failed to delete visit');
    return data;
  }

  // Raw query access for complex operations
  getClient() {
    return this.supabaseService.getClient();
  }

  // Transaction support (using RPC functions in Supabase)
  async transaction<T>(callback: (supabase: any) => Promise<T>): Promise<T> {
    return this.supabaseService.transaction(callback);
  }
}
