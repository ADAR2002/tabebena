export declare class LoginCredentialsDto {
    email: string;
    password: string;
}
export declare class RegisterCredentialsDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    isDoctor?: boolean;
    specialtyId?: string;
}
