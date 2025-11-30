import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleResponseDto } from './dto/schedule-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { DayOfWeek } from '@prisma/client';
import { ResponseInterceptor, ErrorInterceptor } from '../common/interceptors';
import {
  ApiCreateSchedule,
  ApiDeleteSchedule,
  ApiFindAllSchedules,
  ApiFindScheduleById,
  ApiFindSchedulesByDay,
  ApiUpdateSchedule
} from './decorators/swagger.decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('schedule')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor, ErrorInterceptor)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateSchedule()
  create(@Body() createScheduleDto: CreateScheduleDto, @Request() req: any): Promise<ScheduleResponseDto> {
    return this.scheduleService.create(createScheduleDto, req.user.userId);
  }

  @Get()
  @ApiFindAllSchedules()
  findAll(@Request() req: any): Promise<ScheduleResponseDto[]> {
    return this.scheduleService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiFindScheduleById()
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req: any): Promise<ScheduleResponseDto> {
    return this.scheduleService.findOne(id, req.user.userId);
  }

  @Get('day/:dayOfWeek')
  @ApiFindSchedulesByDay()
  findByDay(@Param('dayOfWeek') dayOfWeek: DayOfWeek, @Request() req: any): Promise<ScheduleResponseDto[]> {
    return this.scheduleService.getScheduleByDay(dayOfWeek, req.user.userId);
  }

  @Patch(':id')
  @ApiUpdateSchedule()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @Request() req: any,
  ): Promise<ScheduleResponseDto> {
    return this.scheduleService.update(id, updateScheduleDto, req.user.userId);
  }

  @Delete(':id')
  @ApiDeleteSchedule()
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: any): Promise<string> {
    return this.scheduleService.remove(id, req.user.userId);
  }
}
