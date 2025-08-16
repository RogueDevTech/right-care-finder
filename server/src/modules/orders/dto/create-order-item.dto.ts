import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateOrderItemDto {
  @ApiProperty({ description: "Product ID" })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: "Quantity" })
  @IsNumber()
  @Min(1)
  quantity: number;
}
