import { IsString, IsNumber, IsOptional, IsBoolean, IsObject, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class CreateReviewDto {
  @IsString()
  comment: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @IsOptional()
  @IsObject()
  reviewData?: Record<string, any>;
}
