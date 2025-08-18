import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { HealthcareHomesService } from "./healthcare-homes.service";
import { CreateCareHomeDto } from "./dto/create-care-home.dto";
import { UpdateCareHomeDto } from "./dto/update-care-home.dto";
import { CareHomeQueryDto } from "./dto/care-home-query.dto";
import { CreateReviewDto } from "./dto/create-review.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Public } from "../auth/decorators/public.decorator";
import { UserRole } from "../users/entities/user.entity";
import { BaseResponseDto } from "../../common/dto/base-response.dto";
import { CareHome } from "./entities/care-home.entity";
import { CareType } from "./entities/care-type.entity";
import { CareHomeFacility } from "./entities/care-home-facility.entity";
import { CareHomeReview } from "./entities/care-home-review.entity";

@ApiTags("Healthcare Homes")
@Controller("healthcare-homes")
export class HealthcareHomesController {
  constructor(
    private readonly healthcareHomesService: HealthcareHomesService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a new care home",
    description:
      "Creates a new care home listing. Requires ADMIN or PROVIDER role.",
  })
  @ApiBody({ type: CreateCareHomeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Care home created successfully",
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized - Invalid or missing JWT token",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad request - Invalid input data",
  })
  async create(
    @Body() createCareHomeDto: CreateCareHomeDto,
    @Request() req: any
  ) {
    const careHome = await this.healthcareHomesService.create(
      createCareHomeDto,
      req.user?.id as string
    );
    return BaseResponseDto.success("Care home created successfully", careHome);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: "Get all care homes",
    description:
      "Retrieves a paginated list of care homes with optional filtering and search capabilities.",
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search term for care home name, description, or city",
  })
  @ApiQuery({ name: "city", required: false, description: "Filter by city" })
  @ApiQuery({
    name: "county",
    required: false,
    description: "Filter by county",
  })
  @ApiQuery({
    name: "postcode",
    required: false,
    description: "Filter by postcode",
  })
  @ApiQuery({
    name: "careTypeId",
    required: false,
    description: "Filter by care type ID",
  })
  @ApiQuery({
    name: "facilityIds",
    required: false,
    description: "Filter by facility IDs (comma-separated)",
  })
  @ApiQuery({
    name: "minPrice",
    required: false,
    description: "Minimum weekly price",
  })
  @ApiQuery({
    name: "maxPrice",
    required: false,
    description: "Maximum weekly price",
  })
  @ApiQuery({
    name: "minRating",
    required: false,
    description: "Minimum rating (1-5)",
  })
  @ApiQuery({
    name: "hasAvailableBeds",
    required: false,
    description: "Filter by available beds",
  })
  @ApiQuery({
    name: "isVerified",
    required: false,
    description: "Filter by verification status",
  })
  @ApiQuery({
    name: "isFeatured",
    required: false,
    description: "Filter by featured status",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page (default: 10)",
  })
  @ApiQuery({
    name: "sortBy",
    required: false,
    description: "Sort field (default: createdAt)",
  })
  @ApiQuery({
    name: "sortOrder",
    required: false,
    description: "Sort order: ASC or DESC (default: DESC)",
  })
  @ApiQuery({
    name: "latitude",
    required: false,
    description: "Latitude for distance calculation",
  })
  @ApiQuery({
    name: "longitude",
    required: false,
    description: "Longitude for distance calculation",
  })
  @ApiQuery({
    name: "radius",
    required: false,
    description: "Radius in miles for distance filtering",
  })
  @ApiQuery({
    name: "cqcRating",
    required: false,
    description: "Filter by CQC rating",
  })
  @ApiQuery({
    name: "ageRestriction",
    required: false,
    description: "Filter by age restriction",
  })
  @ApiQuery({
    name: "acceptingNewResidents",
    required: false,
    description: "Filter by accepting new residents",
  })
  @ApiQuery({
    name: "specializations",
    required: false,
    description: "Filter by specializations (comma-separated)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Care homes retrieved successfully",
    type: BaseResponseDto,
  })
  async findAll(@Query() query: CareHomeQueryDto) {
    const result = await this.healthcareHomesService.findAll(query);
    return BaseResponseDto.success("Care homes retrieved successfully", result);
  }

  @Get("featured")
  @Public()
  @ApiOperation({
    summary: "Get featured care homes",
    description:
      "Retrieves a list of featured care homes for display on the homepage.",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of featured care homes to return (default: 6)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Featured care homes retrieved successfully",
    type: BaseResponseDto,
  })
  async getFeatured(@Query("limit") limit: number = 6) {
    const featuredHomes =
      await this.healthcareHomesService.getFeaturedCareHomes(limit);
    return BaseResponseDto.success(
      "Featured care homes retrieved successfully",
      featuredHomes
    );
  }

  @Get("nearby")
  @Public()
  @ApiOperation({
    summary: "Get nearby care homes",
    description:
      "Retrieves care homes within a specified radius of given coordinates.",
  })
  @ApiQuery({
    name: "latitude",
    required: true,
    description: "Latitude coordinate",
  })
  @ApiQuery({
    name: "longitude",
    required: true,
    description: "Longitude coordinate",
  })
  @ApiQuery({
    name: "radius",
    required: false,
    description: "Radius in miles (default: 10)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Nearby care homes retrieved successfully",
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad request - Invalid coordinates",
  })
  async getNearby(
    @Query("latitude") latitude: number,
    @Query("longitude") longitude: number,
    @Query("radius") radius: number = 10
  ) {
    const nearbyHomes = await this.healthcareHomesService.getNearbyCareHomes(
      latitude,
      longitude,
      radius
    );
    return BaseResponseDto.success(
      "Nearby care homes retrieved successfully",
      nearbyHomes
    );
  }

  @Get("care-types")
  @Public()
  @ApiOperation({
    summary: "Get all care types",
    description: "Retrieves all available care types for filtering care homes.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Care types retrieved successfully",
    type: BaseResponseDto,
  })
  async getCareTypes() {
    const careTypes = await this.healthcareHomesService.getCareTypes();
    return BaseResponseDto.success(
      "Care types retrieved successfully",
      careTypes
    );
  }

  @Get("facilities")
  @Public()
  @ApiOperation({
    summary: "Get all facilities",
    description:
      "Retrieves all available facilities/amenities for filtering care homes.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Facilities retrieved successfully",
    type: BaseResponseDto,
  })
  async getFacilities() {
    const facilities = await this.healthcareHomesService.getFacilities();
    return BaseResponseDto.success(
      "Facilities retrieved successfully",
      facilities
    );
  }

  @Get(":id")
  @Public()
  @ApiOperation({
    summary: "Get care home by ID",
    description: "Retrieves detailed information about a specific care home.",
  })
  @ApiParam({ name: "id", description: "Care home ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Care home retrieved successfully",
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Care home not found",
  })
  async findOne(@Param("id") id: string) {
    const careHome = await this.healthcareHomesService.findOne(id);
    return BaseResponseDto.success(
      "Care home retrieved successfully",
      careHome
    );
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update a care home",
    description:
      "Updates an existing care home. Requires ADMIN or PROVIDER role.",
  })
  @ApiParam({ name: "id", description: "Care home ID" })
  @ApiBody({ type: UpdateCareHomeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Care home updated successfully",
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Care home not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized - Invalid or missing JWT token",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Insufficient permissions",
  })
  async update(
    @Param("id") id: string,
    @Body() updateCareHomeDto: UpdateCareHomeDto
  ) {
    const careHome = await this.healthcareHomesService.update(
      id,
      updateCareHomeDto
    );
    return BaseResponseDto.success("Care home updated successfully", careHome);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete a care home",
    description: "Deletes a care home. Requires ADMIN role.",
  })
  @ApiParam({ name: "id", description: "Care home ID" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Care home deleted successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Care home not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized - Invalid or missing JWT token",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Insufficient permissions",
  })
  async remove(@Param("id") id: string) {
    await this.healthcareHomesService.remove(id);
  }

  @Post(":id/reviews")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Add a review to a care home",
    description:
      "Adds a user review to a specific care home. Requires authentication.",
  })
  @ApiParam({ name: "id", description: "Care home ID" })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Review added successfully",
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Care home not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized - Invalid or missing JWT token",
  })
  async addReview(
    @Param("id") id: string,
    @Body() createReviewDto: CreateReviewDto,
    @Request() req: any
  ) {
    const review = await this.healthcareHomesService.addReview(
      id,
      createReviewDto,
      req.user?.id as string
    );
    return BaseResponseDto.success("Review added successfully", review);
  }
}
