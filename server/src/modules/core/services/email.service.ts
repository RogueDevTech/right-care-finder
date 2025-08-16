import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sgMail from "@sendgrid/mail";

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    const sendGridApiKey = this.configService.get<string>("SENDGRID_API_KEY");
    if (sendGridApiKey) {
      sgMail.setApiKey(sendGridApiKey);
    }
  }

  async sendEmail({
    to,
    subject,
    html,
    from,
  }: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<void> {
    const fromEmail =
      from ||
      this.configService.get<string>("SENDGRID_FROM_EMAIL") ||
      "noreply@favina.com";
    const msg = {
      to,
      from: fromEmail,
      subject,
      html,
    };

    try {
      await sgMail.send(msg);
    } catch (error: any) {
      console.error("SendGrid error:", error);
      throw new BadRequestException("Failed to send email");
    }
  }
}
