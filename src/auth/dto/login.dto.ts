import { IsString } from "class-validator";

export class LoginDto {
    @IsString()
    chain: string;

    @IsString()
    address: string;
}