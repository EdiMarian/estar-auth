import { IsNotEmpty, IsString } from "class-validator";

export class LinkAddressDto {
    @IsNotEmpty()
    @IsString()
    address: string;
}