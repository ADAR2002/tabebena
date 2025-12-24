import { IsDate, IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"

export class UpdateAppointmentDTO{
    @ApiPropertyOptional({
        description: "Updated date and time of the appointment",
        example: "2024-12-25T14:30:00Z"
    })
    @IsDateString()
    dateAndTime?: string

    @ApiPropertyOptional({
        description: "Updated notes for the appointment",
        example: "Patient requires additional tests"
    })
    @IsString()
    note? : string
}