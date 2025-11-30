import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from '@prisma/client';

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
    description: 'Start time',
    example: '2023-01-01T09:00:00.000Z'
  })
  startTime: Date;

  @ApiProperty({
    description: 'End time',
    example: '2023-01-01T17:00:00.000Z'
  })
  endTime: Date;

  @ApiProperty({
    description: 'Duration of each time slot in minutes',
    example: 30
  })
  slotDuration: number;

  @ApiProperty({
    description: 'Whether the schedule is active',
    example: true
  })
  isActive: boolean;

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
