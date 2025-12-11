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
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("@prisma/client").User;
    }>;
    logout(req: any): Promise<void>;
}
