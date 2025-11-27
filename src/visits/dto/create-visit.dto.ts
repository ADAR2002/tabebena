import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVisitDto {
  @ApiProperty({
    description: 'The ID of the patient for the visit',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({
    description: 'The date and time of the visit',
    example: '2023-01-01T10:00:00.000Z'
  })
  @IsDateString()
  @IsNotEmpty()
  visitDate: Date;

  @ApiProperty({
    description: 'The reason for the visit',
    example: 'Routine checkup'
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({
    description: 'The diagnosis for the visit',
    example: 'Common cold'
  })
  @IsString()
  @IsOptional()
  diagnosis?: string;
  @ApiPropertyOptional({
    description: 'The treatment plan for the visit',
    example: 'Rest and drink plenty of fluids'
  })
  @IsString()
  @IsOptional()
  treatment?: string;

  @ApiPropertyOptional({
    description: 'Prescription details for the visit',
    example: 'Paracetamol 500mg every 6 hours'
  })
  @IsString()
  @IsOptional()
  prescription?: string;

  @ApiPropertyOptional({
    description: 'Vital signs recorded during the visit',
    example: 'BP: 120/80, HR: 72, Temp: 37°C'
  })
  @IsString()
  @IsOptional()
  vitalSigns?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the visit',
    example: 'Patient to follow up in 2 weeks'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Consultation fee for the visit',
    example: 100.50
  })
  @IsNumber()
  @IsNotEmpty()
  consultationFee: number;

  @ApiPropertyOptional({
    description: 'Amount paid for the visit',
    example: 100.50,
    default: 0
  })
  @IsNumber()
  @IsOptional()
  paidAmount: number = 0;
}