import {
  BadRequestException,
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
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} from "./constants";
import { UpdateDoctorProfileDto } from "./dto/update-doctor-profile.dto";
import { SupabaseService } from "src/supabase/supabase.service";
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private supabase: SupabaseService
  ) {}

  async signUp(
    registerCredentialsDto: RegisterCredentialsDto
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
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

    const refreshToken = this.generateRefreshToken(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken, user: user };
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async requestOtp(email: string) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException("User with this email already exists");
      }
      const data = await this.supabase.sendOtp(email);
      return { message: "OTP sent successfully" };
    } catch (error) {
      throw new BadRequestException(`Failed to send OTP: ${error.message}`);
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async verifyOtpAndCreateUser(
    verifyOtpDto: any,
    registerCredentialsDto: RegisterCredentialsDto
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const { email, otp } = verifyOtpDto;
    
    try {
      const data = await this.supabase.verifyOtp(email, otp);
      
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        throw new ConflictException("User with this email already exists");
      }

      // Create user in our database
      const { email: userEmail, password, firstName, lastName, phone, isDoctor, specialtyId } = registerCredentialsDto;
      
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      // Get specialty name if specialtyId is provided
      let specialty: string | null = null;
      if (isDoctor && specialtyId) {
        const specialtyRecord = await this.prisma.specialty.findUnique({
          where: { id: specialtyId },
        });
        specialty = specialtyRecord?.name || null;
      }

      const user = await this.prisma.user.create({
        data: {
          email: userEmail,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          role: isDoctor ? UserRole.DOCTOR : UserRole.PATIENT,
          specialty,
        },
      });
      // Create user in Supabase for future authentication
      const payload = { email: user.email, sub: user.id, role: user.role };
      const accessToken = this.jwtService.sign(payload, {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN,
      });

      const refreshToken = this.generateRefreshToken(user);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      return { accessToken, refreshToken, user };
    } catch (error) {
      throw new BadRequestException(`Failed to verify OTP and create user: ${error.message}`);
    }
  }

  async verifyOtp(email: string, token: string) {
    try {
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`Failed to verify OTP: ${error.message}`);
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async signIn(
    loginCredentialsDto: LoginCredentialsDto
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
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

    const refreshToken = this.generateRefreshToken(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken, user };
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
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async updateDoctorProfile(
    userId: string,
    updateProfileDto: UpdateDoctorProfileDto
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

    if (updateProfileDto.specialty) {
      updateData.specialty = updateProfileDto.specialty;
    }

    if (updateProfileDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateProfileDto.dateOfBirth);
    }

    if (updateProfileDto.gender) {
      updateData.gender = updateProfileDto.gender;
    }

    // Handle clinic location update
    if (updateProfileDto.clinicLocation) {
      const {
        address,
        city,
        latitude,
        longitude,
        region,
        clinicName,
        clinicPhone,
      } = updateProfileDto.clinicLocation;
      updateData.clinicLocation = {
        upsert: {
          create: {
            address,
            city,
            latitude,
            longitude,
            region,
            clinicName,
            clinicPhone,
          },
          update: {
            address,
            city,
            latitude,
            longitude,
            region,
            clinicName,
            clinicPhone,
          },
        },
      };
    }

    if (
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

    if (
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

    if (updateProfileDto.profilePhotoUrl) {
      updateData.profilePhotoUrl = updateProfileDto.profilePhotoUrl;
    }

    const hasBio = Boolean(updateProfileDto.bio ?? user.bio);
    const hasSpecialty = Boolean(updateProfileDto.specialty ?? user.specialty);
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
        clinicImages: true,
        clinicLocation: true,
      },
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload, {
      secret: JWT_REFRESH_SECRET,
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
  }

  async refreshTokens(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const payload = { email: user.email, sub: user.id, role: user.role };
      const accessToken = this.jwtService.sign(payload, {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN,
      });

      const newRefreshToken = this.generateRefreshToken(user);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return { accessToken, refreshToken: newRefreshToken, user };
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
