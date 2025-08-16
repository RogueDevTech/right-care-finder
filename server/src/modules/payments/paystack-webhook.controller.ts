import {
  Controller,
  Post,
  Body,
  Headers,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { PaystackService, PaystackWebhookData } from "./paystack.service";
import * as crypto from "crypto";

@Controller("webhooks/paystack")
export class PaystackWebhookController {
  private readonly logger = new Logger(PaystackWebhookController.name);

  constructor(private readonly paystackService: PaystackService) {}

  @Post()
  async handleWebhook(
    @Body() webhookData: PaystackWebhookData,
    @Headers("x-paystack-signature") signature: string,
  ) {
    try {
      // Verify webhook signature
      if (!this.verifyWebhookSignature(webhookData, signature)) {
        this.logger.warn("Invalid webhook signature");
        throw new BadRequestException("Invalid webhook signature");
      }

      this.logger.log(`Received webhook event: ${webhookData.event}`);

      // Process the webhook
      await this.paystackService.handleWebhook(webhookData);

      return { status: "success" };
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`);
      throw error;
    }
  }

  private verifyWebhookSignature(payload: any, signature: string): boolean {
    try {
      const secret = process.env.PAYSTACK_SECRET_KEY;
      if (!secret) {
        this.logger.error("PAYSTACK_SECRET_KEY not configured");
        return false;
      }

      const hash = crypto
        .createHmac("sha512", secret)
        .update(JSON.stringify(payload))
        .digest("hex");

      return hash === signature;
    } catch (error) {
      this.logger.error(`Error verifying webhook signature: ${error.message}`);
      return false;
    }
  }
}
