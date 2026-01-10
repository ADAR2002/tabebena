import { ApiProperty } from '@nestjs/swagger';

export class VisitResponseDto {
  @ApiProperty({ description: 'Visit ID' })
  id: string;

  @ApiProperty({ description: 'Patient ID' })
  patientId: string;

  @ApiProperty({ description: 'Visit date' })
  visitDate: Date;

  @ApiProperty({ description: 'Reason for the visit', required: false })
  reason?: string;

  @ApiProperty({ description: 'Medical diagnosis', required: false })
  diagnosis?: string;

  @ApiProperty({ description: 'Treatment plan', required: false })
  treatment?: string;

  @ApiProperty({ description: 'Medical prescription', required: false })
  prescription?: string;

  @ApiProperty({ description: 'Vital signs', required: false })
  vitalSigns?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  notes?: string;

  @ApiProperty({ description: 'Consultation fee' })
  consultationFee: number;

  @ApiProperty({ description: 'Paid amount' })
  paidAmount: number;

  @ApiProperty({ description: 'Date of creation' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
