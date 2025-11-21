import { Injectable } from '@nestjs/common';
import * as otpGenerator from 'otp-generator';
import NodeCache from 'node-cache';

@Injectable()
export class OtpService {
  private otpCache: NodeCache;
  private readonly OTP_LENGTH = 6;
  private readonly OTP_TTL = 300; // 5 minutes in seconds

  constructor() {
    this.otpCache = new NodeCache({ stdTTL: this.OTP_TTL, checkperiod: 60 });
  }

  generateOtp(email: string): string {
    const otp = otpGenerator.generate(this.OTP_LENGTH, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Store OTP with email as key
    this.otpCache.set(email, otp);
    return otp;
  }

  verifyOtp(email: string, otp: string): boolean {
    const storedOtp = this.otpCache.get<string>(email);
    if (!storedOtp) return false;
    
    // Remove OTP after verification attempt (one-time use)
    this.otpCache.del(email);
    return storedOtp === otp;
  }
}
