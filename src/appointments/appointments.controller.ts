import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
  Param,
  Patch,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from "@nestjs/swagger";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDTO } from "./dto/create_appointment.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { ResponseInterceptor, ErrorInterceptor } from "src/common/interceptors";
import { UpdateAppointmentDTO } from "./dto/update_appointment.dto";

@ApiTags("appointments")
@ApiBearerAuth('JWT-auth')
@Controller("appointments")
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor, ErrorInterceptor)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  
  @Post()
  @ApiOperation({ summary: "Create a new appointment" })
  @ApiBody({ type: CreateAppointmentDTO, description: "Appointment creation data" })
  @ApiResponse({ status: 201, description: "Appointment created successfully" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async create(@Body() body: CreateAppointmentDTO, @Request() req) {
    return await this.appointmentsService.createAppointment(
      req.user.userId,
      body
    );
  }
  
  @Get()
  @ApiOperation({ summary: "Get all appointments for today" })
  @ApiResponse({ status: 200, description: "Appointments retrieved successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async findAll(@Request() req) {
    return await this.appointmentsService.getToday(req.user.userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get appointment by ID" })
  @ApiParam({ name: "id", description: "Appointment ID" })
  @ApiResponse({ status: 200, description: "Appointment retrieved successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Appointment not found" })
  async findOne(@Request() req, @Param("id") id: string) {
    return await this.appointmentsService.findOne(req.user.userId, id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete appointment by ID" })
  @ApiParam({ name: "id", description: "Appointment ID" })
  @ApiResponse({ status: 200, description: "Appointment deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Appointment not found" })
  async deleteOne(@Request() req, @Param("id") id: string) {
    return await this.appointmentsService.deleteOne(req.user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update appointment by ID" })
  @ApiParam({ name: "id", description: "Appointment ID" })
  @ApiBody({ type: UpdateAppointmentDTO, description: "Appointment update data" })
  @ApiResponse({ status: 200, description: "Appointment updated successfully" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Appointment not found" })
  async updateOne(@Body() body: UpdateAppointmentDTO, @Request() req, @Param("id") id: string) {
    return await this.appointmentsService.updateOne(req.user.userId, id, body)
  }

}
