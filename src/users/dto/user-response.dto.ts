import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiProperty({ description: 'User phone number' })
  phone: string;

  @ApiProperty({ description: 'User bio', required: false })
  bio?: string;

  @ApiProperty({ enum: UserRole, description: 'User role' })
  role: UserRole;

  @ApiProperty({ description: 'User specialty', required: false })
  specialty?: string;

  @ApiProperty({ description: 'User profile completion status' })
  profileComplete: boolean;

  @ApiProperty({ description: 'User profile photo URL', required: false })
  profilePhotoUrl?: string;

  @ApiProperty({ description: 'Date when the user was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the user was last updated' })
  updatedAt: Date;
}
