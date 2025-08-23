import { ApiProperty } from "@nestjs/swagger";

export class CareHomeResponseDto {
  @ApiProperty({
    description: "Unique identifier for the care home",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "Name of the care home",
    example: "Sunset Care Home",
  })
  name: string;

  @ApiProperty({
    description: "Detailed description of the care home",
    example:
      "A modern care home providing exceptional care for elderly residents...",
  })
  description: string;

  @ApiProperty({
    description: "Primary address line (building number and street)",
    example: "123 High Street",
  })
  addressLine1: string;

  @ApiProperty({
    description: "Secondary address line (apartment, suite, etc.)",
    example: "Suite 4B",
    required: false,
  })
  addressLine2?: string;

  @ApiProperty({
    description: "City where the care home is located",
    example: "London",
  })
  city: string;

  @ApiProperty({
    description: "Region/County where the care home is located",
    example: "Greater London",
    required: false,
  })
  region?: string;

  @ApiProperty({
    description: "Postal code",
    example: "SW1A 1AA",
  })
  postcode: string;

  @ApiProperty({
    description: "Local area/district within the city",
    example: "Westminster",
    required: false,
  })
  area?: string;

  @ApiProperty({
    description: "Country where the care home is located",
    example: "United Kingdom",
    required: false,
  })
  country?: string;

  @ApiProperty({
    description: "Latitude coordinate for location mapping",
    example: 51.5074,
    required: false,
  })
  latitude?: number;

  @ApiProperty({
    description: "Longitude coordinate for location mapping",
    example: -0.1278,
    required: false,
  })
  longitude?: number;

  @ApiProperty({
    description: "Primary contact phone number",
    example: "+44 20 1234 5678",
  })
  phone: string;

  @ApiProperty({
    description: "Contact email address",
    example: "info@sunsetcarehome.com",
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: "Website URL",
    example: "https://www.sunsetcarehome.com",
    required: false,
  })
  website?: string;

  @ApiProperty({
    description: "Weekly care cost in GBP",
    example: 850.0,
    required: false,
  })
  weeklyPrice?: number;

  @ApiProperty({
    description: "Monthly care cost in GBP",
    example: 3400.0,
    required: false,
  })
  monthlyPrice?: number;

  @ApiProperty({
    description: "Total number of beds available",
    example: 50,
  })
  totalBeds: number;

  @ApiProperty({
    description: "Number of currently available beds",
    example: 12,
  })
  availableBeds: number;

  @ApiProperty({
    description: "Whether the care home is currently active",
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: "Whether the care home has been verified by admin",
    example: true,
  })
  isVerified: boolean;

  @ApiProperty({
    description: "Whether the care home is featured on the platform",
    example: false,
  })
  isFeatured: boolean;

  @ApiProperty({
    description: "List of specializations offered",
    example: ["Dementia Care", "Respite Care", "Palliative Care"],
    type: [String],
    required: false,
  })
  specializations?: string[];

  @ApiProperty({
    description: "CQC (Care Quality Commission) rating",
    example: "Good",
    enum: ["Outstanding", "Good", "Requires Improvement", "Inadequate"],
    required: false,
  })
  cqcRating?: string;

  @ApiProperty({
    description: "Date of last CQC inspection",
    example: "2024-01-15T00:00:00.000Z",
    required: false,
  })
  lastInspectionDate?: Date;

  @ApiProperty({
    description: "Age restrictions for residents",
    example: "65+",
    required: false,
  })
  ageRestriction?: string;

  @ApiProperty({
    description: "Whether the care home is accepting new residents",
    example: true,
    required: false,
  })
  acceptingNewResidents?: boolean;

  @ApiProperty({
    description: "Opening hours for different days",
    example: {
      Monday: "8:00 AM - 8:00 PM",
      Tuesday: "8:00 AM - 8:00 PM",
      Wednesday: "8:00 AM - 8:00 PM",
      Thursday: "8:00 AM - 8:00 PM",
      Friday: "8:00 AM - 8:00 PM",
      Saturday: "9:00 AM - 6:00 PM",
      Sunday: "9:00 AM - 6:00 PM",
    },
    required: false,
  })
  openingHours?: Record<string, any>;

  @ApiProperty({
    description: "Additional contact information",
    example: {
      emergency: "+44 20 1234 5679",
      manager: "John Smith",
      managerPhone: "+44 20 1234 5680",
    },
    required: false,
  })
  contactInfo?: Record<string, any>;

  @ApiProperty({
    description: "Average rating from reviews (1-5 scale)",
    example: 4.5,
    required: false,
  })
  rating?: number;

  @ApiProperty({
    description: "Total number of reviews",
    example: 25,
  })
  reviewCount: number;

  @ApiProperty({
    description: "Care type information",
    example: {
      id: "123e4567-e89b-12d3-a456-426614174001",
      name: "Residential Care",
      description: "24-hour residential care for elderly residents",
    },
    required: false,
  })
  careType?: {
    id: string;
    name: string;
    description: string;
  };

  @ApiProperty({
    description: "List of facilities available",
    example: [
      {
        id: "123e4567-e89b-12d3-a456-426614174002",
        name: "Garden",
        description: "Beautiful garden for residents to enjoy",
      },
    ],
    type: [Object],
    required: false,
  })
  facilities?: Array<{
    id: string;
    name: string;
    description: string;
  }>;

  @ApiProperty({
    description: "List of care home images",
    example: [
      {
        id: "123e4567-e89b-12d3-a456-426614174003",
        url: "https://example.com/image1.jpg",
        altText: "Main entrance of the care home",
        isPrimary: true,
      },
    ],
    type: [Object],
    required: false,
  })
  images?: Array<{
    id: string;
    url: string;
    altText: string;
    isPrimary: boolean;
  }>;

  @ApiProperty({
    description: "User who created the care home",
    example: {
      id: "123e4567-e89b-12d3-a456-426614174004",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },
    required: false,
  })
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({
    description: "Date when the care home was created",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Date when the care home was last updated",
    example: "2024-01-20T14:45:00.000Z",
  })
  updatedAt: Date;
}

export class CareHomesListResponseDto {
  @ApiProperty({
    description: "List of care homes",
    type: [CareHomeResponseDto],
  })
  data: CareHomeResponseDto[];

  @ApiProperty({
    description: "Total number of care homes",
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: "Current page number",
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: "Total number of pages",
    example: 8,
  })
  totalPages: number;
}
