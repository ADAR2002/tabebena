import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { VisitResponseDto } from './dto/visit-response.dto';

@Injectable()
export class VisitsService {
  constructor(private prisma: PrismaService) {}

  private mapToResponse(visit: any): VisitResponseDto {
    return {
      id: visit.id,
      patientId: visit.patientId,
      visitDate: visit.visitDate,
      reason: visit.reason,
      diagnosis: visit.diagnosis,
      treatment: visit.treatment,
      prescription: visit.prescription,
      vitalSigns: visit.vitalSigns,
      notes: visit.notes,
      consultationFee: visit.consultationFee,
      paidAmount: visit.paidAmount,
      createdAt: visit.createdAt,
      updatedAt: visit.updatedAt,
    };
  }

  async create(createVisitDto: CreateVisitDto): Promise<VisitResponseDto> {
    const visit = await this.prisma.visit.create({
      data: {
        patientId: createVisitDto.patientId,
        visitDate: createVisitDto.visitDate || new Date(),
        reason: createVisitDto.reason,
        diagnosis: createVisitDto.diagnosis,
        treatment: createVisitDto.treatment,
        prescription: createVisitDto.prescription,
        vitalSigns: createVisitDto.vitalSigns,
        notes: createVisitDto.notes,
        consultationFee: createVisitDto.consultationFee,
        paidAmount: createVisitDto.paidAmount || 0,
      },
    });

    return this.mapToResponse(visit);
  }

  async findAll(patientId?: string): Promise<VisitResponseDto[]> {
    const where = patientId ? { patientId } : {};
    const visits = await this.prisma.visit.findMany({
      where,
      orderBy: { visitDate: 'desc' },
    });

    return visits.map(visit => this.mapToResponse(visit));
  }

  async findOne(id: string): Promise<VisitResponseDto> {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
    });

    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }

    return this.mapToResponse(visit);
  }

  async update(
    id: string,
    updateVisitDto: UpdateVisitDto,
  ): Promise<VisitResponseDto> {
    // Check if visit exists
    await this.findOne(id);

    const updatedVisit = await this.prisma.visit.update({
      where: { id },
      data: updateVisitDto,
    });

    return this.mapToResponse(updatedVisit);
  }

  async remove(id: string): Promise<void> {
    // Check if visit exists
    await this.findOne(id);

    await this.prisma.visit.delete({
      where: { id },
    });
  }

  async getPatientVisits(phone: string): Promise<VisitResponseDto[]> {
    // First, find the patient by phone number
    const patient = await this.prisma.patient.findFirst({
      where: { phone },
      select: { id: true }
    });

    if (!patient) {
      return []; // Return empty array if no patient found with this phone
    }

    // Then find all visits for this patient
    const visits = await this.prisma.visit.findMany({
      where: { patientId: patient.id },
      orderBy: { visitDate: 'desc' },
    });

    return visits.map(visit => this.mapToResponse(visit));
  }
}
