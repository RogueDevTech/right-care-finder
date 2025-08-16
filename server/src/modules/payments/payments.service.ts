import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment, PaymentStatus } from "./entities/payment.entity";
import { OrdersService } from "../orders/orders.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { OrderStatus } from "../orders/entities/order.entity";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private ordersService: OrdersService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { orderId, ...paymentData } = createPaymentDto;
    const order = await this.ordersService.findOne(orderId);

    const payment = this.paymentsRepository.create({
      ...paymentData,
      order,
      amount: order.totalAmount,
      status: PaymentStatus.PENDING,
    });

    return (await this.paymentsRepository.save(payment)) as unknown as Payment;
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentsRepository.find({
      relations: ["user", "order"],
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ["user", "order"],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async processPayment(id: string): Promise<Payment> {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException("Payment is not in pending status");
    }

    try {
      // Here you would integrate with actual payment gateways
      // For now, we'll simulate a successful payment
      payment.status = PaymentStatus.COMPLETED;
      payment.transactionId = `txn_${Date.now()}`;

      // Update order status if payment is successful
      if (payment.status === PaymentStatus.COMPLETED) {
        await this.ordersService.updateStatus(
          payment.order.id,
          OrderStatus.PROCESSING,
        );
      }

      return await this.paymentsRepository.save(payment);
    } catch (error: unknown) {
      payment.status = PaymentStatus.FAILED;
      payment.errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await this.paymentsRepository.save(payment);
      // throw error;
    }
  }

  async refundPayment(id: string): Promise<Payment> {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException("Only completed payments can be refunded");
    }

    try {
      // Here you would integrate with actual payment gateways for refund
      // For now, we'll simulate a successful refund
      payment.status = PaymentStatus.REFUNDED;

      // Update order status if refund is successful
      if (payment.status === PaymentStatus.REFUNDED) {
        await this.ordersService.updateStatus(
          payment.order.id,
          OrderStatus.REFUNDED,
        );
      }

      return await this.paymentsRepository.save(payment);
    } catch (error: unknown) {
      payment.errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await this.paymentsRepository.save(payment);
      // throw error;
    }
  }

  async cancelPayment(id: string): Promise<Payment> {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException("Only pending payments can be cancelled");
    }

    payment.status = PaymentStatus.CANCELLED;
    return await this.paymentsRepository.save(payment);
  }
}
