import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { User, UserRole } from "../users/entities/user.entity";
import { RegisterDto } from "./dto/register.dto";
import { BcryptService } from "../core/services/bcrypt.service";
import { PasswordResetService } from "./password-reset.service";
import { ContactSupportDto } from "./dto/contact-support.dto";
import { EmailService } from "../core/services/email.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    private passwordResetService: PasswordResetService,
    private emailService: EmailService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<Omit<User, "password"> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await this.bcryptService.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userData: { email: string; password: string }) {
    const user = await this.validateUser(userData.email, userData.password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Update lastLoginAt
    await this.usersService.update(user.id, { lastLoginAt: new Date() });

    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      token: access_token,
      user: this.mapUserToResponse(user),
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.usersService.findByEmail(
        registerDto.email
      );
      console.log(existingUser, "existingUserexistingUserexistingUser");
      if (existingUser) {
        throw new ConflictException("Email already exists");
      }

      const hashedPassword = await this.bcryptService.hash(
        registerDto.password
      );
      const user = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        isEmailVerified: false,
        isActive: true,
        orders: [],
        payments: [],
        wishlists: [],
      });

      return this.mapUserToResponse(user);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException("Registration failed. Please try again.");
    }
  }

  async contactSupport(contactSupportDto: ContactSupportDto): Promise<void> {
    const supportEmail = process.env.SUPPORT_EMAIL;
    const { firstName, lastName, email, subject, message } = contactSupportDto;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Contact Support Message</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px;">${message}</div>
      </div>
    `;
    await this.emailService.sendEmail({
      to: supportEmail,
      subject: `[Support] ${subject}`,
      html,
      from: supportEmail,
    });
  }

  mapUserToResponse(user: Omit<User, "password">) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      lastLoginAt: user.lastLoginAt,
    };
  }

  // Password reset methods
  async sendResetCode(email: string): Promise<void> {
    await this.passwordResetService.sendResetCode(email);
  }

  verifyResetCode(email: string, code: string): boolean {
    return this.passwordResetService.verifyCode(email, code);
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<void> {
    await this.passwordResetService.resetPassword(email, code, newPassword);
  }
}
