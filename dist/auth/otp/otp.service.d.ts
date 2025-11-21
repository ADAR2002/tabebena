export declare class OtpService {
    private otpCache;
    private readonly OTP_LENGTH;
    private readonly OTP_TTL;
    constructor();
    generateOtp(email: string): string;
    verifyOtp(email: string, otp: string): boolean;
}
