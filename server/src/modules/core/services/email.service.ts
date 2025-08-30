import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sgMail from "@sendgrid/mail";

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    const sendGridApiKey = this.configService.get<string>("SENDGRID_API_KEY");
    console.log("SendGrid API Key configured:", sendGridApiKey ? "Yes" : "No");
    if (sendGridApiKey) {
      sgMail.setApiKey(sendGridApiKey);
    } else {
      console.warn("SENDGRID_API_KEY not found in environment variables");
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
      "noreply@rightcarefinder.com";
    const msg = {
      to,
      from: fromEmail,
      subject,
      html,
    };

    try {
      console.log("Attempting to send email to:", to);
      console.log("From email:", fromEmail);
      await sgMail.send(msg);
      console.log("Email sent successfully to:", to);
    } catch (error: any) {
      console.error("SendGrid error:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        response: error.response?.body,
      });
      throw new BadRequestException("Failed to send email");
    }
  }
}
