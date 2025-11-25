import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/otp-request.dto';
import { LoginCredentialsDto, RegisterCredentialsDto } from './dto/auth-credentials.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    requestOtp(body: RequestOtpDto): Promise<{
        message: string;
    }>;
    verifyOtpAndSignUp(email: string, token: string, otp: string, userDetails: RegisterCredentialsDto): Promise<{
        accessToken: string;
        user: import("@prisma/client").User;
    }>;
    signUp(registerCredentialsDto: RegisterCredentialsDto): Promise<{
        accessToken: string;
        user: import("@prisma/client").User;
    }>;
    login(authCredentialsDto: LoginCredentialsDto): Promise<{
        accessToken: string;
        user: import("@prisma/client").User;
    }>;
    getProfile(req: any): Promise<({
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
        phone: string;
        id: string;
        password: string;
        firstName: string;
        lastName: string;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        specialtyId: string | null;
        profileComplete: boolean;
        consultationFee: number | null;
        experienceYears: number | null;
        profilePhotoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    setProfileComplete(req: any, profileComplete: boolean): Promise<{
        email: string;
        phone: string;
        id: string;
        password: string;
        firstName: string;
        lastName: string;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        specialtyId: string | null;
        profileComplete: boolean;
        consultationFee: number | null;
        experienceYears: number | null;
        profilePhotoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
