import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { PaymentsService } from "./payments.service";
import { PaystackService } from "./paystack.service";
import { PaymentsController } from "./payments.controller";
import { PaystackWebhookController } from "./paystack-webhook.controller";
import { Payment } from "./entities/payment.entity";
import { UsersModule } from "../users/users.module";
import { OrdersModule } from "../orders/orders.module";

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), UsersModule, OrdersModule, ConfigModule],
  providers: [PaymentsService, PaystackService],
  controllers: [PaymentsController, PaystackWebhookController],
  exports: [PaymentsService, PaystackService],
})
export class PaymentsModule {}
