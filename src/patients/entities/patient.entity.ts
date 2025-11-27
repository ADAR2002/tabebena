import { Gender, BloodType } from '@prisma/client';

export class Patient {
  id: string;
  doctorUserId: string;
  fullName: string;
  dateOfBirth: Date;
  gender: Gender;
  phone: string;
  bloodType: BloodType | null;
  allergies: string | null;
  medicalHistory: string | null;
  createdAt: Date;
  updatedAt: Date;
}
