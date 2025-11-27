import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { VisitResponseDto } from './dto/visit-response.dto';
import { 
  ApiCreateVisit,
  ApiFindAllVisits,
  ApiFindVisitById,
  ApiGetPatientVisits,
  ApiUpdateVisit,
  ApiDeleteVisit
} from './decorators/swagger.decorators';

@ApiTags('visits')
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateVisit()
  create(@Body() createVisitDto: CreateVisitDto): Promise<VisitResponseDto> {
    return this.visitsService.create(createVisitDto);
  }

  @Get()
  @ApiFindAllVisits()
  findAll(@Query('patientId') patientId?: string): Promise<VisitResponseDto[]> {
    return this.visitsService.findAll(patientId);
  }

  @Get(':id')
  @ApiFindVisitById()
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<VisitResponseDto> {
    return this.visitsService.findOne(id);
  }

  @Get('patient/phone/:phone')
  @ApiOperation({ summary: 'Get visits by patient phone number' })
  @ApiParam({ name: 'phone', description: 'Patient phone number' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of patient visits', 
    type: [VisitResponseDto] 
  })
  getPatientVisitsByPhone(
    @Param('phone') phone: string,
  ): Promise<VisitResponseDto[]> {
    return this.visitsService.getPatientVisits(phone);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVisitDto: UpdateVisitDto,
  ): Promise<VisitResponseDto> {
    return this.visitsService.update(id, updateVisitDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.visitsService.remove(id);
  }
}

