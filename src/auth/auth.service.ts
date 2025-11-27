import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import {
  LoginCredentialsDto,
  RegisterCredentialsDto,
} from "./dto/auth-credentials.dto";
import { User, UserRole } from "@prisma/client";
import { JWT_SECRET, JWT_EXPIRES_IN } from "./constants";
import { SupabaseService } from "../supabase/supabase.service";
import { UpdateDoctorProfileDto } from "./dto/update-doctor-profile.dto";
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
    private prisma: PrismaService
  ) {}

  async signUp(
    registerCredentialsDto: RegisterCredentialsDto
  ): Promise<{ accessToken: string; user: User }> {
    const { email, password, firstName, lastName, phone } =
      registerCredentialsDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
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
        role: UserRole.PATIENT,
      },
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: JWT_EXPIRES_IN,
    });

    return { accessToken, user: user };
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async requestOtp(email: string) {
    try {
      await this.supabaseService.sendOtp(email);
      return { message: "OTP sent successfully" };
    } catch (error) {
      throw new Error(`Failed to send OTP: ${error.message}`);
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async verifyOtpAndCreateUser(
    verifyOtpDto: any,
    registerCredentialsDto: RegisterCredentialsDto
  ): Promise<{ accessToken: string; user: User }> {
    const { email, otp } = verifyOtpDto;
    const { password, firstName, lastName, phone } = registerCredentialsDto;

    const { accessToken, user } = await this.verifyOtp(email, otp);

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
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
        role: UserRole.DOCTOR,
      },
    });

    return { accessToken, user: createdUser };
  }

  async verifyOtp(email: string, token: string) {
    try {
      const { session } = await this.supabaseService.verifyOtp(email, token);

      if (!session) {
        throw new UnauthorizedException("Invalid or expired OTP");
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
    } catch (error) {
      throw new Error(`OTP verification failed: ${error.message}`);
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async signIn(
    loginCredentialsDto: LoginCredentialsDto
  ): Promise<{ accessToken: string; user: User }> {
    const { email, password } = loginCredentialsDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: JWT_EXPIRES_IN,
    });

    return { accessToken, user };
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getUserProfile(userId: string) {
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

  async updateDoctorProfile(
    userId: string,
    updateProfileDto: UpdateDoctorProfileDto,
    files?: {
      certificates?: any[];
      clinicImages?: any[];
      profilePhoto?: any[];
    }
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== UserRole.DOCTOR) {
      throw new UnauthorizedException("Only doctors can update profile");
    }

    const updateData: any = {};

    if (updateProfileDto.bio) updateData.bio = updateProfileDto.bio;
    if (updateProfileDto.consultationFee !== undefined)
      updateData.consultationFee = updateProfileDto.consultationFee;
    if (updateProfileDto.experienceYears !== undefined)
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
          title: file.originalname, // Use original filename as title
          institution: "Unknown Institution", // Default value, can be updated later
          year: new Date().getFullYear(), // Default to current year
          imageUrl: `certificates/${file.filename}`,
        })),
      };
    } else if (
      updateProfileDto.certificates &&
      updateProfileDto.certificates.length > 0
    ) {
      await this.prisma.certificate.deleteMany({ where: { userId } });
      updateData.certificates = {
        create: updateProfileDto.certificates.map((url) => ({
          title: url.split("/").pop() || "Certificate", // Extract filename from URL or use default
          institution: "Unknown Institution", // Default value, can be updated later
          year: new Date().getFullYear(), // Default to current year
          imageUrl: url,
        })),
      };
    }

    if (files?.clinicImages && files.clinicImages.length > 0) {
      await this.prisma.clinicImage.deleteMany({ where: { userId } });

      updateData.clinicImages = {
        create: files.clinicImages.map((file) => ({
          imageUrl: `clinic-images/${file.filename}`,
          caption: file.originalname, // Use original filename as caption
          isPrimary: false, // Default to false, can be updated later
          displayOrder: 0, // Default display order
        })),
      };
    } else if (
      updateProfileDto.clinicImages &&
      updateProfileDto.clinicImages.length > 0
    ) {
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
    } else if (updateProfileDto.profilePhotoUrl) {
      updateData.profilePhotoUrl = updateProfileDto.profilePhotoUrl;
    }

    const hasBio = Boolean(updateProfileDto.bio ?? user.bio);
    const hasSpecialty = Boolean(
      updateProfileDto.specialtyId ?? user.specialtyId
    );
    const hasConsultationFee =
      updateProfileDto.consultationFee !== undefined ||
      (user.consultationFee !== null && user.consultationFee !== undefined);
    const hasExperienceYears =
      updateProfileDto.experienceYears !== undefined ||
      (user.experienceYears !== null && user.experienceYears !== undefined);
    const hasProfilePhoto = Boolean(
      updateData.profilePhotoUrl ?? (user as any).profilePhotoUrl
    );

    if (
      hasBio &&
      hasSpecialty &&
      hasConsultationFee &&
      hasExperienceYears &&
      hasProfilePhoto
    ) {
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

  async setDoctorProfileComplete(userId: string, profileComplete: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== UserRole.DOCTOR) {
      throw new UnauthorizedException("Only doctors can update profile");
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { profileComplete },
    });
  }
}
