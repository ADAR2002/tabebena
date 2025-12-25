import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  Param,
  Patch,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDTO } from "./dto/create_appointment.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { ResponseInterceptor, ErrorInterceptor } from "src/common/interceptors";
import { UpdateAppointmentDTO } from "./dto/update_appointment.dto";

@ApiTags("appointments")
@ApiBearerAuth("JWT-auth")
@Controller("appointments")
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor, ErrorInterceptor)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new appointment" })
  @ApiBody({
    type: CreateAppointmentDTO,
    description: "Appointment creation data",
  })
  async create(@Body() body: CreateAppointmentDTO, @Request() req) {
    return await this.appointmentsService.createAppointment(
      req.user.userId,
      body
    );
  }

  /*@Get()
  @ApiOperation({ summary: "Get all appointments for today" })
  async findAll(@Request() req) {
    return await this.appointmentsService.getToday(req.user.userId);
  }*/

  @Get(":id")
  @ApiOperation({ summary: "Get appointment by ID" })
  @ApiParam({ name: "id", description: "Appointment ID" })
  async findOne(@Request() req, @Param("id") id: string) {
    return await this.appointmentsService.findOne(req.user.userId, id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete appointment by ID" })
  @ApiParam({ name: "id", description: "Appointment ID" })
  async deleteOne(@Request() req, @Param("id") id: string) {
    return await this.appointmentsService.deleteOne(req.user.userId, id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update appointment by ID" })
  @ApiParam({ name: "id", description: "Appointment ID" })
  @ApiBody({
    type: UpdateAppointmentDTO,
    description: "Appointment update data",
  })
  async updateOne(
    @Body() body: UpdateAppointmentDTO,
    @Request() req,
    @Param("id") id: string
  ) {
    return await this.appointmentsService.updateOne(req.user.userId, id, body);
  }

  @Get()
  @ApiOperation({ summary: "Get appointments for a specific date" })
  @ApiQuery({
    name: "date",
    required: true,
    description: "Date in ISO format (e.g., 2023-12-25T00:00:00.000Z)",
    example: "2023-12-25T00:00:00.000Z",
  })
  async findByDate(@Request() req, @Query("date") date: string) {
    return await this.appointmentsService.findByDate(req.user.userId, date);
  }
}
