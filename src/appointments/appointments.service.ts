import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAppointmentDTO } from "./dto/create_appointment.dto";
import { UpdateAppointmentDTO } from "./dto/update_appointment.dto";

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}
  async createAppointment(doctorId, body: CreateAppointmentDTO) {
    if (!doctorId) throw new UnauthorizedException("You can't do that");
    if (!body.patientId) throw new BadRequestException("You shoud add patient");
    const patient = await this.prisma.patient.findUnique({
      where: { id: body.patientId },
    });
    if (!patient) throw new NotFoundException("Can't found patient");
    const appointment = await this.prisma.appointment.create({
      data: {
        doctorId: doctorId,
        patientId: body.patientId,
        dateAndTime: body.dateAndTime,
        notes: body.note,
      },
    });
    return appointment;
  }

  async findOne(doctorId: string, id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: true },
    });
    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.doctorId !== doctorId)
      throw new UnauthorizedException("You can't access this appointment");
    return appointment;
  }

  async deleteOne(doctorId: string, id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: true },
    });
    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.doctorId !== doctorId)
      throw new UnauthorizedException("You can't access this appointment");
    await this.prisma.appointment.delete({
      where: { id },
    });
    return appointment;
  }

  async updateOne(doctorId: string, id: string, body: UpdateAppointmentDTO) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: true },
    });
    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.doctorId !== doctorId)
      throw new UnauthorizedException("You can't access this appointment");

    const updateData: any = {};
    if (body.dateAndTime) updateData.dateAndTime = body.dateAndTime;
    if (body.note !== undefined) updateData.notes = body.note;

    const newAppointment = await this.prisma.appointment.update({
      where: { id },
      data: updateData,
    });
    return newAppointment;
  }

  async findByDate(doctorId: string, date: string) {
    const now = new Date(date);
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: doctorId,
        dateAndTime: {
          gte: date,
          lte: next24Hours,
        },
      },
      include: { patient: true },
      orderBy: {
        dateAndTime: "asc",
      },
    });
    return appointments;
  }
}
