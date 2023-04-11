import { IsNotEmpty, IsString } from "class-validator";

export class LoginWeb3Dto {
    @IsString()
    @IsNotEmpty()
    address: string;
}