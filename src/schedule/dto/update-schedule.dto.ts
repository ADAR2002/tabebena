import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { DayOfWeek, ScheduleEventType } from '@prisma/client';

export class UpdateScheduleDto {
  @ApiPropertyOptional({
    description: 'Day of the week for the schedule',
    enum: DayOfWeek,
    example: 'MONDAY'
  })
  @IsEnum(DayOfWeek)
  @IsOptional()
  dayOfWeek?: DayOfWeek;

  @ApiPropertyOptional({
    description: 'Start time for the schedule (HH:mm format)',
    example: '09:00'
  })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({
    description: 'End time for the schedule (HH:mm format)',
    example: '17:00'
  })
  @IsString()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({
    description: 'Event type for the interval',
    enum: ScheduleEventType,
    example: 'WORK'
  })
  @IsEnum(ScheduleEventType)
  @IsOptional()
  eventType?: ScheduleEventType;
}
