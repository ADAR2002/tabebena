import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { UuidParamDto } from '../common/dto/uuid-param.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Doctors')
@ApiBearerAuth('JWT-auth')
@Controller('doctors')
@UseGuards(JwtAuthGuard)
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
  @ApiResponse({ 
    status: 200, 
    description: 'Doctors retrieved successfully'
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.doctorsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'User ID' }) 
  @ApiOperation({ summary: 'Get doctor by ID', description: 'Retrieves a single doctor by their ID' })
  @ApiResponse({ status: 200, description: 'Doctor retrieved successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  async findOne(@Param() { id }: UuidParamDto) {
    return this.doctorsService.findOne(id);
  }
}
