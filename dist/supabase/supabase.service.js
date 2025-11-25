"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SupabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = exports.VerifyOtpDto = exports.SendOtpDto = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const swagger_1 = require("@nestjs/swagger");
class VerifyOtpResponseDto {
    access_token;
    token_type;
    expires_in;
    refresh_token;
    user;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Access token for the authenticated session',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }),
    __metadata("design:type", String)
], VerifyOtpResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of the token',
        example: 'bearer'
    }),
    __metadata("design:type", String)
], VerifyOtpResponseDto.prototype, "token_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Expiration time of the token in seconds',
        example: 3600
    }),
    __metadata("design:type", Number)
], VerifyOtpResponseDto.prototype, "expires_in", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Refresh token for getting new access tokens',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        required: false
    }),
    __metadata("design:type", String)
], VerifyOtpResponseDto.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
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
    }),
    __metadata("design:type", Object)
], VerifyOtpResponseDto.prototype, "user", void 0);
class SendOtpDto {
    email;
}
exports.SendOtpDto = SendOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'user@example.com',
        required: true
    }),
    __metadata("design:type", String)
], SendOtpDto.prototype, "email", void 0);
class VerifyOtpDto {
    email;
    token;
    type;
}
exports.VerifyOtpDto = VerifyOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'user@example.com',
        required: true
    }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'OTP token received via email',
        example: '123456',
        required: true
    }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of OTP verification',
        enum: ['signup', 'invite', 'magiclink', 'recovery', 'email_change'],
        default: 'signup',
        required: false
    }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "type", void 0);
let SupabaseService = SupabaseService_1 = class SupabaseService {
    configService;
    logger = new common_1.Logger(SupabaseService_1.name);
    supabase;
    constructor(configService) {
        this.configService = configService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_ANON_KEY');
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing required Supabase configuration. Please check your environment variables.');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async onModuleInit() {
        try {
            const { error } = await this.supabase.from('health_check').select('*').limit(1);
            if (error) {
                this.logger.warn(`Supabase connection warning: ${error.message}`);
            }
            else {
                this.logger.log('Successfully connected to Supabase');
            }
        }
        catch (error) {
            this.logger.error('Failed to connect to Supabase:', error);
            throw error;
        }
    }
    async sendOtp(email) {
        this.logger.log(`Sending OTP to ${email}`);
        const { data, error } = await this.supabase.auth.signInWithOtp({
            email,
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
    async verifyOtp(email, token, type = 'email') {
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
};
exports.SupabaseService = SupabaseService;
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OTP sent successfully',
        type: VerifyOtpResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid email or missing required fields'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupabaseService.prototype, "sendOtp", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OTP verified successfully',
        type: VerifyOtpResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid OTP or expired token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SupabaseService.prototype, "verifyOtp", null);
exports.SupabaseService = SupabaseService = SupabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map