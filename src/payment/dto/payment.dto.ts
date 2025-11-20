/* eslint-disable prettier/prettier */
import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";

export enum PaymentMethod {
    ONLINE = 'ONLINE',
    COD = 'COD',
    UPI = 'UPI',
    CARD = 'CARD'
}

export class PaymentDto{
    @IsString()
    orderId: string;

    @IsNumber()
    amount: number;

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @IsString()
    transactionId: string;

    @IsString()
    status: string;

    @IsDate()
    timestamp: Date;
}