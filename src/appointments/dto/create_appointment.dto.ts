import { IsDate, IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateAppointmentDTO{
    @ApiProperty({
        description: "Patient ID",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    @IsUUID()
    @IsNotEmpty()
    patientId :  string;

    @ApiProperty({
        description: "Date and time of the appointment",
        example: "2024-12-25T10:30:00Z"
    })
    @IsNotEmpty()
    @IsDateString()
    dateAndTime: string

    @ApiPropertyOptional({
        description: "Additional notes for the appointment",
        example: "Patient needs follow-up consultation"
    })
    @IsString()
    note? : string
}