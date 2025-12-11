import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, User, Patient, Visit, Gender, UserRole, BloodType } from '@prisma/client';
export type { User, Patient, Visit, Gender, UserRole, BloodType } from '@prisma/client';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // User operations
  async createUser(userData: any): Promise<User> {
    try {
      return await this.prisma.user.create({ data: userData });
    } catch (error) {
      this.logger.error('createUser failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      this.logger.error('findUserByEmail failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  async findUserById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error('findUserById failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      return await this.prisma.user.update({ where: { id }, data: userData });
    } catch (error) {
      this.logger.error('updateUser failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      this.logger.error('deleteUser failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  // Patient operations
  async createPatient(patientData: any): Promise<Patient> {
    try {
      return await this.prisma.patient.create({ data: patientData });
    } catch (error) {
      this.logger.error('createPatient failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  async findPatientsByDoctor(doctorUserId: string): Promise<Patient[]> {
    try {
      return await this.prisma.patient.findMany({ where: { doctorUserId } });
    } catch (error) {
      this.logger.error('findPatientsByDoctor failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  async findPatientById(id: string): Promise<Patient | null> {
    try {
      return await this.prisma.patient.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error('findPatientById failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient> {
    try {
      return await this.prisma.patient.update({ where: { id }, data: patientData });
    } catch (error) {
      this.logger.error('updatePatient failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  async deletePatient(id: string): Promise<Patient> {
    try {
      return await this.prisma.patient.delete({ where: { id } });
    } catch (error) {
      this.logger.error('deletePatient failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  // Visit operations
  async createVisit(visitData: any): Promise<Visit> {
    try {
      return await this.prisma.visit.create({ data: visitData });
    } catch (error) {
      this.logger.error('createVisit failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  async findVisitsByPatient(patientId: string): Promise<Visit[]> {
    try {
      return await this.prisma.visit.findMany({ where: { patientId } });
    } catch (error) {
      this.logger.error('findVisitsByPatient failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  async findVisitById(id: string): Promise<Visit | null> {
    try {
      return await this.prisma.visit.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error('findVisitById failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  async updateVisit(id: string, visitData: Partial<Visit>): Promise<Visit> {
    try {
      return await this.prisma.visit.update({ where: { id }, data: visitData });
    } catch (error) {
      this.logger.error('updateVisit failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  async deleteVisit(id: string): Promise<Visit> {
    try {
      return await this.prisma.visit.delete({ where: { id } });
    } catch (error) {
      this.logger.error('deleteVisit failed', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }

  // Raw query access for complex operations
  getClient() {
    return this.prisma;
  }

  // Transaction support
  async transaction<T>(callback: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(callback);
  }
}
