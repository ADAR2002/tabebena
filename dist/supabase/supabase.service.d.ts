import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import type { EmailOtpType, PostgrestError } from '@supabase/supabase-js';
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
    create<T>(table: string, data: Partial<T>): Promise<{
        data: T | null;
        error: PostgrestError | null;
    }>;
    findById<T>(table: string, id: string): Promise<{
        data: T | null;
        error: PostgrestError | null;
    }>;
    findOne<T>(table: string, query: Record<string, any>): Promise<{
        data: T | null;
        error: PostgrestError | null;
    }>;
    findMany<T>(table: string, query?: Record<string, any>): Promise<{
        data: T[] | null;
        error: PostgrestError | null;
    }>;
    update<T>(table: string, id: string, data: Partial<T>): Promise<{
        data: T | null;
        error: PostgrestError | null;
    }>;
    delete<T>(table: string, id: string): Promise<{
        data: T | null;
        error: PostgrestError | null;
    }>;
    transaction<T>(callback: (supabase: SupabaseClient) => Promise<T>): Promise<T>;
}
