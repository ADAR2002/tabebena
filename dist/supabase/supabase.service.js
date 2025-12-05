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
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const swagger_1 = require("@nestjs/swagger");
const verify_otp_response_dto_1 = require("./dto/verify_otp_response.dto");
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
    async create(table, data) {
        return this.supabase.from(table).insert(data).select().single();
    }
    async findById(table, id) {
        return this.supabase.from(table).select('*').eq('id', id).single();
    }
    async findOne(table, query) {
        let qb = this.supabase.from(table).select('*');
        Object.entries(query).forEach(([key, value]) => {
            qb = qb.eq(key, value);
        });
        return qb.single();
    }
    async findMany(table, query) {
        let qb = this.supabase.from(table).select('*');
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                qb = qb.eq(key, value);
            });
        }
        return qb;
    }
    async update(table, id, data) {
        return this.supabase.from(table).update(data).eq('id', id).select().single();
    }
    async delete(table, id) {
        return this.supabase.from(table).delete().eq('id', id).select().single();
    }
    async transaction(callback) {
        return callback(this.supabase);
    }
};
exports.SupabaseService = SupabaseService;
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OTP sent successfully',
        type: verify_otp_response_dto_1.VerifyOtpResponseDto
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
        type: verify_otp_response_dto_1.VerifyOtpResponseDto
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