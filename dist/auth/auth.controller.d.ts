import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/otp-request.dto';
import { LoginCredentialsDto, RegisterCredentialsDto } from './dto/auth-credentials.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    requestOtp(requestOtpDto: RequestOtpDto): Promise<{
        message: string;
    }>;
    verifyOtpAndSignUp(email: string, otp: string, userDetails: RegisterCredentialsDto): Promise<{
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
}
