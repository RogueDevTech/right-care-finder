import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional, IsArray, Min } from "class-validator";

export class CreateProductDto {
  @ApiProperty({ description: "Product name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Product description" })
  @IsString()
  description: string;

  @ApiProperty({ description: "Product price" })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: "Product stock quantity" })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ description: "Product category" })
  @IsString()
  category: string;

  @ApiProperty({ description: "Product SKU" })
  @IsString()
  sku: string;

  @ApiProperty({
    description: "Product images",
    type: [String],
    required: false,
    default: [],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images: string[] = [];

  @ApiProperty({ description: "Product specifications", required: false })
  @IsOptional()
  specifications?: Record<string, any>;
}
