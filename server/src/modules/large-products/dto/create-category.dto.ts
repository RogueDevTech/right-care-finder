import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ description: "Category name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Category description", required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
