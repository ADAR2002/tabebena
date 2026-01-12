import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { DayOfWeek, ScheduleEventType } from '@prisma/client';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Day of the week for the schedule',
    enum: DayOfWeek,
    example: 'MONDAY'
  })
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  dayOfWeek: DayOfWeek;

  @ApiProperty({
    description: 'Start time for the schedule (HH:mm format)',
    example: '09:00'
  })
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    description: 'End time for the schedule (HH:mm format)',
    example: '17:00'
  })
  @IsNotEmpty()
  endTime: string;

  @IsEnum(ScheduleEventType)
  @IsOptional()
  eventType?: ScheduleEventType;
}
