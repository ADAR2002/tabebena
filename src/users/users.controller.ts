import { Controller, Get, Param, UseGuards, Query, Request, Delete, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UuidParamDto } from '../common/dto/uuid-param.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { GetProfileDoc } from '../auth/decorators/swagger.decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @GetProfileDoc()
  async getMe(@Request() req) {
    return this.usersService.getMe(req.user.userId);
  }


  @Post('me/open')
  @ApiBearerAuth('JWT-auth')
 @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Increment my account open count' })
  async incrementMyOpen(@Request() req) {
    return this.usersService.incrementOpenCount(req.user.userId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all users', 
    description: 'Retrieves a paginated list of all users ordered by creation date' 
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number, 
    description: 'Page number (1-based)',
    example: 1
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Number of items per page (max: 100)',
    example: 10
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiOperation({ summary: 'Get user by ID', description: 'Retrieves a single user by their ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param() { id }: UuidParamDto) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiOperation({ summary: 'remove user by ID', description: 'Retrieves a single user by their ID' })
  async removeOne(@Param() { id }: UuidParamDto) {
    return this.usersService.removeOne(id);
  }
}
