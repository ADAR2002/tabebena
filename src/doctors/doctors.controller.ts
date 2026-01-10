import { Controller, Get, Param, UseGuards, Query, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { UuidParamDto } from '../common/dto/uuid-param.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all doctors', 
    description: 'Retrieves a paginated list of all doctors ordered by creation date' 
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
  @ApiQuery({
    name: 'specialty',
    required: false,
    type: String,
    description: 'Filter doctors by specialty (partial match)'
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Search by doctor first or last name (partial match)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Doctors retrieved successfully'
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('specialty') specialty?: string,
    @Query('name') name?: string,
  ) {
    return this.doctorsService.findAll(paginationDto, specialty, name);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'User ID' }) 
  @ApiOperation({ summary: 'Get doctor by ID', description: 'Retrieves a single doctor by their ID' })
  @ApiResponse({ status: 200, description: 'Doctor retrieved successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  async findOne(@Param() { id }: UuidParamDto) {
    return this.doctorsService.findOne(id);
  }

  @Post('me/open')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Increment my account open count (doctor)' })
  async incrementMyOpen(@Request() req) {
    return this.doctorsService.incrementOpenCount(req.user.userId);
  }
}
