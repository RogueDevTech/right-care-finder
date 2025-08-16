import { UserResponseDto } from "@/modules/users/dto/user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
  @ApiProperty({
    description: "JWT access token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  token: string;

  @ApiProperty({
    description: "User information",
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
