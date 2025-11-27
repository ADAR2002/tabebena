import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import {
  ApiPatientController,
  ApiCreatePatient,
  ApiFindAllPatients,
  ApiSearchPatients,
  ApiFindPatientByPhone,
  ApiUpdatePatientByPhone,
  ApiDeletePatientByPhone,
} from './decorators/swagger.decorators';

@ApiPatientController()
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiCreatePatient()
  create(
    @Request() req,
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    return this.patientsService.create(req.user.id, createPatientDto);
  }

  @Get()
  @ApiFindAllPatients()
  async findAll(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('search') search?: string,
  ): Promise<PaginatedResult<Patient>> {
    if (search) {
      const results = await this.patientsService.search(req.user.id, search);
      return {
        data: results,
        meta: {
          total: results.length,
          page: 1,
          limit: results.length,
          totalPages: 1,
        },
      };
    }
    return this.patientsService.findAll(req.user.id, page, limit);
  }

  @Get('search')
  @ApiSearchPatients()
  async search(
    @Request() req,
    @Query('q') query: string,
  ): Promise<PaginatedResult<Patient>> {
    const results = await this.patientsService.search(req.user.id, query);
    return {
      data: results,
      meta: {
        total: results.length,
        page: 1,
        limit: results.length,
        totalPages: 1,
      },
    };
  }

  @Get('phone/:phone')
  @ApiFindPatientByPhone()
  async findOneByPhone(
    @Request() req,
    @Param('phone') phone: string,
  ): Promise<Patient> {
    return this.patientsService.findOne(phone, req.user.id);
  }

  @Patch('phone/:phone')
  @ApiUpdatePatientByPhone()
  async updateByPhone(
    @Request() req,
    @Param('phone') phone: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    return this.patientsService.update(phone, req.user.id, updatePatientDto);
  }

  @Delete('phone/:phone')
  @ApiDeletePatientByPhone()
  async removeByPhone(
    @Request() req,
    @Param('phone') phone: string,
  ): Promise<void> {
    await this.patientsService.remove(phone, req.user.id);
  }
}
