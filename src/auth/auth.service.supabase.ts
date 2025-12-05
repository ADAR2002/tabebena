import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { DatabaseService, User, UserRole } from "../database/database.service";
import {
  LoginCredentialsDto,
  RegisterCredentialsDto,
} from "./dto/auth-credentials.dto";
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from "./constants";
import { SupabaseService } from "../supabase/supabase.service";
import { UpdateDoctorProfileDto } from "./dto/update-doctor-profile.dto";

@Injectable()
export class AuthServiceSupabase {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
    private database: DatabaseService
  ) {}

  async signUp(
    registerCredentialsDto: RegisterCredentialsDto
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const { email, password, firstName, lastName, phone } =
      registerCredentialsDto;

    const existingUser = await this.database.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.database.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: UserRole.PATIENT,
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: JWT_EXPIRES_IN,
    });

    const refreshToken = this.generateRefreshToken(user);

    await this.database.updateUser(user.id, { refreshToken });

    return { accessToken, refreshToken, user: user };
  }

  async requestOtp(email: string) {
    try {
      await this.supabaseService.sendOtp(email);
      return { message: "OTP sent successfully" };
    } catch (error) {
      throw new Error(`Failed to send OTP: ${error.message}`);
    }
  }

  async verifyOtpAndCreateUser(
    verifyOtpDto: any,
    registerCredentialsDto: RegisterCredentialsDto
  ): Promise<{ accessToken: string; user: User }> {
    const { email, otp } = verifyOtpDto;
    const { password, firstName, lastName, phone } = registerCredentialsDto;

    await this.verifyOtp(email, otp);

    const existingUser = await this.database.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await this.database.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: UserRole.PATIENT,
    });

    // Generate JWT token for the created user
    const payload = { email: createdUser.email, sub: createdUser.id, role: createdUser.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: JWT_EXPIRES_IN,
    });

    return { accessToken, user: createdUser };
  }

  async signIn(
    loginCredentialsDto: LoginCredentialsDto
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const { email, password } = loginCredentialsDto;

    const user = await this.database.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: JWT_EXPIRES_IN,
    });

    const refreshToken = this.generateRefreshToken(user);

    await this.database.updateUser(user.id, { refreshToken });

    return { accessToken, refreshToken, user };
  }

  async verifyOtp(email: string, token: string) {
    try {
      const response = await this.supabaseService.verifyOtp(email, token);
      return response;
    } catch (error) {
      throw new Error(`OTP verification failed: ${error.message}`);
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: JWT_REFRESH_SECRET,
      });

      const user = await this.database.findUserById(payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const newAccessToken = this.jwtService.sign(
        { email: user.email, sub: user.id, role: user.role },
        {
          secret: JWT_SECRET,
          expiresIn: JWT_EXPIRES_IN,
        }
      );

      const newRefreshToken = this.generateRefreshToken(user);

      await this.database.updateUser(user.id, { refreshToken: newRefreshToken });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async updateDoctorProfile(
    userId: string,
    updateDoctorProfileDto: UpdateDoctorProfileDto
  ): Promise<User> {
    const {
      specialty,
      consultationFee,
      experienceYears,
      bio,
      profilePhotoUrl,
    } = updateDoctorProfileDto;

    const updatedUser = await this.database.updateUser(userId, {
      specialty,
      consultationFee,
      experienceYears,
      bio,
      profilePhotoUrl,
      profileComplete: true,
    });

    return updatedUser;
  }

  private generateRefreshToken(user: User): string {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload, {
      secret: JWT_REFRESH_SECRET,
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.database.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.database.findUserById(id);
  }
}
