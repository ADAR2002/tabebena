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
  @IsOptional()
  visitDate?: Date;

  @ApiProperty({
    description: 'Reason for the visit',
    example: 'Regular checkup'
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({
    description: 'Diagnosis',
    example: 'Common cold'
  })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiProperty({
    description: 'Treatment plan',
    example: 'Rest and hydration'
  })
  @IsString()
  @IsOptional()
  treatment?: string;

  @ApiProperty({
    description: 'Prescription details',
    example: 'Take medicine X for 5 days'
  })
  @IsString()
  @IsOptional()
  prescription?: string;

  @ApiProperty({
    description: 'Vital signs',
    example: 'BP: 120/80, Temp: 98.6°F'
  })
  @IsString()
  @IsOptional()
  vitalSigns?: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Patient should return in 2 weeks'
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Consultation fee',
    example: 100.50
  })
  @IsNumber()
  @IsOptional()
  consultationFee?: number;

  @ApiProperty({
    description: 'Amount paid by the patient',
    example: 100.50
  })
  @IsNumber()
  @IsOptional()
  paidAmount?: number;
}