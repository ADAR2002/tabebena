import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum, IsDateString, Min, Max, ValidateIf } from 'class-validator';
import { DayOfWeek } from '@prisma/client';

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

  @ApiProperty({
    description: 'Duration of each time slot in minutes',
    example: 30,
    minimum: 10,
    maximum: 60
  })
  @IsNumber()
  @Min(10)
  @Max(60)
  @IsNotEmpty()
  slotDuration: number;

  @ApiProperty({
    description: 'Whether the schedule is active',
    example: true,
    required: false
  })
  @ValidateIf(o => o.isActive !== undefined)
  isActive?: boolean;
}
