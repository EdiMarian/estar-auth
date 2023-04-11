import { IsNotEmpty, IsString } from "class-validator";

export class LoginWeb2Dto {
    @IsString()
    @IsNotEmpty()
    token: string;
}