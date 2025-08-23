import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
  IsUUID,
  Min,
  IsNotEmpty,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

// Example care home data for Swagger documentation
export const exampleCareHomeData = {
  name: "Sunset Gardens Care Home",
  description: [
    "A modern, purpose-built care home providing exceptional care in a warm and welcoming environment.",
    "Our dedicated team of professionals ensures personalized care for each resident.",
    "Located in a peaceful neighborhood with beautiful gardens and modern amenities.",
  ],
  addressLine1: "123 Care Street",
  addressLine2: "Suite 101",
  city: "Manchester",
  region: "Greater Manchester",
  postcode: "M1 1AA",

  country: "United Kingdom",
  latitude: 53.4808,
  longitude: -2.2426,
  phone: "+44 161 123 4567",
  email: "info@sunsetgardens.co.uk",
  website: "https://www.sunsetgardens.co.uk",
  weeklyPrice: 1200,
  monthlyPrice: 4800,
  totalBeds: 50,
  availableBeds: 5,
  isActive: true,
  specializations: ["Dementia Care", "Respite Care", "End of Life Care"],
  openingHours: {
    Monday: "9:00 AM - 5:00 PM",
    Tuesday: "9:00 AM - 5:00 PM",
    Wednesday: "9:00 AM - 5:00 PM",
    Thursday: "9:00 AM - 5:00 PM",
    Friday: "9:00 AM - 5:00 PM",
    Saturday: "9:00 AM - 5:00 PM",
    Sunday: "9:00 AM - 5:00 PM",
  },
  contactInfo: {
    emergency: "+44 161 999 9999",
    manager: "John Smith",
  },
  careTypeId: "123e4567-e89b-12d3-a456-426614174000",
  facilityIds: [
    "123e4567-e89b-12d3-a456-426614174001",
    "123e4567-e89b-12d3-a456-426614174002",
  ],
  imageUrls: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
  ],
};

export class CreateCareHomeDto {
  @ApiProperty({
    description: "Name of the care home",
    example: "Sunset Gardens Care Home",
  })
  @IsString()
  @IsNotEmpty({ message: "Care home name is required" })
  name: string;

  @ApiProperty({
    description: "Detailed description of the care home as an array of strings",
    example: [
      "A modern, purpose-built care home providing exceptional care in a warm and welcoming environment.",
      "Our dedicated team of professionals ensures personalized care for each resident.",
      "Located in a peaceful neighborhood with beautiful gardens and modern amenities.",
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ message: "Description is required" })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      // Filter out empty strings and trim whitespace
      return (value as string[])
        .filter((line) => line.trim() !== "")
        .map((line) => line.trim());
    }
    return value;
  })
  description: string[];

  @ApiProperty({
    description: "Building number and street name",
    example: "123 Care Street",
  })
  @IsString()
  @IsNotEmpty({ message: "Address line 1 is required" })
  addressLine1: string;

  @ApiProperty({
    description: "Apartment, suite, or additional address information",
    example: "Suite 101",
    required: false,
  })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({
    description: "City where the care home is located",
    example: "Manchester",
  })
  @IsString()
  @IsNotEmpty({ message: "City is required" })
  city: string;

  @ApiProperty({
    description: "County/region where the care home is located",
    example: "Greater Manchester",
    required: false,
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({
    description: "Postal code of the care home",
    example: "M1 1AA",
  })
  @IsString()
  @IsNotEmpty({ message: "Postcode is required" })
  postcode: string;

  @ApiProperty({
    description: "Country where the care home is located",
    example: "United Kingdom",
    required: false,
    default: "United Kingdom",
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: "Latitude coordinate of the care home",
    example: 53.4808,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @ApiProperty({
    description: "Longitude coordinate of the care home",
    example: -2.2426,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @ApiProperty({
    description: "Phone number of the care home",
    example: "+44 161 123 4567",
  })
  @IsString()
  @IsNotEmpty({ message: "Phone number is required" })
  phone: string;

  @ApiProperty({
    description: "Email address of the care home",
    example: "info@sunsetgardens.co.uk",
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: "Website URL of the care home",
    example: "https://www.sunsetgardens.co.uk",
    required: false,
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({
    description: "Weekly price in GBP",
    example: 1200,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  weeklyPrice?: number;

  @ApiProperty({
    description: "Monthly price in GBP",
    example: 4800,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  monthlyPrice?: number;

  @ApiProperty({
    description: "Total number of beds in the care home",
    example: 50,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  totalBeds?: number;

  @ApiProperty({
    description: "Number of available beds",
    example: 5,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  availableBeds?: number;

  @ApiProperty({
    description: "Whether the care home is active",
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: "Specializations of the care home",
    example: ["Dementia Care", "Respite Care", "End of Life Care"],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @ApiProperty({
    description: "Opening hours of the care home",
    example: { Monday: "9:00 AM - 5:00 PM", Tuesday: "9:00 AM - 5:00 PM" },
    required: false,
  })
  @IsOptional()
  @IsObject()
  openingHours?: Record<string, any>;

  @ApiProperty({
    description: "Additional contact information",
    example: { emergency: "+44 161 999 9999", manager: "John Smith" },
    required: false,
  })
  @IsOptional()
  @IsObject()
  contactInfo?: Record<string, any>;

  @ApiProperty({
    description: "ID of the care type",
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty({ message: "Care type ID is required" })
  careTypeId: number;

  @ApiProperty({
    description: "Array of facility IDs",
    example: [
      "123e4567-e89b-12d3-a456-426614174001",
      "123e4567-e89b-12d3-a456-426614174002",
    ],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  facilityIds?: string[];

  @ApiProperty({
    description: "Array of image URLs",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
