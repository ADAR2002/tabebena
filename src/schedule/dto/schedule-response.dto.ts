import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek, ScheduleEventType } from '@prisma/client';

export class ScheduleResponseDto {
  @ApiProperty({
    description: 'Schedule ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'User ID (Doctor ID)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  userId: string;

  @ApiProperty({
    description: 'Day of the week',
    enum: DayOfWeek,
    example: 'MONDAY'
  })
  dayOfWeek: DayOfWeek;

  @ApiProperty({
    description: 'Start time in HH:mm',
    example: '08:00'
  })
  startTime: string;

  @ApiProperty({
    description: 'End time in HH:mm',
    example: '10:00'
  })
  endTime: string;

  @ApiProperty({
    description: 'Type of this interval',
    enum: ScheduleEventType,
    example: 'WORK'
  })
  eventType: ScheduleEventType;

  @ApiProperty({
    description: 'Is this interval a day off?',
    example: false
  })
  isDayOff: boolean;
  

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00.000Z'
  })
  updatedAt: Date;
}
