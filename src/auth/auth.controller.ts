import { Controller, Post, Body, UseGuards, Get, Request, UnauthorizedException } from '@nestjs/common';
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

@ApiTagsAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('request-otp')
  @RequestOtpDoc()
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    if (!requestOtpDto.isDoctor) {
      throw new UnauthorizedException('OTP verification is only required for doctors');
    }
    return this.authService.requestOtp(requestOtpDto.email, requestOtpDto.isDoctor);
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
  async getProfile(@Request() req) {
    const user = await this.authService.getUserProfile(req.user.userId);
    return user;
  }
}
