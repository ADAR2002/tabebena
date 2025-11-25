import { Controller, Post, Body, UseGuards, Get, Request, UnauthorizedException, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestOtpDto } from './dto/otp-request.dto';
import { LoginCredentialsDto, RegisterCredentialsDto } from './dto/auth-credentials.dto';
import { 
  ApiTagsAuth, 
  RequestOtpDoc, 
  VerifyOtpAndSignUpDoc, 
  SignUpDoc, 
  SignInDoc, 
  GetProfileDoc, 
  CheckAuthDoc 
} from './decorators/swagger.decorators';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTagsAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('otp/request')
  @ApiOperation({ summary: 'Request OTP for login/registration' })
  @ApiResponse({ status: 201, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RequestOtpDto })
  async requestOtp(@Body() body: RequestOtpDto) {
    return this.authService.requestOtp(body.email);
  }

  @Post('verify-otp')
  @VerifyOtpAndSignUpDoc()
  async verifyOtpAndSignUp(
    @Body('email') email: string,
    @Body('token') token: string,
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
  async getProfile(@Request() req) {
    const user = await this.authService.getUserProfile(req.user.userId);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('doctor/profile-complete')
  async setProfileComplete(
    @Request() req,
    @Body('profileComplete') profileComplete: boolean,
  ) {
    return this.authService.setDoctorProfileComplete(req.user.userId, profileComplete);
  }
}
