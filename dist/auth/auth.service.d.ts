import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginCredentialsDto, RegisterCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "@prisma/client";
import { UpdateDoctorProfileDto } from "./dto/update-doctor-profile.dto";
import { SupabaseService } from "src/supabase/supabase.service";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
export declare class AuthService {
    private jwtService;
    private prisma;
    private supabase;
    constructor(jwtService: JwtService, prisma: PrismaService, supabase: SupabaseService);
    signUp(registerCredentialsDto: RegisterCredentialsDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }>;
    requestOtp(email: string): Promise<{
        message: string;
    }>;
    verifyOtpAndCreateUser(verifyOtpDto: any, registerCredentialsDto: RegisterCredentialsDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }>;
    verifyOtp(email: string, token: string): Promise<{
        success: boolean;
    }>;
    signIn(loginCredentialsDto: LoginCredentialsDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }>;
    validateUser(email: string, password: string): Promise<any>;
    updateDoctorProfile(userId: string, updateProfileDto: UpdateDoctorProfileDto): Promise<{
        clinicLocation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            address: string;
            latitude: number;
            longitude: number;
            city: string;
            region: string | null;
            clinicName: string | null;
            clinicPhone: string | null;
        } | null;
        certificates: {
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            institution: string;
            year: number;
            imageUrl: string;
        }[];
        clinicImages: {
            id: string;
            createdAt: Date;
            userId: string;
            imageUrl: string;
            caption: string | null;
            isPrimary: boolean;
            displayOrder: number;
        }[];
    } & {
        email: string;
        phone: string;
        specialty: string | null;
        id: string;
        password: string;
        firstName: string;
        lastName: string;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        refreshToken: string | null;
        profileComplete: boolean;
        consultationFee: number | null;
        experienceYears: number | null;
        profilePhotoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private generateRefreshToken;
    refreshTokens(refreshToken: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }>;
    logout(userId: string): Promise<void>;
}
