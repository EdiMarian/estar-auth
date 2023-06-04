export class CreateOrderDto {
    userId: string;
    itemId: string;
    method: string;
    createdAt: Date;
    status: string;
}