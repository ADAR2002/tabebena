"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const constants_1 = require("./constants");
const supabase_service_1 = require("../supabase/supabase.service");
let AuthService = class AuthService {
    jwtService;
    supabaseService;
    prisma;
    constructor(jwtService, supabaseService, prisma) {
        this.jwtService = jwtService;
        this.supabaseService = supabaseService;
        this.prisma = prisma;
    }
    async signUp(registerCredentialsDto) {
        const { email, password, firstName, lastName, phone, isDoctor } = registerCredentialsDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                role: isDoctor ? client_1.UserRole.DOCTOR : client_1.UserRole.PATIENT,
            },
        });
        const payload = { email: user.email, sub: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, {
            secret: constants_1.JWT_SECRET,
            expiresIn: constants_1.JWT_EXPIRES_IN,
        });
        return { accessToken, user: user };
    }
    async requestOtp(email) {
        try {
            await this.supabaseService.sendOtp(email);
            return { message: "OTP sent successfully" };
        }
        catch (error) {
            throw new Error(`Failed to send OTP: ${error.message}`);
        }
    }
    async verifyOtpAndCreateUser(verifyOtpDto, registerCredentialsDto) {
        const { email, otp } = verifyOtpDto;
        const { password, firstName, lastName, phone, isDoctor } = registerCredentialsDto;
        const { accessToken, user } = await this.verifyOtp(email, otp);
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const createdUser = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                role: isDoctor ? "DOCTOR" : "PATIENT",
            },
        });
        return { accessToken, user: createdUser };
    }
    async verifyOtp(email, token) {
        try {
            const { session } = await this.supabaseService.verifyOtp(email, token);
            if (!session) {
                throw new common_1.UnauthorizedException('Invalid or expired OTP');
            }
            const payload = {
                email: session.user.email,
                sub: session.user.id,
            };
            const accessToken = this.jwtService.sign(payload);
            return {
                accessToken,
                user: {
                    id: session.user.id,
                    email: session.user.email,
                },
            };
        }
        catch (error) {
            throw new Error(`OTP verification failed: ${error.message}`);
        }
    }
    async signIn(loginCredentialsDto) {
        const { email, password } = loginCredentialsDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, {
            secret: constants_1.JWT_SECRET,
            expiresIn: constants_1.JWT_EXPIRES_IN,
        });
        return { accessToken, user };
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async getUserProfile(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                specialty: true,
                certificates: {
                    orderBy: { createdAt: "desc" },
                },
                clinicImages: {
                    orderBy: { displayOrder: "asc" },
                },
            },
        });
    }
    async updateDoctorupdateDoctorProfileProfile(userId, updateProfileDto, files) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== client_1.UserRole.DOCTOR) {
            throw new common_1.UnauthorizedException("Only doctors can update profile");
        }
        const updateData = {};
        if (updateProfileDto.bio)
            updateData.bio = updateProfileDto.bio;
        if (updateProfileDto.consultationFee)
            updateData.consultationFee = updateProfileDto.consultationFee;
        if (updateProfileDto.experienceYears)
            updateData.experienceYears = updateProfileDto.experienceYears;
        if (updateProfileDto.specialtyId) {
            updateData.specialty = {
                connect: { id: updateProfileDto.specialtyId },
            };
        }
        if (files?.certificates && files.certificates.length > 0) {
            await this.prisma.certificate.deleteMany({ where: { userId } });
            updateData.certificates = {
                create: files.certificates.map((file) => ({
                    title: file.originalname,
                    institution: "Unknown Institution",
                    year: new Date().getFullYear(),
                    imageUrl: `certificates/${file.filename}`,
                })),
            };
        }
        else if (updateProfileDto.certificates &&
            updateProfileDto.certificates.length > 0) {
            await this.prisma.certificate.deleteMany({ where: { userId } });
            updateData.certificates = {
                create: updateProfileDto.certificates.map((url) => ({
                    title: url.split("/").pop() || "Certificate",
                    institution: "Unknown Institution",
                    year: new Date().getFullYear(),
                    imageUrl: url,
                })),
            };
        }
        if (files?.clinicImages && files.clinicImages.length > 0) {
            await this.prisma.clinicImage.deleteMany({ where: { userId } });
            updateData.clinicImages = {
                create: files.clinicImages.map((file) => ({
                    imageUrl: `clinic-images/${file.filename}`,
                    caption: file.originalname,
                    isPrimary: false,
                    displayOrder: 0,
                })),
            };
        }
        else if (updateProfileDto.clinicImages &&
            updateProfileDto.clinicImages.length > 0) {
            await this.prisma.clinicImage.deleteMany({ where: { userId } });
            updateData.clinicImages = {
                create: updateProfileDto.clinicImages.map((url) => ({
                    imageUrl: url,
                    caption: url.split("/").pop() || "Clinic Image",
                    isPrimary: false,
                    displayOrder: 0,
                })),
            };
        }
        if (files?.profilePhoto && files.profilePhoto.length > 0) {
            const file = files.profilePhoto[0];
            updateData.profilePhotoUrl = `profile-photos/${file.filename}`;
        }
        else if (updateProfileDto.profilePhotoUrl) {
            updateData.profilePhotoUrl = updateProfileDto.profilePhotoUrl;
        }
        const hasBio = updateProfileDto.bio || user.bio;
        const hasSpecialty = updateProfileDto.specialtyId || user.specialtyId;
        const hasConsultationFee = updateProfileDto.consultationFee || user.consultationFee;
        const hasExperienceYears = updateProfileDto.experienceYears || user.experienceYears;
        const hasProfilePhoto = updateData.profilePhotoUrl || user.profilePhotoUrl;
        if (hasBio &&
            hasSpecialty &&
            hasConsultationFee &&
            hasExperienceYears &&
            hasProfilePhoto) {
            updateData.profileComplete = true;
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: updateData,
            include: {
                certificates: true,
                specialty: true,
                clinicImages: true,
            },
        });
    }
    async setDoctorProfileComplete(userId, profileComplete) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== client_1.UserRole.DOCTOR) {
            throw new common_1.UnauthorizedException("Only doctors can update profile");
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: { profileComplete },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        supabase_service_1.SupabaseService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map