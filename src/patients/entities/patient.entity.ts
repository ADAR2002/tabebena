import { Gender } from '@prisma/client';

export class Patient {
  id: string;
  doctorUserId: string;
  fullName: string;
  dateOfBirth: Date;
  gender: Gender;
  phone: string;
  bloodType: string | null;
  descriptons: string | null;
  severity: string | null;
  createdAt: Date;
  updatedAt: Date;
  nextAppointment?: Date | null;
  lastSession?: Date | null;
}
