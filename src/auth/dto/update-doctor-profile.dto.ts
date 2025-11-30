import { IsOptional, IsString, IsArray, IsUrl, IsNumber, IsInt, Min, Max, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum GenderDto {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

class ClinicLocationDto {
  @ApiProperty({
    required: true,
    description: 'Clinic address',
    example: '123 Medical Center, Healthcare St.'
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    required: true,
    description: 'Clinic city',
    example: 'Riyadh'
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    required: true,
    description: 'Latitude coordinate of the clinic location',
    example: 24.7136
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    required: true,
    description: 'Longitude coordinate of the clinic location',
    example: 46.6753
  })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    required: false,
    description: 'Region / area of the clinic',
    example: 'Al Olaya'
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({
    required: false,
    description: 'Clinic name',
    example: 'Tabebena Clinic'
  })
  @IsOptional()
  @IsString()
  clinicName?: string;

  @ApiProperty({
    required: false,
    description: 'Clinic phone number',
    example: '+966500000000'
  })
  @IsOptional()
  @IsString()
  clinicPhone?: string;
}

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
    description: 'Name of the specialty',
    example: 'Cardiology'
  })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    required: false,
    description: 'Array of certificate image URLs',
    example: ['https://example.com/cert1.jpg', 'https://example.com/cert2.jpg']
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  certificates?: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    required: false,
    description: 'Array of clinic image URLs',
    example: ['https://example.com/clinic1.jpg', 'https://example.com/clinic2.jpg']
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  clinicImages?: string[];

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

  @ApiProperty({
    required: false,
    description: 'Clinic location details',
    type: ClinicLocationDto
  })
  @IsOptional()
  clinicLocation?: ClinicLocationDto;

  @ApiProperty({
    required: false,
    description: 'Date of birth of the doctor',
    example: '1985-05-10',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    required: false,
    description: 'Gender of the doctor',
    example: 'MALE',
    enum: GenderDto
  })
  @IsOptional()
  @IsEnum(GenderDto)
  gender?: GenderDto;
}
