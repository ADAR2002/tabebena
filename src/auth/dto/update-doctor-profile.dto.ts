import { IsOptional, IsString, IsArray, IsUrl, IsNumber, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDoctorProfileDto {
  @ApiProperty({ 
    required: false, 
    description: 'Biography of the doctor',
    example: 'Experienced cardiologist with 10+ years of practice'
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ 
    required: false, 
    description: 'ID of the specialty',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
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

  @ApiProperty({ 
    required: false, 
    description: 'Consultation fee in local currency',
    example: 150.50,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  consultationFee?: number;

  @ApiProperty({ 
    required: false, 
    description: 'Years of experience',
    example: 5,
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  experienceYears?: number;

  @ApiProperty({ 
    required: false, 
    description: 'URL of the profile photo',
    example: 'https://example.com/profile.jpg'
  })
  @IsOptional()
  @IsUrl()
  profilePhotoUrl?: string;
}
