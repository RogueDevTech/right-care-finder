import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { ConfigController } from "./config.controller";
import { ConfigService } from "./config.service";
import { UsersModule } from "../users/users.module";
import { HealthcareHomesModule } from "../healthcare-homes/healthcare-homes.module";
import { CareType } from "../healthcare-homes/entities/care-type.entity";
import { Specialization } from "../healthcare-homes/entities/specialization.entity";
import { CareHomeFacility } from "../healthcare-homes/entities/care-home-facility.entity";

@Module({
  imports: [
    UsersModule,
    HealthcareHomesModule,
    TypeOrmModule.forFeature([CareType, Specialization, CareHomeFacility]),
  ],
  controllers: [AdminController, ConfigController],
  providers: [AdminService, ConfigService],
  exports: [AdminService, ConfigService],
})
export class AdminModule {}
