import { User } from "../modules/users/entities/user.entity";
import { Address } from "../modules/users/entities/address.entity";
import { CareHome } from "../modules/healthcare-homes/entities/care-home.entity";
import { CareType } from "../modules/healthcare-homes/entities/care-type.entity";
import { Specialization } from "../modules/healthcare-homes/entities/specialization.entity";
import { CareHomeFacility } from "../modules/healthcare-homes/entities/care-home-facility.entity";
import { CareHomeImage } from "../modules/healthcare-homes/entities/care-home-image.entity";
import { CareHomeReview } from "../modules/healthcare-homes/entities/care-home-review.entity";
import { Invitation } from "../modules/admin/entities/invitation.entity";

export const entities = {
  User,
  Address,
  CareHome,
  CareType,
  Specialization,
  CareHomeFacility,
  CareHomeImage,
  CareHomeReview,
  Invitation,
};

export {
  User,
  Address,
  CareHome,
  CareType,
  Specialization,
  CareHomeFacility,
  CareHomeImage,
  CareHomeReview,
  Invitation,
};
