import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Version,
  ParseIntPipe,
} from "@nestjs/common";
import { ConfigService } from "./config.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "./guards/admin.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import {
  CreateCareTypeDto,
  UpdateCareTypeDto,
  CareTypeResponseDto,
} from "../healthcare-homes/dto/care-type.dto";
import {
  CreateSpecializationDto,
  UpdateSpecializationDto,
  SpecializationResponseDto,
} from "../healthcare-homes/dto/specialization.dto";
import {
  CreateFacilityDto,
  UpdateFacilityDto,
  FacilityResponseDto,
} from "../healthcare-homes/dto/facility.dto";

@ApiTags("Admin Configuration")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("v1/admin/config")
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  // Care Type Endpoints
  @Version("v1")
  @Get("care-types")
  @ApiOperation({
    summary: "Get all care types",
    description: "Retrieves a list of all care types in the system",
  })
  @ApiResponse({
    status: 200,
    description: "Returns list of all care types",
    type: [CareTypeResponseDto],
  })
  async getAllCareTypes() {
    return this.configService.getAllCareTypes();
  }

  @Version("v1")
  @Get("care-types/:id")
  @ApiOperation({
    summary: "Get care type by ID",
    description: "Retrieves a specific care type by its ID",
  })
  @ApiParam({ name: "id", description: "Care type ID", type: "number" })
  @ApiResponse({
    status: 200,
    description: "Returns care type details",
    type: CareTypeResponseDto,
  })
  async getCareTypeById(@Param("id", ParseIntPipe) id: number) {
    return this.configService.getCareTypeById(id);
  }

  @Version("v1")
  @Post("care-types")
  @ApiOperation({
    summary: "Create new care type",
    description: "Creates a new care type with specified details",
  })
  @ApiBody({ type: CreateCareTypeDto })
  @ApiResponse({
    status: 201,
    description: "Care type created successfully",
    type: CareTypeResponseDto,
  })
  async createCareType(@Body() createCareTypeDto: CreateCareTypeDto) {
    return this.configService.createCareType(createCareTypeDto);
  }

  @Version("v1")
  @Put("care-types/:id")
  @ApiOperation({
    summary: "Update care type",
    description: "Updates an existing care type with new information",
  })
  @ApiParam({ name: "id", description: "Care type ID", type: "number" })
  @ApiBody({ type: UpdateCareTypeDto })
  @ApiResponse({
    status: 200,
    description: "Care type updated successfully",
    type: CareTypeResponseDto,
  })
  async updateCareType(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCareTypeDto: UpdateCareTypeDto
  ) {
    return this.configService.updateCareType(id, updateCareTypeDto);
  }

  @Version("v1")
  @Delete("care-types/:id")
  @ApiOperation({
    summary: "Delete care type",
    description: "Permanently removes a care type from the system",
  })
  @ApiParam({ name: "id", description: "Care type ID", type: "number" })
  @ApiResponse({
    status: 200,
    description: "Care type deleted successfully",
  })
  async deleteCareType(@Param("id", ParseIntPipe) id: number) {
    return this.configService.deleteCareType(id);
  }

  // Specialization Endpoints
  @Version("v1")
  @Get("specializations")
  @ApiOperation({
    summary: "Get all specializations",
    description: "Retrieves a list of all specializations in the system",
  })
  @ApiResponse({
    status: 200,
    description: "Returns list of all specializations",
    type: [SpecializationResponseDto],
  })
  async getAllSpecializations() {
    return this.configService.getAllSpecializations();
  }

  @Version("v1")
  @Get("specializations/:id")
  @ApiOperation({
    summary: "Get specialization by ID",
    description: "Retrieves a specific specialization by its ID",
  })
  @ApiParam({ name: "id", description: "Specialization ID", type: "number" })
  @ApiResponse({
    status: 200,
    description: "Returns specialization details",
    type: SpecializationResponseDto,
  })
  async getSpecializationById(@Param("id", ParseIntPipe) id: number) {
    return this.configService.getSpecializationById(id);
  }

  @Version("v1")
  @Post("specializations")
  @ApiOperation({
    summary: "Create new specialization",
    description: "Creates a new specialization with specified details",
  })
  @ApiBody({ type: CreateSpecializationDto })
  @ApiResponse({
    status: 201,
    description: "Specialization created successfully",
    type: SpecializationResponseDto,
  })
  async createSpecialization(
    @Body() createSpecializationDto: CreateSpecializationDto
  ) {
    return this.configService.createSpecialization(createSpecializationDto);
  }

  @Version("v1")
  @Put("specializations/:id")
  @ApiOperation({
    summary: "Update specialization",
    description: "Updates an existing specialization with new information",
  })
  @ApiParam({ name: "id", description: "Specialization ID", type: "number" })
  @ApiBody({ type: UpdateSpecializationDto })
  @ApiResponse({
    status: 200,
    description: "Specialization updated successfully",
    type: SpecializationResponseDto,
  })
  async updateSpecialization(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSpecializationDto: UpdateSpecializationDto
  ) {
    return this.configService.updateSpecialization(id, updateSpecializationDto);
  }

  @Version("v1")
  @Delete("specializations/:id")
  @ApiOperation({
    summary: "Delete specialization",
    description: "Permanently removes a specialization from the system",
  })
  @ApiParam({ name: "id", description: "Specialization ID", type: "number" })
  @ApiResponse({
    status: 200,
    description: "Specialization deleted successfully",
  })
  async deleteSpecialization(@Param("id", ParseIntPipe) id: number) {
    return this.configService.deleteSpecialization(id);
  }

  // Facility Endpoints
  @Version("v1")
  @Get("facilities")
  @ApiOperation({
    summary: "Get all facilities",
    description: "Retrieves a list of all facilities in the system",
  })
  @ApiResponse({
    status: 200,
    description: "Returns list of all facilities",
    type: [FacilityResponseDto],
  })
  async getAllFacilities() {
    return this.configService.getAllFacilities();
  }

  @Version("v1")
  @Get("facilities/:id")
  @ApiOperation({
    summary: "Get facility by ID",
    description: "Retrieves a specific facility by its ID",
  })
  @ApiParam({ name: "id", description: "Facility ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Returns facility details",
    type: FacilityResponseDto,
  })
  async getFacilityById(@Param("id") id: string) {
    return this.configService.getFacilityById(id);
  }

  @Version("v1")
  @Post("facilities")
  @ApiOperation({
    summary: "Create new facility",
    description: "Creates a new facility with specified details",
  })
  @ApiBody({ type: CreateFacilityDto })
  @ApiResponse({
    status: 201,
    description: "Facility created successfully",
    type: FacilityResponseDto,
  })
  async createFacility(@Body() createFacilityDto: CreateFacilityDto) {
    return this.configService.createFacility(createFacilityDto);
  }

  @Version("v1")
  @Put("facilities/:id")
  @ApiOperation({
    summary: "Update facility",
    description: "Updates an existing facility with new information",
  })
  @ApiParam({ name: "id", description: "Facility ID", type: "string" })
  @ApiBody({ type: UpdateFacilityDto })
  @ApiResponse({
    status: 200,
    description: "Facility updated successfully",
    type: FacilityResponseDto,
  })
  async updateFacility(
    @Param("id") id: string,
    @Body() updateFacilityDto: UpdateFacilityDto
  ) {
    return this.configService.updateFacility(id, updateFacilityDto);
  }

  @Version("v1")
  @Delete("facilities/:id")
  @ApiOperation({
    summary: "Delete facility",
    description: "Permanently removes a facility from the system",
  })
  @ApiParam({ name: "id", description: "Facility ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Facility deleted successfully",
  })
  async deleteFacility(@Param("id") id: string) {
    return this.configService.deleteFacility(id);
  }
}
