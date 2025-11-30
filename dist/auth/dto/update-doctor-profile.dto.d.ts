export declare enum GenderDto {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}
declare class ClinicLocationDto {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    region?: string;
    clinicName?: string;
    clinicPhone?: string;
}
export declare class UpdateDoctorProfileDto {
    bio?: string;
    specialty?: string;
    certificates?: string[];
    clinicImages?: string[];
    consultationFee?: number;
    experienceYears?: number;
    profilePhotoUrl?: string;
    clinicLocation?: ClinicLocationDto;
    dateOfBirth?: string;
    gender?: GenderDto;
}
export {};
