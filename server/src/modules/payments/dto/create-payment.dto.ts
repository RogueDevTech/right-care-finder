import { IsEnum, IsString, IsUUID } from "class-validator";
import { PaymentMethod } from "../entities/payment.entity";

export class CreatePaymentDto {
  @IsUUID()
  orderId: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsString()
  transactionId?: string;
}
