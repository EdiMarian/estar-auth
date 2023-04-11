import { IsNotEmpty, IsString } from "class-validator";

export class RegisterWeb3Dto {
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    username: string;
}