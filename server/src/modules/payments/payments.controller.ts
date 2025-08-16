import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PaystackService } from "./paystack.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";
import { BaseResponseDto } from "../../common/dto/base-response.dto";
import { Payment } from "./entities/payment.entity";
import { CreatePaymentDto } from "./dto/create-payment.dto";

@Controller("v1/payments")
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paystackService: PaystackService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<BaseResponseDto<Payment>> {
    const payment = await this.paymentsService.create(createPaymentDto);
    return BaseResponseDto.success("Payment created successfully", payment);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<BaseResponseDto<Payment[]>> {
    const payments = await this.paymentsService.findAll();
    return BaseResponseDto.success("Payments retrieved successfully", payments);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<BaseResponseDto<Payment>> {
    const payment = await this.paymentsService.findOne(id);
    return BaseResponseDto.success("Payment retrieved successfully", payment);
  }

  @Post(":id/process")
  async processPayment(
    @Param("id") id: string,
  ): Promise<BaseResponseDto<Payment>> {
    const payment = await this.paymentsService.processPayment(id);
    return BaseResponseDto.success("Payment processed successfully", payment);
  }

  @Post(":id/refund")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async refundPayment(
    @Param("id") id: string,
  ): Promise<BaseResponseDto<Payment>> {
    const payment = await this.paymentsService.refundPayment(id);
    return BaseResponseDto.success("Payment refunded successfully", payment);
  }

  @Post(":id/cancel")
  async cancelPayment(
    @Param("id") id: string,
  ): Promise<BaseResponseDto<Payment>> {
    const payment = await this.paymentsService.cancelPayment(id);
    return BaseResponseDto.success("Payment cancelled successfully", payment);
  }

  // Paystack endpoints
  @Post("paystack/initialize")
  async initializePaystackPayment(
    @Body()
    paymentData: {
      email: string;
      amount: number;
      reference: string;
      callback_url?: string;
      metadata?: Record<string, unknown>;
    },
  ): Promise<BaseResponseDto<Record<string, unknown>>> {
    const result = await this.paystackService.initializePayment(paymentData);
    return BaseResponseDto.success(
      "Payment initialized successfully",
      result as Record<string, unknown>,
    );
  }

  @Get("paystack/verify/:reference")
  async verifyPaystackPayment(
    @Param("reference") reference: string,
  ): Promise<BaseResponseDto<Record<string, unknown>>> {
    const result = await this.paystackService.verifyPayment(reference);
    return BaseResponseDto.success(
      "Payment verified successfully",
      result as Record<string, unknown>,
    );
  }
}
