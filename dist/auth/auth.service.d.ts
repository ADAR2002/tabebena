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
        user: User;
    }>;
    validateUser(email: string, password: string): Promise<any>;
    getUserProfile(userId: string): Promise<({
        specialty: {
            name: string;
            id: string;
            createdAt: Date;
            icon: string | null;
        } | null;
        certificates: {
            title: string;
            id: string;
            createdAt: Date;
            year: number;
            userId: string;
            institution: string;
            imageUrl: string;
        }[];
        clinicImages: {
            id: string;
            createdAt: Date;
            displayOrder: number;
            userId: string;
            imageUrl: string;
            caption: string | null;
            isPrimary: boolean;
        }[];
    } & {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        bio: string | null;
        specialtyId: string | null;
        consultationFee: number | null;
        experienceYears: number | null;
        profilePhotoUrl: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        profileComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    updateDoctorProfile(userId: string, updateProfileDto: UpdateDoctorProfileDto, files?: {
        certificates?: any[];
        clinicImages?: any[];
        profilePhoto?: any[];
    }): Promise<{
        specialty: {
            name: string;
            id: string;
            createdAt: Date;
            icon: string | null;
        } | null;
        certificates: {
            title: string;
            id: string;
            createdAt: Date;
            year: number;
            userId: string;
            institution: string;
            imageUrl: string;
        }[];
        clinicImages: {
            id: string;
            createdAt: Date;
            displayOrder: number;
            userId: string;
            imageUrl: string;
            caption: string | null;
            isPrimary: boolean;
        }[];
    } & {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        bio: string | null;
        specialtyId: string | null;
        consultationFee: number | null;
        experienceYears: number | null;
        profilePhotoUrl: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        profileComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setDoctorProfileComplete(userId: string, profileComplete: boolean): Promise<{
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        bio: string | null;
        specialtyId: string | null;
        consultationFee: number | null;
        experienceYears: number | null;
        profilePhotoUrl: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        profileComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
