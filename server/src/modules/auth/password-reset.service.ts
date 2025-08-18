import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "../core/services/email.service";
import { UsersService } from "../users/users.service";
import { BcryptService } from "../core/services/bcrypt.service";

interface ResetCodeData {
  code: string;
  expiresAt: number;
  email: string;
}

@Injectable()
export class PasswordResetService {
  private resetCodes = new Map<string, ResetCodeData>();

  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService
  ) {}

  async sendResetCode(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found with this email address");
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Store the code
    this.resetCodes.set(email, {
      code,
      expiresAt,
      email,
    });

    try {
      await this.emailService.sendEmail({
        to: email,
        subject: "Password Reset Code - Right Care Finder",
        html: this.getResetEmailHtml(code),
      });
      console.log(`Reset code ${code} sent to ${email}`);
    } catch (error) {
      console.error("EmailService error:", error);
      throw new BadRequestException(
        "Failed to send reset code email. Please try again later."
      );
    }
  }

  verifyCode(email: string, code: string): boolean {
    const resetData = this.resetCodes.get(email);

    if (!resetData) {
      throw new BadRequestException("No reset code found for this email");
    }

    if (Date.now() > resetData.expiresAt) {
      this.resetCodes.delete(email);
      throw new BadRequestException("Reset code has expired");
    }

    if (resetData.code !== code) {
      throw new BadRequestException("Invalid reset code");
    }

    return true;
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<void> {
    this.verifyCode(email, code);

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const hashedPassword = await this.bcryptService.hash(newPassword);

    await this.usersService.update(user.id, { password: hashedPassword });

    this.resetCodes.delete(email);

    console.log(`Password reset successful for ${email}`);
  }

  private getResetEmailHtml(code: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7a2d2d 0%, #8b3a3a 100%); padding: 30px; border-radius: 12px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Password Reset</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1a1a1a; margin-bottom: 20px;">Your Verification Code</h2>
          <p style="color: #4a5568; margin-bottom: 25px;">
            We received a request to reset your password. Use the verification code below to complete the process:
          </p>
          <div style="background: white; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #7a2d2d; letter-spacing: 8px;">${code}</span>
          </div>
          <p style="color: #4a5568; font-size: 14px; margin-bottom: 25px;">
            This code will expire in 10 minutes. If you didn't request this password reset, please ignore this email.
          </p>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
            <p style="color: #718096; font-size: 12px; margin: 0;">
              Best regards,<br>
              The Right care finder Team
            </p>
          </div>
        </div>
      </div>
    `;
  }

  cleanupExpiredCodes(): void {
    const now = Date.now();
    for (const [email, data] of this.resetCodes.entries()) {
      if (now > data.expiresAt) {
        this.resetCodes.delete(email);
      }
    }
  }
}
