import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  Matches,
} from "class-validator";
export class RegisterDto {
  @ApiProperty({
    description: "User's email address",
    example: "john.doe@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password (min 8 characters)",
    example: "Password123!",
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: "User's first name",
    example: "John",
  })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    description: "User's last name",
    example: "Doe",
  })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    description: "User's phone number",
    example: "+1234567890",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message:
      "Phone number must be a valid international format (e.g., +1234567890)",
  })
  phoneNumber?: string;
}
