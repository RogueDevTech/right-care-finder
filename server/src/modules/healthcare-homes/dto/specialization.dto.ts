import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from "class-validator";

export class CreateSpecializationDto {
  @ApiProperty({
    description: "Name of the specialization",
    example: "Dementia Care",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Description of the specialization",
    example: "Specialized care for residents with dementia",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Whether the specialization is active",
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: "Sort order for display",
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}

export class UpdateSpecializationDto {
  @ApiProperty({
    description: "Name of the specialization",
    example: "Dementia Care",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Description of the specialization",
    example: "Specialized care for residents with dementia",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Whether the specialization is active",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: "Sort order for display",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}

export class SpecializationResponseDto {
  @ApiProperty({
    description: "Specialization ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Name of the specialization",
    example: "Dementia Care",
  })
  name: string;

  @ApiProperty({
    description: "Description of the specialization",
    example: "Specialized care for residents with dementia",
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: "Whether the specialization is active",
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: "Sort order for display",
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2024-01-20T14:45:00.000Z",
  })
  updatedAt: Date;
}
