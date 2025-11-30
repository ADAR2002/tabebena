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
            displayOrder: number;
            userId: string;
            imageUrl: string;
            caption: string | null;
            isPrimary: boolean;
        }[];
    } & {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        specialty: string | null;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        profileComplete: boolean;
        consultationFee: number | null;
        experienceYears: number | null;
        profilePhotoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
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
            displayOrder: number;
            userId: string;
            imageUrl: string;
            caption: string | null;
            isPrimary: boolean;
        }[];
    } & {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        specialty: string | null;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        profileComplete: boolean;
        consultationFee: number | null;
        experienceYears: number | null;
        profilePhotoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setProfileComplete(req: any, profileComplete: boolean): Promise<{
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        specialty: string | null;
        dateOfBirth: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        profileComplete: boolean;
        consultationFee: number | null;
        experienceYears: number | null;
        profilePhotoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
