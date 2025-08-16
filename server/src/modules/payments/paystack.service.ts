import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OrdersService } from "../orders/orders.service";
import { PaymentsService } from "./payments.service";
import { CreateOrderDto } from "../orders/dto/create-order.dto";
import { PaymentMethod } from "./entities/payment.entity";
import { OrderStatus } from "../orders/entities/order.entity";

export interface PaystackWebhookData {
  event: string;
  data: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    paid_amount: number;
    paid_at: string;
    channel: string;
    currency: string;
    fees: number;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
    };
    metadata: {
      order_id?: string;
      user_id?: string;
      cart_items?: string;
      shipping_address?: string;
      billing_address?: string;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string;
    };
    gateway_response: string;
    ip_address: string;
    log: any;
    fees_split: any;
    plan: string;
    split: any;
    order_id: string;
    createdAt: string;
    updatedAt: string;
  };
}

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly secretKey: string;

  constructor(
    private configService: ConfigService,
    private ordersService: OrdersService,
    private paymentsService: PaymentsService,
  ) {
    this.secretKey = this.configService.get<string>("PAYSTACK_SECRET_KEY");
  }

  async verifyPayment(reference: string): Promise<unknown> {
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Paystack API error: ${response.statusText}`);
      }

      const data = (await response.json()) as unknown;
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Error verifying payment: ${errorMessage}`);
      throw error;
    }
  }

  async handleWebhook(webhookData: PaystackWebhookData): Promise<void> {
    try {
      this.logger.log(`Processing webhook event: ${webhookData.event}`);

      if (webhookData.event === "charge.success") {
        await this.handleSuccessfulPayment(webhookData.data);
      } else if (webhookData.event === "charge.failed") {
        this.handleFailedPayment(webhookData.data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Error processing webhook: ${errorMessage}`);
      throw error;
    }
  }

  private async handleSuccessfulPayment(
    paymentData: PaystackWebhookData["data"],
  ): Promise<void> {
    try {
      const { reference, metadata, authorization } = paymentData;

      // Define types for parsed data
      interface CartItem {
        productId: string;
        quantity: number;
      }

      interface ShippingAddress {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
      }

      // Parse metadata with proper typing
      const userId = metadata?.user_id;
      const cartItems: CartItem[] = metadata?.cart_items
        ? (JSON.parse(metadata.cart_items) as CartItem[])
        : [];
      const shippingAddress: ShippingAddress = metadata?.shipping_address
        ? (JSON.parse(metadata.shipping_address) as ShippingAddress)
        : {
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
          };

      if (!userId || !cartItems.length) {
        throw new Error("Missing required metadata for order creation");
      }

      // Create order DTO
      const createOrderDto: CreateOrderDto = {
        items: cartItems.map((item: CartItem) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress,
      };

      // Create order
      const order = await this.ordersService.create(createOrderDto, userId);

      // Update order status to processing
      await this.ordersService.updateStatus(order.id, OrderStatus.PROCESSING);

      // Create payment record
      await this.paymentsService.create({
        orderId: order.id,
        method: this.mapPaystackChannelToPaymentMethod(authorization?.channel),
        transactionId: reference,
      });

      this.logger.log(
        `Order created successfully: ${order.id} for payment: ${reference}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Error handling successful payment: ${errorMessage}`);
      throw error;
    }
  }

  private handleFailedPayment(paymentData: PaystackWebhookData["data"]): void {
    try {
      const { reference, gateway_response } = paymentData;

      // Log failed payment
      this.logger.warn(
        `Payment failed: ${reference}, Reason: ${gateway_response}`,
      );

      // You might want to update any pending orders or send notifications here
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Error handling failed payment: ${errorMessage}`);
      throw error;
    }
  }

  private mapPaystackChannelToPaymentMethod(channel: string): PaymentMethod {
    switch (channel?.toLowerCase()) {
      case "card":
        return PaymentMethod.CREDIT_CARD;
      case "bank":
        return PaymentMethod.BANK_TRANSFER;
      case "ussd":
        return PaymentMethod.BANK_TRANSFER;
      case "qr":
        return PaymentMethod.BANK_TRANSFER;
      default:
        return PaymentMethod.CREDIT_CARD;
    }
  }

  async initializePayment(paymentData: {
    email: string;
    amount: number;
    reference: string;
    callback_url?: string;
    metadata?: any;
  }): Promise<any> {
    try {
      const response = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        },
      );

      if (!response.ok) {
        throw new Error(`Paystack API error: ${response.statusText}`);
      }

      const data = (await response.json()) as unknown;
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Error initializing payment: ${errorMessage}`);
      throw error;
    }
  }
}
