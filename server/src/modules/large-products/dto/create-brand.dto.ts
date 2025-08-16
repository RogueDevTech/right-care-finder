import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateBrandDto {
  @ApiProperty({ description: "Brand name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Brand description", required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
