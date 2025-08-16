import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({
    description: "User's email address",
    example: "user@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Subject of the email",
    example: "Password Reset Code - Favina Store",
  })
  @IsString()
  @IsNotEmpty()
  subject: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: "User's email address",
    example: "user@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "4-digit verification code sent to email",
    example: "1234",
  })
  @IsString()
  @Length(4, 4)
  code: string;

  @ApiProperty({
    description: "New password (minimum 8 characters, must contain a number)",
    example: "newPassword123",
  })
  @IsString()
  @Length(8)
  newPassword: string;
}

export class VerifyCodeDto {
  @ApiProperty({
    description: "User's email address",
    example: "user@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "4-digit verification code sent to email",
    example: "1234",
  })
  @IsString()
  @Length(4, 4)
  code: string;
}
