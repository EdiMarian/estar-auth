import { IsNotEmpty, IsString } from "class-validator";

export class LinkAddressDto {
    @IsString()
    @IsNotEmpty()
    chain: string;

    @IsString()
    @IsNotEmpty()
    address: string;
}