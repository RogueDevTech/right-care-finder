import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ContactSupportDto {
  @ApiProperty({ description: "Sender's first name", example: "John" })
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty({ description: "Sender's name", example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: "Sender's email address",
    example: "john@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Subject of the message",
    example: "Help finding a care home",
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: "Message content",
    example: "I need help finding a suitable care home for my mother...",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
