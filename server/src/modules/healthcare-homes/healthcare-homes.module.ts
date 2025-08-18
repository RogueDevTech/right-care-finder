import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthcareHomesService } from "./healthcare-homes.service";
import { HealthcareHomesController } from "./healthcare-homes.controller";
import { CareHome } from "./entities/care-home.entity";
import { CareType } from "./entities/care-type.entity";
import { CareHomeFacility } from "./entities/care-home-facility.entity";
import { CareHomeImage } from "./entities/care-home-image.entity";
import { CareHomeReview } from "./entities/care-home-review.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CareHome,
      CareType,
      CareHomeFacility,
      CareHomeImage,
      CareHomeReview,
    ]),
  ],
  controllers: [HealthcareHomesController],
  providers: [HealthcareHomesService],
  exports: [HealthcareHomesService],
})
export class HealthcareHomesModule {}
