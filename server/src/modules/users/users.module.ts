import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { Address } from "./entities/address.entity";
import { Invitation } from "../admin/entities/invitation.entity";
import { CareHome } from "../healthcare-homes/entities/care-home.entity";
import { AdminModule } from "../admin/admin.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, Invitation, CareHome]),
    forwardRef(() => AdminModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
