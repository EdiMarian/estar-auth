import { IsNotEmpty, IsString } from "class-validator";

export class RegisterWeb2Dto {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    username: string;
}