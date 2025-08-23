import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from "class-validator";

export class CreateCareTypeDto {
  @ApiProperty({
    description: "Name of the care type",
    example: "Residential Care",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Description of the care type",
    example: "24-hour residential care for elderly residents",
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: "Icon for the care type (class name or URL)",
    example: "fas fa-home",
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: "Whether the care type is active",
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCareTypeDto {
  @ApiProperty({
    description: "Name of the care type",
    example: "Residential Care",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Description of the care type",
    example: "24-hour residential care for elderly residents",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Icon for the care type (class name or URL)",
    example: "fas fa-home",
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: "Whether the care type is active",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CareTypeResponseDto {
  @ApiProperty({
    description: "Care type ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Name of the care type",
    example: "Residential Care",
  })
  name: string;

  @ApiProperty({
    description: "Description of the care type",
    example: "24-hour residential care for elderly residents",
  })
  description: string;

  @ApiProperty({
    description: "Icon for the care type",
    example: "fas fa-home",
    required: false,
  })
  icon?: string;

  @ApiProperty({
    description: "Whether the care type is active",
    example: true,
  })
  isActive: boolean;

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
