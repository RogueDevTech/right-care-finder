import { PartialType } from "@nestjs/mapped-types";
import { CreateCareHomeDto } from "./create-care-home.dto";

export class UpdateCareHomeDto extends PartialType(CreateCareHomeDto) {}
