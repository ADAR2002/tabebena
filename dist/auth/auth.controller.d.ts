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
        refreshToken: string;
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
    updateDoctorProfile(req: any, updateProfileDto: UpdateDoctorProfileDto, files?: {
        profilePhoto?: File[];
        certificates?: File[];
        clinicImages?: File[];
    }): Promise<{
        certificates: {
            title: string;
            id: string;
            institution: string;
            year: number;
            imageUrl: string;
            createdAt: Date;
            userId: string;
        }[];
        clinicImages: {
            id: string;
            imageUrl: string;
            caption: string | null;
            isPrimary: boolean;
            displayOrder: number;
            createdAt: Date;
            userId: string;
        }[];
        clinicLocation: {
            id: string;
            address: string;
            city: string;
            latitude: number;
            longitude: number;
            region: string | null;
            clinicName: string | null;
            clinicPhone: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        } | null;
    } & {
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        profileComplete: boolean;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        profilePhotoUrl: string | null;
        bio: string | null;
        specialty: string | null;
        consultationFee: number | null;
        experienceYears: number | null;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        refreshToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("@prisma/client").User;
    }>;
    logout(req: any): Promise<void>;
}
