import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsOptional, IsEnum } from "class-validator";
import { InvitationStatus } from "../entities/invitation.entity";

export class CreateInvitationDto {
  @ApiProperty({
    description: "Email address of the care home owner to invite",
    example: "john.doe@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "First name of the care home owner",
    example: "John",
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: "Last name of the care home owner",
    example: "Doe",
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: "Phone number of the care home owner",
    example: "+1234567890",
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: "ID of the care home to assign to this owner",
    example: "uuid-string",
    required: false,
  })
  @IsOptional()
  @IsString()
  careHomeId?: string;

  @ApiProperty({
    description: "Personal message to include in the invitation",
    example: "We would love to have your care home on our platform!",
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}

export class InvitationResponseDto {
  @ApiProperty({
    description: "Unique identifier for the invitation",
    example: "uuid-string",
  })
  id: string;

  @ApiProperty({
    description: "Email address of the invited person",
    example: "john.doe@example.com",
  })
  email: string;

  @ApiProperty({
    description: "First name of the invited person",
    example: "John",
  })
  firstName: string;

  @ApiProperty({
    description: "Last name of the invited person",
    example: "Doe",
  })
  lastName: string;

  @ApiProperty({
    description: "Phone number of the invited person",
    example: "+1234567890",
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: "Name of the care home",
    example: "Sunset Care Home",
    required: false,
  })
  careHomeName?: string;

  @ApiProperty({
    description: "Address of the care home",
    example: "123 Main Street, London",
    required: false,
  })
  careHomeAddress?: string;

  @ApiProperty({
    description: "Personal message included in the invitation",
    example: "We would love to have your care home on our platform!",
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: "Current status of the invitation",
    enum: InvitationStatus,
    example: InvitationStatus.PENDING,
  })
  @IsEnum(InvitationStatus)
  status: InvitationStatus;

  @ApiProperty({
    description: "ID of the admin who sent the invitation",
    example: "uuid-string",
  })
  invitedByUserId: string;

  @ApiProperty({
    description: "Name of the admin who sent the invitation",
    example: "Admin User",
  })
  invitedByUserName: string;

  @ApiProperty({
    description: "When the invitation expires",
    example: "2024-02-15T10:00:00Z",
  })
  expiresAt: Date;

  @ApiProperty({
    description: "When the invitation was accepted",
    example: "2024-02-10T10:00:00Z",
    required: false,
  })
  acceptedAt?: Date;

  @ApiProperty({
    description: "When the invitation was created",
    example: "2024-02-01T10:00:00Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "When the invitation was last updated",
    example: "2024-02-01T10:00:00Z",
  })
  updatedAt: Date;
}

export class InvitationsListResponseDto {
  @ApiProperty({
    description: "List of invitations",
    type: [InvitationResponseDto],
  })
  invitations: InvitationResponseDto[];

  @ApiProperty({
    description: "Pagination information",
    example: {
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
    },
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
