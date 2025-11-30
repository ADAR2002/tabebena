import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Min, Max, IsOptional, ValidateIf } from 'class-validator';
import { DayOfWeek } from '@prisma/client';

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
    description: 'Duration of each time slot in minutes',
    example: 30,
    minimum: 10,
    maximum: 60
  })
  @IsNumber()
  @Min(10)
  @Max(60)
  @IsOptional()
  slotDuration?: number;

  @ApiPropertyOptional({
    description: 'Whether the schedule is active',
    example: true
  })
  @ValidateIf(o => o.isActive !== undefined)
  @IsOptional()
  isActive?: boolean;
}
