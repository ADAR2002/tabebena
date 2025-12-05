import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/otp-request.dto';
import { LoginCredentialsDto, RegisterCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    requestOtp(body: RequestOtpDto): Promise<{
        message: string;
    }>;
    verifyOtpAndSignUp(email: string, otp: string, userDetails: RegisterCredentialsDto): Promise<{
        accessToken: string;
        user: import("@prisma/client").User;
    }>;
    signUp(registerCredentialsDto: RegisterCredentialsDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("@prisma/client").User;
    }>;
    login(authCredentialsDto: LoginCredentialsDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("@prisma/client").User;
    }>;
    getUserProfile(req: any): Promise<({
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
    updateDoctorProfile(req: any, updateProfileDto: UpdateDoctorProfileDto, files?: {
        profilePhoto?: File[];
        certificates?: File[];
        clinicImages?: File[];
    }): Promise<{
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
    setProfileComplete(req: any, profileComplete: boolean): Promise<{
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
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("@prisma/client").User;
    }>;
    logout(req: any): Promise<void>;
}
