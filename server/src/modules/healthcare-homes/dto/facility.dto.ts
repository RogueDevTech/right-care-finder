import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from "class-validator";

export class CreateFacilityDto {
  @ApiProperty({
    description: "Name of the facility",
    example: "Garden",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Description of the facility",
    example: "Beautiful garden for residents to enjoy",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Icon for the facility (class name or URL)",
    example: "fas fa-tree",
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: "Whether the facility is active",
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

export class UpdateFacilityDto {
  @ApiProperty({
    description: "Name of the facility",
    example: "Garden",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Description of the facility",
    example: "Beautiful garden for residents to enjoy",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Icon for the facility (class name or URL)",
    example: "fas fa-tree",
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: "Whether the facility is active",
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

export class FacilityResponseDto {
  @ApiProperty({
    description: "Facility ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "Name of the facility",
    example: "Garden",
  })
  name: string;

  @ApiProperty({
    description: "Description of the facility",
    example: "Beautiful garden for residents to enjoy",
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: "Icon for the facility",
    example: "fas fa-tree",
    required: false,
  })
  icon?: string;

  @ApiProperty({
    description: "Whether the facility is active",
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
