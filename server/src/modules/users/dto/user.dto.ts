import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  ValidateIf,
} from "class-validator";
import { Transform } from "class-transformer";
import { UserRole } from "../entities/user.entity";

export class UpdateUserDto {
  @ApiProperty({
    description: "User email",
    required: false,
    example: "john.doe@example.com",
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: "User first name",
    required: false,
    example: "John",
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: "User last name",
    required: false,
    example: "Doe",
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: "User role",
    enum: UserRole,
    required: false,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: "User phone number",
    required: false,
    example: "+1234567890",
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: "User date of birth",
    required: false,
    example: "1990-01-01",
  })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: "User ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: "User email",
    example: "john.doe@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User first name",
    example: "John",
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: "User last name",
    example: "Doe",
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: "User role",
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: "User phone number",
    example: "+1234567890",
    nullable: true,
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: "User date of birth",
    example: "1990-01-01",
    nullable: true,
  })
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty({
    description: "Whether the user's email is verified",
    example: false,
  })
  @IsBoolean()
  isEmailVerified: boolean;

  @ApiProperty({
    description: "Whether the user account is active",
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: "User creation timestamp",
    example: "2024-03-20T12:00:00Z",
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: "User last update timestamp",
    example: "2024-03-20T12:00:00Z",
  })
  @IsDate()
  updatedAt: Date;
}

export class UsersResponseDto {
  @ApiProperty({
    description: "List of users",
    type: [UserResponseDto],
  })
  users: UserResponseDto[];
}
