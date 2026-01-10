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
    paginationDto: PaginationDto,
    specialty?: string,
    name?: string
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const orName: Prisma.UserWhereInput[] = [];
    if (name) {
      orName.push({ firstName: { contains: name } });
      orName.push({ lastName: { contains: name } });
    }

    const where: Prisma.UserWhereInput = {
      role: UserRole.DOCTOR,
      ...(specialty ? { specialty: { contains: specialty } } : {}),
      ...(orName.length ? { OR: orName } : {}),
    };

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

  async getOpenCount(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return { openCount: (user as any)?.openCount ?? 0 };
  }

  async incrementOpenCount(userId: string) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: ({ openCount: { increment: 1 } } as any),
    });
    return { openCount: (updated as any).openCount ?? 0 };
  }
}

