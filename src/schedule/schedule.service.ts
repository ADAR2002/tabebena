import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";
import { ScheduleResponseDto } from "./dto/schedule-response.dto";
import { DayOfWeek, ScheduleEventType } from "@prisma/client";

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  private formatTime(date: Date): string {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  private mapToResponse(schedule: any): ScheduleResponseDto {
    return {
      id: schedule.id,
      userId: schedule.userId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: this.formatTime(schedule.startTime),
      endTime: this.formatTime(schedule.endTime),
      isDayOff: schedule.isDayOff,
      eventType: schedule.eventType,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }

  private parseTimeToDateTime(timeString: string): Date {
    const parts = timeString.split(":");
    const hours = Number(parts[0]);
    const minutes = parts.length > 1 ? Number(parts[1]) : 0;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private validateTimeRange(startTime: string, endTime: string): void {
    const start = this.parseTimeToDateTime(startTime);
    const end = this.parseTimeToDateTime(endTime);

    if (end <= start) {
      throw new BadRequestException("endTime must be greater than startTime");
    }
  }

  async create(
    createScheduleDto: CreateScheduleDto,
    userId: string
  ): Promise<ScheduleResponseDto> {
    this.validateTimeRange(
      createScheduleDto.startTime,
      createScheduleDto.endTime
    );

    const startTime = this.parseTimeToDateTime(createScheduleDto.startTime);
    const endTime = this.parseTimeToDateTime(createScheduleDto.endTime);

    const overlap = await this.prisma.doctorSchedule.findFirst({
      where: {
        userId,
        dayOfWeek: createScheduleDto.dayOfWeek,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });
    if (overlap) {
      throw new ConflictException(
        "Interval overlaps with an existing interval"
      );
    }
    let dayOff = false;

    const eventType = await this.prisma.doctorSchedule.findFirst({
      where: {
        userId: userId,
        dayOfWeek: createScheduleDto.dayOfWeek,
        isDayOff: true,
      },
    });
    if (eventType) {
      dayOff = true;
    }
    const schedule = await this.prisma.doctorSchedule.create({
      data: {
        userId: userId,
        dayOfWeek: createScheduleDto.dayOfWeek,
        startTime: startTime,
        endTime: endTime,
        isDayOff: dayOff,
        eventType: createScheduleDto.eventType ?? ScheduleEventType.WORK,
      },
    });

    return this.mapToResponse(schedule);
  }

  async findAll(userId: string): Promise<ScheduleResponseDto[]> {
    const schedules = await this.prisma.doctorSchedule.findMany({
      where: { userId},
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
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
    userId: string
  ): Promise<ScheduleResponseDto> {
    const existingSchedule = await this.findOne(id, userId);

    const targetDay = updateScheduleDto.dayOfWeek ?? existingSchedule.dayOfWeek;

    const startTime = updateScheduleDto.startTime || existingSchedule.startTime;
    const endTime = updateScheduleDto.endTime || existingSchedule.endTime;

    if (updateScheduleDto.startTime || updateScheduleDto.endTime) {
      this.validateTimeRange(startTime, endTime);
    }

    const updateData: any = { ...updateScheduleDto };

    if (updateScheduleDto.startTime) {
      updateData.startTime = this.parseTimeToDateTime(
        updateScheduleDto.startTime
      );
    }

    if (updateScheduleDto.endTime) {
      updateData.endTime = this.parseTimeToDateTime(updateScheduleDto.endTime);
    }

    const newStart: Date =
      updateData.startTime ??
      this.parseTimeToDateTime(existingSchedule.startTime);
    const newEnd: Date =
      updateData.endTime ?? this.parseTimeToDateTime(existingSchedule.endTime);
    const overlap = await this.prisma.doctorSchedule.findFirst({
      where: {
        userId,
        dayOfWeek: targetDay,
        id: { not: id },
        startTime: { lt: newEnd },
        endTime: { gt: newStart },
      },
    });
    if (overlap) {
      throw new ConflictException(
        "Updated interval overlaps with an existing interval"
      );
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

  async toggleDayOffForDay(
    targetUserId: string,
    dayOfWeek: DayOfWeek
  ): Promise<{
    userId: string;
    dayOfWeek: DayOfWeek;
    isDayOff: boolean;
    count: number;
  }> {
    const anyOff = await this.prisma.doctorSchedule.findFirst({
      where: { userId: targetUserId, dayOfWeek, isDayOff: true },
      select: { id: true },
    });
    const newState = !Boolean(anyOff);
    const result = await this.prisma.doctorSchedule.updateMany({
      where: { userId: targetUserId, dayOfWeek },
      data: { isDayOff: newState },
    });
    return {
      userId: targetUserId,
      dayOfWeek,
      isDayOff: newState,
      count: result.count,
    };
  }
}
