import { IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestOtpDto {
  @ApiProperty({
    description: 'Email address to send OTP to',
    example: 'doctor@example.com',
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Must be true for doctor registration',
    example: true,
    default: true
  })
  @IsBoolean()
  isDoctor: boolean;
}
