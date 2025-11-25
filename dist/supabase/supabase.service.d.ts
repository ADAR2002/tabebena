import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import type { EmailOtpType } from '@supabase/supabase-js';
export declare class SendOtpDto {
    email: string;
}
export declare class VerifyOtpDto {
    email: string;
    token: string;
    type?: string;
}
export declare class SupabaseService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private supabase;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    sendOtp(email: string): Promise<{
        user: null;
        session: null;
        messageId?: string | null;
    }>;
    verifyOtp(email: string, token: string, type?: EmailOtpType): Promise<{
        user: import("@supabase/supabase-js").AuthUser | null;
        session: import("@supabase/supabase-js").AuthSession | null;
    }>;
    getClient(): SupabaseClient<any, "public", "public", any, any>;
}
