import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsEnum, IsBoolean } from "class-validator";
import { AddressType } from "../entities/address.entity";

export class CreateAddressDto {
  @ApiProperty({
    description: "Address label",
    example: "Home",
  })
  @IsString()
  label: string;

  @ApiProperty({
    description: "Address type",
    enum: AddressType,
    example: AddressType.HOME,
  })
  @IsEnum(AddressType)
  type: AddressType;

  @ApiProperty({
    description: "Street address",
    example: "123 Main St",
  })
  @IsString()
  street: string;

  @ApiProperty({
    description: "City",
    example: "Lagos",
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: "State",
    example: "Lagos",
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: "Country",
    example: "Nigeria",
  })
  @IsString()
  country: string;

  @ApiProperty({
    description: "ZIP/Postal code",
    example: "100001",
  })
  @IsString()
  zipCode: string;

  @ApiProperty({
    description: "Apartment/Suite number",
    example: "Apt 4B",
    required: false,
  })
  @IsOptional()
  @IsString()
  apartment?: string;

  @ApiProperty({
    description: "Phone number for this address",
    example: "+234 801 234 5678",
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: "Set as default address",
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @ApiProperty({
    description: "Address label",
    example: "Home",
    required: false,
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({
    description: "Address type",
    enum: AddressType,
    example: AddressType.HOME,
    required: false,
  })
  @IsOptional()
  @IsEnum(AddressType)
  type?: AddressType;

  @ApiProperty({
    description: "Street address",
    example: "123 Main St",
    required: false,
  })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({
    description: "City",
    example: "Lagos",
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: "State",
    example: "Lagos",
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: "Country",
    example: "Nigeria",
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: "ZIP/Postal code",
    example: "100001",
    required: false,
  })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({
    description: "Apartment/Suite number",
    example: "Apt 4B",
    required: false,
  })
  @IsOptional()
  @IsString()
  apartment?: string;

  @ApiProperty({
    description: "Phone number for this address",
    example: "+234 801 234 5678",
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: "Set as default address",
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class AddressResponseDto {
  @ApiProperty({
    description: "Address ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "Address label",
    example: "Home",
  })
  label: string;

  @ApiProperty({
    description: "Address type",
    enum: AddressType,
    example: AddressType.HOME,
  })
  type: AddressType;

  @ApiProperty({
    description: "Street address",
    example: "123 Main St",
  })
  street: string;

  @ApiProperty({
    description: "City",
    example: "Lagos",
  })
  city: string;

  @ApiProperty({
    description: "State",
    example: "Lagos",
  })
  state: string;

  @ApiProperty({
    description: "Country",
    example: "Nigeria",
  })
  country: string;

  @ApiProperty({
    description: "ZIP/Postal code",
    example: "100001",
  })
  zipCode: string;

  @ApiProperty({
    description: "Apartment/Suite number",
    example: "Apt 4B",
    nullable: true,
  })
  apartment: string;

  @ApiProperty({
    description: "Phone number for this address",
    example: "+234 801 234 5678",
    nullable: true,
  })
  phoneNumber: string;

  @ApiProperty({
    description: "Is default address",
    example: false,
  })
  isDefault: boolean;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2024-03-20T12:00:00Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2024-03-20T12:00:00Z",
  })
  updatedAt: Date;
}
