import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginCredentialsDto, RegisterCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "@prisma/client";
import { SupabaseService } from "../supabase/supabase.service";
import { UpdateDoctorProfileDto } from "./dto/update-doctor-profile.dto";
export declare class AuthService {
    private jwtService;
    private supabaseService;
    private prisma;
    constructor(jwtService: JwtService, supabaseService: SupabaseService, prisma: PrismaService);
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
        user: User;
    }>;
    verifyOtp(email: string, token: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string | undefined;
        };
    }>;
    signIn(loginCredentialsDto: LoginCredentialsDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }>;
    validateUser(email: string, password: string): Promise<any>;
    getUserProfile(userId: string): Promise<({
        certificates: {
            id: string;
            userId: string;
            createdAt: Date;
            year: number;
            title: string;
            institution: string;
            imageUrl: string;
        }[];
        clinicImages: {
            id: string;
            userId: string;
            createdAt: Date;
            displayOrder: number;
            imageUrl: string;
            caption: string | null;
            isPrimary: boolean;
        }[];
    } & {
        specialty: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        phone: string;
        consultationFee: number | null;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        refreshToken: string | null;
        profileComplete: boolean;
        experienceYears: number | null;
        profilePhotoUrl: string | null;
    }) | null>;
    updateDoctorProfile(userId: string, updateProfileDto: UpdateDoctorProfileDto): Promise<{
        clinicLocation: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            address: string;
            city: string;
            latitude: number;
            longitude: number;
            region: string | null;
            clinicName: string | null;
            clinicPhone: string | null;
        } | null;
        certificates: {
            id: string;
            userId: string;
            createdAt: Date;
            year: number;
            title: string;
            institution: string;
            imageUrl: string;
        }[];
        clinicImages: {
            id: string;
            userId: string;
            createdAt: Date;
            displayOrder: number;
            imageUrl: string;
            caption: string | null;
            isPrimary: boolean;
        }[];
    } & {
        specialty: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        phone: string;
        consultationFee: number | null;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        refreshToken: string | null;
        profileComplete: boolean;
        experienceYears: number | null;
        profilePhotoUrl: string | null;
    }>;
    setDoctorProfileComplete(userId: string, profileComplete: boolean): Promise<{
        specialty: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        phone: string;
        consultationFee: number | null;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        refreshToken: string | null;
        profileComplete: boolean;
        experienceYears: number | null;
        profilePhotoUrl: string | null;
    }>;
    private generateRefreshToken;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }>;
    logout(userId: string): Promise<void>;
}
