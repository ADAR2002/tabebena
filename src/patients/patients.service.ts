import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { Patient } from "./entities/patient.entity";
import { PaginatedResult } from "../common/interfaces/paginated-result.interface";

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(
    doctorId: string,
    createPatientDto: CreatePatientDto
  ): Promise<Patient> {
    return this.prisma.patient.create({
      data: {
        ...createPatientDto,
        doctorUserId: doctorId,
      },
    });
  }

  async findAll(
    doctorId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResult<Patient>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where: { doctorUserId: doctorId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.patient.count({ where: { doctorUserId: doctorId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(phone: string, doctorId: string): Promise<Patient> {
    const patient = await this.prisma.patient.findFirst({
      where: {
        phone: phone,
        doctorUserId: doctorId,
      },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with phone ${phone} not found`);
    }

    return patient;
  }

  async update(
    phone: string,
    doctorId: string,
    updatePatientDto: UpdatePatientDto
  ): Promise<Patient> {
    // First find the patient to get the ID
    const patient = await this.findOne(phone, doctorId);

    return this.prisma.patient.update({
      where: { id: patient.id, doctorUserId: doctorId },
      data: updatePatientDto,
    });
  }

  async remove(phone: string, doctorId: string): Promise<void> {
    // First find the patient to get the ID
    const patient = await this.findOne(phone, doctorId);

    await this.prisma.patient.delete({
      where: { id: patient.id, doctorUserId: doctorId },
    });
  }

  async search(doctorId: string, query: string): Promise<Patient[]> {
    return this.prisma.patient.findMany({
      where: {
        doctorUserId: doctorId,
        OR: [{ fullName: { contains: query } }, { phone: { contains: query } }],
      },
    });
  }
}
