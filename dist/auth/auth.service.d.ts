import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginCredentialsDto, RegisterCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '@prisma/client';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { OtpService } from './otp/otp.service';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private otpService;
    private emailService;
    constructor(prisma: PrismaService, jwtService: JwtService, otpService: OtpService, emailService: EmailService);
    requestOtp(email: string, isDoctor: boolean): Promise<{
        message: string;
    }>;
    verifyOtpAndCreateUser(verifyOtpDto: any, registerCredentialsDto: RegisterCredentialsDto): Promise<{
        accessToken: string;
        user: User;
    }>;
    signUp(registerCredentialsDto: RegisterCredentialsDto): Promise<{
        accessToken: string;
        user: User;
    }>;
    signIn(loginCredentialsDto: LoginCredentialsDto): Promise<{
        accessToken: string;
        user: User;
    }>;
    validateUser(email: string, password: string): Promise<any>;
    getUserProfile(userId: string): Promise<({
        specialty: {
            id: string;
            createdAt: Date;
            name: string;
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
        specialtyId: string | null;
        bio: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        profileComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    updateDoctorupdateDoctorProfileProfile(userId: string, updateProfileDto: UpdateDoctorProfileDto, files?: {
        certificates?: any[];
        clinicImages?: any[];
    }): Promise<{
        specialty: {
            id: string;
            createdAt: Date;
            name: string;
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
        specialtyId: string | null;
        bio: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        profileComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
