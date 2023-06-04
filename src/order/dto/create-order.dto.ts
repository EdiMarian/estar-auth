import { OrderStatus, PaymentMethod } from "src/common/types";

export class CreateOrderDto {
    userId: string;
    itemId: string;
    method: PaymentMethod;
    createdAt: Date;
    status: OrderStatus;
}