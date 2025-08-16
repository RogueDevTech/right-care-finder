import {
  Controller,
  Post,
  Body,
  Version,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  Get,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { BaseResponseDto } from "../../common/dto/base-response.dto";
import { User } from "../users/entities/user.entity";
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyCodeDto,
} from "./dto/forgot-password.dto";
import { ContactSupportDto } from "./dto/contact-support.dto";

@ApiTags("Auth")
@Controller("v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version("v1")
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "User login",
    description: "Authenticates a user and returns a JWT token",
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successfully logged in",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid credentials",
  })
  async login(
    @Body() loginDto: LoginDto
  ): Promise<BaseResponseDto<AuthResponseDto>> {
    const response = await this.authService.login(loginDto);
    return BaseResponseDto.success("Successfully logged in", response);
  }

  @Version("v1")
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "User registration",
    description: "Registers a new user in the system",
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User registered successfully",
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Email already exists",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid input data",
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<
    BaseResponseDto<
      Omit<User, "password" | "orders" | "payments" | "wishlists" | "addresses">
    >
  > {
    const user = await this.authService.register(registerDto);
    return BaseResponseDto.success("User registered successfully", user);
  }

  @Version("v1")
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Send password reset code",
    description: "Sends a 4-digit verification code to the user's email",
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Reset code sent successfully",
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<BaseResponseDto<null>> {
    console.log("firstfirstfirstfirstfirstfirstfirstfirstfirstfirstfirstfirst");

    await this.authService.sendResetCode(forgotPasswordDto.email);
    return BaseResponseDto.success("Reset code sent successfully", null);
  }

  @Version("v1")
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Reset password",
    description: "Resets user password using verification code",
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Password reset successfully",
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid code or password",
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<BaseResponseDto<null>> {
    await this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.code,
      resetPasswordDto.newPassword,
    );
    return BaseResponseDto.success("Password reset successfully", null);
  }


  @Version("v1")
  @Post("contact-support")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Contact support",
    description: "Contacts the support team",
  })
  @ApiBody({ type: ContactSupportDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Support message sent successfully",
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid email",
  })
  async contactSupport(
    @Body() contactSupportDto: ContactSupportDto,
  ): Promise<BaseResponseDto<null>> {
    await this.authService.contactSupport(contactSupportDto);
    return BaseResponseDto.success("Support message sent successfully", null);
  }
}
