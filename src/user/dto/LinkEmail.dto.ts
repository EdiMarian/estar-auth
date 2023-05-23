import { IsEmail, IsNotEmpty } from "class-validator";

export class LinkEmailDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}