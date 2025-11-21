import { IsOptional, IsString, IsArray, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDoctorProfileDto {
  @ApiProperty({ required: false, description: 'Biography of the doctor' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false, description: 'ID of the specialty' })
  @IsOptional()
  @IsString()
  specialtyId?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: 'Certificate files to upload (PDF, PNG, JPG)'
  })
  @IsOptional()
  certificates?: any[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: 'Clinic images to upload (PNG, JPG)'
  })
  @IsOptional()
  clinicImages?: any[];

  @ApiProperty({ required: false, description: 'Consultation fee' })
  @IsOptional()
  @IsString()
  consultationFee?: string;

  @ApiProperty({ required: false, description: 'Years of experience' })
  @IsOptional()
  @IsString()
  experienceYears?: string;
}
