import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/otp-request.dto';
import { LoginCredentialsDto, RegisterCredentialsDto } from './dto/auth-credentials.dto';
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
        user: import("@prisma/client").User;
    }>;
    login(authCredentialsDto: LoginCredentialsDto): Promise<{
        accessToken: string;
        user: import("@prisma/client").User;
    }>;
    getUserProfile(req: any): Promise<({
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
    updateDoctorProfile(req: any, updateProfileDto: UpdateDoctorProfileDto, files?: {
        profilePhoto?: File[];
        certificates?: File[];
        clinicImages?: File[];
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
    setProfileComplete(req: any, profileComplete: boolean): Promise<{
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
