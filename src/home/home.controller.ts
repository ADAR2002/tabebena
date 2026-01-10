import { Controller, Get, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ResponseInterceptor, ErrorInterceptor } from '../common/interceptors';
import { HomeService } from './home.service';

@ApiTags('home')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor, ErrorInterceptor)
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard overview for the authenticated doctor' })
  async getHome(@Request() req) {
    return this.homeService.getHome(req.user.userId);
    }
}
