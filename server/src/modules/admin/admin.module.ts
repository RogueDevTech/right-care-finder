import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { InvitationService } from "./invitation.service";
import { ConfigController } from "./config.controller";
import { ConfigService } from "./config.service";
import { UsersModule } from "../users/users.module";
import { HealthcareHomesModule } from "../healthcare-homes/healthcare-homes.module";
import { CareType } from "../healthcare-homes/entities/care-type.entity";
import { Specialization } from "../healthcare-homes/entities/specialization.entity";
import { CareHomeFacility } from "../healthcare-homes/entities/care-home-facility.entity";
import { CareHome } from "../healthcare-homes/entities/care-home.entity";
import { Invitation } from "./entities/invitation.entity";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [
    UsersModule,
    HealthcareHomesModule,
    TypeOrmModule.forFeature([
      CareType,
      Specialization,
      CareHomeFacility,
      CareHome,
      Invitation,
      User,
    ]),
  ],
  controllers: [AdminController, ConfigController],
  providers: [AdminService, ConfigService, InvitationService],
  exports: [AdminService, ConfigService, InvitationService],
})
export class AdminModule {}
