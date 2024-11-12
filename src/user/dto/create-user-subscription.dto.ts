import { PaymentMethod } from "src/common/types";

export class CreateUserSubscriptionDto {
    id: string;
    userId: string;
    method: PaymentMethod;
    createdAt: Date;
    expiresAt: Date
}