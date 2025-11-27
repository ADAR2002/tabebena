import { ApiProperty} from '@nestjs/swagger';

export class VerifyOtpResponseDto {
  @ApiProperty({
    description: 'Access token for the authenticated session',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  access_token: string;

  @ApiProperty({
    description: 'Type of the token',
    example: 'bearer'
  })
  token_type: string;

  @ApiProperty({
    description: 'Expiration time of the token in seconds',
    example: 3600
  })
  expires_in: number;

  @ApiProperty({
    description: 'Refresh token for getting new access tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false
  })
  refresh_token?: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'user@example.com',
      email_confirmed_at: '2025-11-25T10:00:00Z',
      phone: '',
      last_sign_in_at: '2025-11-25T10:00:00Z',
      app_metadata: { provider: 'email' },
      user_metadata: {},
      created_at: '2025-11-25T09:00:00Z',
      updated_at: '2025-11-25T10:00:00Z'
    }
  })
  user: any;
}