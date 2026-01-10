import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getHome(doctorId: string) {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [upcomingAppointments, recentVisits, patientsCount, upcomingAppointmentsCount, recentVisitsCount] = await Promise.all([
      this.prisma.appointment.findMany({
        where: {
          doctorId,
          dateAndTime: { gt: now },
        },
        orderBy: { dateAndTime: 'asc' },
        take: 3,
        include: { patient: true },
      }),
      this.prisma.visit.findMany({
        where: {
          visitDate: { lte: now },
          patient: { doctorUserId: doctorId },
        },
        orderBy: { visitDate: 'desc' },
        take: 3,
        include: { patient: true },
      }),
      this.prisma.patient.count({ where: { doctorUserId: doctorId } }),
      this.prisma.appointment.count({ where: { doctorId, dateAndTime: { gt: now } } }),
      this.prisma.visit.count({ where: { visitDate: { gte: sevenDaysAgo }, patient: { doctorUserId: doctorId } } }),
    ]);

    return {
      upcomingAppointments,
      recentVisits,
      stats: {
        patientsCount,
        upcomingAppointmentsCount,
        recentVisitsCount,
      },
    };
  }
}
