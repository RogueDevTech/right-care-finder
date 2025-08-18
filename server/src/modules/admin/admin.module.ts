import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { UsersModule } from "../users/users.module";
import { HealthcareHomesModule } from "../healthcare-homes/healthcare-homes.module";

@Module({
  imports: [UsersModule, HealthcareHomesModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
