import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginCredentialsDto, RegisterCredentialsDto } from './dto/auth-credentials.dto';
import { User, UserRole } from '@prisma/client';
import { JWT_SECRET, JWT_EXPIRES_IN } from './constants';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { OtpService } from './otp/otp.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private emailService: EmailService,
  ) {}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async requestOtp(email: string, isDoctor: boolean): Promise<{ message: string }> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Generate and send OTP
    const otp = this.otpService.generateOtp(email);
    await this.emailService.sendOtpEmail(email, otp);

    return { message: 'OTP sent successfully' };
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async verifyOtpAndCreateUser(
    verifyOtpDto: any,
    registerCredentialsDto: RegisterCredentialsDto,
  ): Promise<{ accessToken: string, user: User}> {
    const { email, otp } = verifyOtpDto;
    const { password, firstName, lastName, phone, isDoctor } = registerCredentialsDto;

    // Verify OTP
    const isValidOtp = this.otpService.verifyOtp(email, otp);
    if (!isValidOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Check if user was created while OTP was valid
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: isDoctor ? 'DOCTOR' : 'PATIENT',
      },
    });

    // Generate JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user};
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Keep the original signUp method for non-doctor signups
  async signUp(
    registerCredentialsDto: RegisterCredentialsDto,
  ): Promise<{ accessToken: string, user: User }> {
    const { email, password, firstName, lastName, phone, isDoctor } = registerCredentialsDto;

    // For doctors, require OTP verification
    if (isDoctor) {
      throw new ConflictException('Doctors must use the OTP verification flow');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: 'PATIENT',
      },
    });

    // Generate JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async signIn(
    loginCredentialsDto: LoginCredentialsDto,
  ): Promise<{ accessToken: string, user: User }> {
    const { email, password } = loginCredentialsDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
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
          orderBy: { createdAt: 'desc' },
        },
        clinicImages: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  async updateDoctorupdateDoctorProfileProfile(
    userId: string,
    updateProfileDto: UpdateDoctorProfileDto,
    files?: { 
      certificates?: any[]; 
      clinicImages?: any[];
    },
  ) {
    // التحقق من أن المستخدم طبيب
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== UserRole.DOCTOR) {
      throw new UnauthorizedException('Only doctors can update profile');
    }

    // إعداد بيانات التحديث مع التحقق من الأنواع
    const updateData: any = {
      profileComplete: true,
    };

    // معالجة الحقول الاختيارية
    if (updateProfileDto.bio) updateData.bio = updateProfileDto.bio;
    if (updateProfileDto.consultationFee)
      updateData.consultationFee = updateProfileDto.consultationFee;
    if (updateProfileDto.experienceYears)
      updateData.experienceYears = updateProfileDto.experienceYears;

    // معالجة العلاقة مع التخصص
    if (updateProfileDto.specialtyId) {
      updateData.specialty = {
        connect: { id: updateProfileDto.specialtyId },
      };
    }

    // معالجة الشهادات (رفع ملفات أو روابط)
    if (files?.certificates && files.certificates.length > 0) {
      // حذف الشهادات الحالية أولاً
      await this.prisma.certificate.deleteMany({ where: { userId } });

      // إنشاء الشهادات الجديدة من الملفات المرفوعة
      updateData.certificates = {
        create: files.certificates.map((file) => ({
          title: file.originalname, // Use original filename as title
          institution: 'Unknown Institution', // Default value, can be updated later
          year: new Date().getFullYear(), // Default to current year
          imageUrl: `certificates/${file.filename}`,
        })),
      };
    } else if (
      updateProfileDto.certificates &&
      updateProfileDto.certificates.length > 0
    ) {
      // في حال تم إرسال روابط جاهزة بدلاً من رفع ملفات
      await this.prisma.certificate.deleteMany({ where: { userId } });
      updateData.certificates = {
        create: updateProfileDto.certificates.map((url) => ({
          title: url.split('/').pop() || 'Certificate', // Extract filename from URL or use default
          institution: 'Unknown Institution', // Default value, can be updated later
          year: new Date().getFullYear(), // Default to current year
          imageUrl: url,
        })),
      };
    }

    // Handle clinic images upload
    if (files?.clinicImages && files.clinicImages.length > 0) {
      // Delete existing clinic images first
      await this.prisma.clinicImage.deleteMany({ where: { userId } });

      // Add new clinic images from uploaded files
      updateData.clinicImages = {
        create: files.clinicImages.map((file) => ({
          imageUrl: `clinic-images/${file.filename}`,
          caption: file.originalname, // Use original filename as caption
          isPrimary: false, // Default to false, can be updated later
          displayOrder: 0 // Default display order
        })),
      };
    } else if (
      updateProfileDto.clinicImages &&
      updateProfileDto.clinicImages.length > 0
    ) {
      // If no files but URLs are provided
      await this.prisma.clinicImage.deleteMany({ where: { userId } });
      updateData.clinicImages = {
        create: updateProfileDto.clinicImages.map((url) => ({
          imageUrl: url,
          caption: url.split('/').pop() || 'Clinic Image',
          isPrimary: false,
          displayOrder: 0
        })),
      };
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
}
