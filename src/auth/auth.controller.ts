import { Controller, Post, Body, UseGuards, Get, Request, UnauthorizedException, Patch, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ResponseInterceptor, ErrorInterceptor } from '../common/interceptors';
import { RequestOtpDto } from './dto/otp-request.dto';
import { LoginCredentialsDto, RegisterCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { 
  ApiTagsAuth, 
  VerifyOtpAndSignUpDoc, 
  SignUpDoc, 
  SignInDoc, 
  GetProfileDoc, 
  UpdateDoctorProfileDoc, 
  RequestOtpDoc
} from './decorators/swagger.decorators';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';


@ApiTagsAuth()
@UseInterceptors(ResponseInterceptor, ErrorInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('otp/request')
  @RequestOtpDoc()
  async requestOtp(@Body() body: RequestOtpDto) {
    return this.authService.requestOtp(body.email);
  }

  @Post('verify-otp')
  @VerifyOtpAndSignUpDoc()
  async verifyOtpAndSignUp(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Body('userDetails') userDetails: RegisterCredentialsDto
  ) {
    if (email !== userDetails.email) {
      throw new UnauthorizedException('Email in OTP verification does not match user details');
    }
    return this.authService.verifyOtpAndCreateUser(
      { email, otp },
      userDetails
    );
  }

  @Post('signup')
  @SignUpDoc()
  async signUp(@Body() registerCredentialsDto: RegisterCredentialsDto) {
    return this.authService.signUp(registerCredentialsDto);
  }

  @Post('signin')
  @SignInDoc()
  async login(@Body() authCredentialsDto: LoginCredentialsDto) {
    return this.authService.signIn(authCredentialsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @GetProfileDoc()
  async getUserProfile(@Request() req) {
    return this.authService.getUserProfile(req.user.userId);
  }

  @Patch('doctor/profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePhoto', maxCount: 1 },
      { name: 'certificates', maxCount: 10 },
      { name: 'clinicImages', maxCount: 10 },
    ])
  )
  @UpdateDoctorProfileDoc()
  
  async updateDoctorProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateDoctorProfileDto,
    @UploadedFiles() files: {
      profilePhoto?: File[];
      certificates?: File[];
      clinicImages?: File[];
    } = {}
  ) {
    return this.authService.updateDoctorProfile(
      req.user.userId,
      updateProfileDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('doctor/profile-complete')
  async setProfileComplete(
    @Request() req,
    @Body('profileComplete') profileComplete: boolean,
  ) {
    return this.authService.setDoctorProfileComplete(req.user.userId, profileComplete);
  }

  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }
}
