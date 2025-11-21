import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional, Matches, IsUUID, IsBoolean } from 'class-validator';

export class LoginCredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterCredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
  phone: string;

  @IsOptional()
  @IsBoolean()
  isDoctor?: boolean = false;

  @IsOptional()
  @IsUUID()
  specialtyId?: string;
}
