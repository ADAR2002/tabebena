import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateVisitDto } from './create-visit.dto';

export class UpdateVisitDto extends PartialType(CreateVisitDto) {
  @ApiPropertyOptional({
    description: 'The date and time of the visit',
    example: '2023-01-01T10:00:00.000Z'
  })
  visitDate?: Date;

  @ApiPropertyOptional({
    description: 'The reason for the visit',
    example: 'Follow-up appointment'
  })
  reason?: string;

  @ApiPropertyOptional({
    description: 'The diagnosis for the visit',
    example: 'Common cold'
  })
  diagnosis?: string;

  @ApiPropertyOptional({
    description: 'The treatment plan for the visit',
    example: 'Rest and drink plenty of fluids'
  })
  treatment?: string;

  @ApiPropertyOptional({
    description: 'Prescription details for the visit',
    example: 'Paracetamol 500mg every 6 hours'
  })
  prescription?: string;

  @ApiPropertyOptional({
    description: 'Vital signs recorded during the visit',
    example: 'BP: 120/80, HR: 72, Temp: 37°C'
  })
  vitalSigns?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the visit',
    example: 'Patient to follow up in 2 weeks'
  })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Consultation fee for the visit',
    example: 100.50
  })
  consultationFee?: number;

  @ApiPropertyOptional({
    description: 'Amount paid for the visit',
    example: 100.50
  })
  paidAmount?: number;
}
