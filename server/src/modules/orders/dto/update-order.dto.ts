import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "../entities/order.entity";

export class UpdateOrderDto {
  @ApiProperty({ description: "Order status", enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ description: "Tracking number", required: false })
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiProperty({ description: "Admin notes", required: false })
  @IsString()
  @IsOptional()
  adminNotes?: string;

  @ApiProperty({ description: "Shipping address", required: false })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({ description: "Billing address", required: false })
  @IsString()
  @IsOptional()
  billingAddress?: string;
}
