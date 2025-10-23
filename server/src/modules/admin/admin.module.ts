import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { InvitationService } from "./invitation.service";
import { ConfigController } from "./config.controller";
import { ConfigService } from "./config.service";
import { InvitationsController } from "./invitations.controller";
import { UsersModule } from "../users/users.module";
import { HealthcareHomesModule } from "../healthcare-homes/healthcare-homes.module";
import { CareType } from "../healthcare-homes/entities/care-type.entity";
import { Specialization } from "../healthcare-homes/entities/specialization.entity";
import { CareHomeFacility } from "../healthcare-homes/entities/care-home-facility.entity";
import { CareHome } from "../healthcare-homes/entities/care-home.entity";
import { Invitation } from "./entities/invitation.entity";
import { User } from "../users/entities/user.entity";
import { BcryptService } from "../core/services/bcrypt.service";

@Module({
  imports: [
    forwardRef(() => UsersModule),
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
  controllers: [AdminController, ConfigController, InvitationsController],
  providers: [AdminService, ConfigService, InvitationService, BcryptService],
  exports: [AdminService, ConfigService, InvitationService],
})
export class AdminModule {}
