import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserRole, Prisma } from "@prisma/client";
import { UserResponseDto } from "../users/dto/user-response.dto";
import {
  PaginationDto,
  PaginatedResponseDto,
} from "../common/dto/pagination.dto";

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  private mapToDoctorResponse(doctor: any): UserResponseDto {
    return {
      id: doctor.id,
      email: doctor.email,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      phone: doctor.phone,
      bio: doctor.bio,
      role: doctor.role,
      specialty: doctor.specialty,
      profileComplete: doctor.profileComplete,
      profilePhotoUrl: doctor.profilePhotoUrl,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    };
  }

  async findAll(
    paginationDto: PaginationDto
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const where: Prisma.UserWhereInput = { role: UserRole.DOCTOR };

    const [total, doctors] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: paginationDto.skip,
        take: paginationDto.limit,
      }),
    ]);

    const totalPages = Math.ceil(total / paginationDto.limit);

    const response: PaginatedResponseDto<UserResponseDto> = {
      items: doctors.map((doctor) => this.mapToDoctorResponse(doctor)),
      total,
      page: paginationDto.page,
      limit: paginationDto.limit,
      totalPages,
      hasNext: paginationDto.page < totalPages,
      hasPrevious: paginationDto.page > 1,
    };

    return response;
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const doctor = await this.prisma.user.findFirst({
      where: { id, role: UserRole.DOCTOR },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return this.mapToDoctorResponse(doctor);
  }
}

