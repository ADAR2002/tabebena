import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleResponseDto } from './dto/schedule-response.dto';
import { DayOfWeek } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  private mapToResponse(schedule: any): ScheduleResponseDto {
    return {
      id: schedule.id,
      userId: schedule.userId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      slotDuration: schedule.slotDuration,
      isActive: schedule.isActive,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }

  private parseTimeToDateTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private validateTimeRange(startTime: string, endTime: string): void {
    const start = this.parseTimeToDateTime(startTime);
    const end = this.parseTimeToDateTime(endTime);
    
    if (end <= start) {
      throw new BadRequestException('endTime must be greater than startTime');
    }
  }

  async create(createScheduleDto: CreateScheduleDto, userId: string): Promise<ScheduleResponseDto> {
    this.validateTimeRange(createScheduleDto.startTime, createScheduleDto.endTime);

    const existingSchedule = await this.prisma.doctorSchedule.findFirst({
      where: {
        userId: userId,
        dayOfWeek: createScheduleDto.dayOfWeek,
      },
    });

    if (existingSchedule) {
      throw new ConflictException(`Schedule for ${createScheduleDto.dayOfWeek} already exists`);
    }

    const startTime = this.parseTimeToDateTime(createScheduleDto.startTime);
    const endTime = this.parseTimeToDateTime(createScheduleDto.endTime);

    const schedule = await this.prisma.doctorSchedule.create({
      data: {
        userId: userId,
        dayOfWeek: createScheduleDto.dayOfWeek,
        startTime: startTime,
        endTime: endTime,
        slotDuration: createScheduleDto.slotDuration,
        isActive: createScheduleDto.isActive ?? true,
      },
    });

    return this.mapToResponse(schedule);
  }

  async findAll(userId: string): Promise<ScheduleResponseDto[]> {
    const schedules = await this.prisma.doctorSchedule.findMany({
      where: { userId },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return schedules.map((schedule) => this.mapToResponse(schedule));
  }

  async findOne(id: string, userId: string): Promise<ScheduleResponseDto> {
    const schedule = await this.prisma.doctorSchedule.findFirst({
      where: { id, userId },
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return this.mapToResponse(schedule);
  }

  async update(
    id: string,
    updateScheduleDto: UpdateScheduleDto,
    userId: string,
  ): Promise<ScheduleResponseDto> {
    const existingSchedule = await this.findOne(id, userId);

    if (updateScheduleDto.dayOfWeek && updateScheduleDto.dayOfWeek !== existingSchedule.dayOfWeek) {
      const conflictSchedule = await this.prisma.doctorSchedule.findFirst({
        where: {
          userId: userId,
          dayOfWeek: updateScheduleDto.dayOfWeek,
          id: { not: id },
        },
      });

      if (conflictSchedule) {
        throw new ConflictException(`Schedule for ${updateScheduleDto.dayOfWeek} already exists`);
      }
    }

    const startTime = updateScheduleDto.startTime || existingSchedule.startTime.toTimeString().slice(0, 5);
    const endTime = updateScheduleDto.endTime || existingSchedule.endTime.toTimeString().slice(0, 5);
    
    if (updateScheduleDto.startTime || updateScheduleDto.endTime) {
      this.validateTimeRange(startTime, endTime);
    }

    const updateData: any = { ...updateScheduleDto };
    
    if (updateScheduleDto.startTime) {
      updateData.startTime = this.parseTimeToDateTime(updateScheduleDto.startTime);
    }
    
    if (updateScheduleDto.endTime) {
      updateData.endTime = this.parseTimeToDateTime(updateScheduleDto.endTime);
    }

    const updatedSchedule = await this.prisma.doctorSchedule.update({
      where: { id },
      data: updateData,
    });

    return this.mapToResponse(updatedSchedule);
  }

  async remove(id: string, userId: string): Promise<string> {
    await this.findOne(id, userId);

    await this.prisma.doctorSchedule.delete({
      where: { id },
    });

    return `Schedule with ID ${id} has been successfully deleted`;
  }

  async getScheduleByDay(dayOfWeek: DayOfWeek, userId: string): Promise<ScheduleResponseDto[]> {
    const schedules = await this.prisma.doctorSchedule.findMany({
      where: {
        userId: userId,
        dayOfWeek: dayOfWeek,
        isActive: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return schedules.map((schedule) => this.mapToResponse(schedule));
  }
}
