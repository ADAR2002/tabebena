import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { EmailOtpType } from '@supabase/supabase-js';
import {ApiResponse } from '@nestjs/swagger';
import { VerifyOtpResponseDto } from './dto/verify_otp_response.dto';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required Supabase configuration. Please check your environment variables.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async onModuleInit() {
    try {
      // Test the connection
      const { error } = await this.supabase.from('health_check').select('*').limit(1);
      if (error) {
        this.logger.warn(`Supabase connection warning: ${error.message}`);
      } else {
        this.logger.log('Successfully connected to Supabase');
      }
    } catch (error) {
      this.logger.error('Failed to connect to Supabase:', error);
      throw error;
    }
  }

  @ApiResponse({ 
    status: 200, 
    description: 'OTP sent successfully',
    type: VerifyOtpResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email or missing required fields'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  async sendOtp(email: string) {
    this.logger.log(`Sending OTP to ${email}`);
    const { data, error } = await this.supabase.auth.signInWithOtp({
      email,
      // No redirect URL: we rely on a 6-digit code the user types in, not a magic link
      options: {
        shouldCreateUser: true,
      },
    });
    
    if (error) {
      this.logger.error(`Failed to send OTP to ${email}: ${error.message}`);
      throw new Error(error.message);
    }
    
    this.logger.log(`OTP sent successfully to ${email}`);
    return data;
  }

  @ApiResponse({ 
    status: 200, 
    description: 'OTP verified successfully',
    type: VerifyOtpResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or expired token'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  async verifyOtp(email: string, token: string, type: EmailOtpType = 'email') {
    this.logger.log(`Verifying OTP for ${email}`);
    const { data, error } = await this.supabase.auth.verifyOtp({
      email,
      token,
      type,
    });

    if (error) {
      this.logger.error(`OTP verification failed for ${email}: ${error.message}`);
      throw new Error(error.message);
    }
    
    this.logger.log(`OTP verified successfully for ${email}`);
    return data;
  }

  getClient() {
    return this.supabase;
  }
}
