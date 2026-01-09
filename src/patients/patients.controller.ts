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
  UseInterceptors,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import {
  ApiPatientController,
  ApiCreatePatient,
  ApiFindAllPatients,
} from './decorators/swagger.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ResponseInterceptor, ErrorInterceptor } from '../common/interceptors';

@ApiPatientController()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor, ErrorInterceptor)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiCreatePatient()
  create(
    @Request() req,
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    // The JWT strategy returns userId, not id
    return this.patientsService.create(req.user.userId, createPatientDto);
  }

  @Get()
  @ApiFindAllPatients()
  async findAll(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
  ): Promise<PaginatedResult<Patient>> {
    return this.patientsService.findAll(
      req.user.userId,
      page,
      limit,
      name,
      phone,
    );
  }

  @Get(':id')
  async findOneById(
    @Request() req,
    @Param('id') id: string,
  ): Promise<Patient> {
    return this.patientsService.findById(req.user.userId, id);
  }

  @Patch(':id')
  async updateById(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    return this.patientsService.updateById(id, req.user.userId, updatePatientDto);
  }

  @Delete(':id')
  async removeById(
    @Request() req,
    @Param('id') id: string,
  ): Promise<void> {
    await this.patientsService.removeById(id, req.user.userId);
  }
}
