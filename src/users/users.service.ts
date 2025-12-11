import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserRole, Prisma } from "@prisma/client";
import { UserResponseDto } from "./dto/user-response.dto";
import {
  PaginationDto,
  PaginatedResponseDto,
} from "../common/dto/pagination.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private mapToUserResponse(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      bio: user.bio,
      role: user.role,
      specialty: user.specialty,
      profileComplete: user.profileComplete,
      profilePhotoUrl: user.profilePhotoUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        certificates: {
          orderBy: { createdAt: "desc" },
        },
        clinicImages: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.mapToUserResponse(user);
  }

  async findAll(
    paginationDto: PaginationDto
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const where: Prisma.UserWhereInput = { role: UserRole.PATIENT };

    const [total, users] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        skip: paginationDto.skip,
        take: paginationDto.limit,
      }),
    ]);

    const totalPages = Math.ceil(total / paginationDto.limit);

    const response: PaginatedResponseDto<UserResponseDto> = {
      items: users.map((user) => this.mapToUserResponse(user)),
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
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapToUserResponse(user);
  }

  async removeOne(id: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    await this.prisma.user.delete({
      where: { id },
    });
    return "User removed successfully";
  }
}
