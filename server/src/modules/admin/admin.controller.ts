import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Version,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "./guards/admin.guard";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { CreateCareHomeDto } from "../healthcare-homes/dto/create-care-home.dto";
import { UpdateCareHomeDto } from "../healthcare-homes/dto/update-care-home.dto";
import { UpdateUserDto } from "../users/dto/user.dto";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@ApiTags("Admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("v1/admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Version("v1")
  @Get("dashboard")
  @ApiOperation({
    summary: "Get admin dashboard data",
    description:
      "Retrieves comprehensive dashboard data including total users, care homes, and recent activities",
  })
  @ApiResponse({
    status: 200,
    description: "Returns admin dashboard data",
    schema: {
      type: "object",
      properties: {
        totalUsers: { type: "number", description: "Total number of users" },
        totalCareHomes: {
          type: "number",
          description: "Total number of care homes",
        },
        activeCareHomes: {
          type: "number",
          description: "Number of active care homes",
        },
        verifiedCareHomes: {
          type: "number",
          description: "Number of verified care homes",
        },
        totalReviews: {
          type: "number",
          description: "Total number of reviews",
        },
        recentCareHomes: {
          type: "array",
          description: "List of recent care homes",
        },
      },
    },
  })
  async getDashboardData() {
    return this.adminService.getDashboardData();
  }

  // User Management
  @Version("v1")
  @Get("users")
  @ApiOperation({
    summary: "Get all users",
    description: "Retrieves a list of all registered users in the system",
  })
  @ApiResponse({
    status: 200,
    description: "Returns list of all users",
    type: [UpdateUserDto],
  })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Version("v1")
  @Put("users/:id")
  @ApiOperation({
    summary: "Update user",
    description:
      "Updates user information including email, name, role, and contact details",
  })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: UpdateUserDto,
  })
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Version("v1")
  @Delete("users/:id")
  @ApiOperation({
    summary: "Delete user",
    description: "Permanently removes a user from the system",
  })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User deleted successfully",
  })
  async deleteUser(@Param("id") id: string) {
    return this.adminService.deleteUser(id);
  }

  // Care Home Management
  @Version("v1")
  @Get("care-homes")
  @ApiOperation({
    summary: "Get all care homes",
    description: "Retrieves a list of all care homes in the system",
  })
  @ApiResponse({
    status: 200,
    description: "Returns list of all care homes",
  })
  async getAllCareHomes(
    @Query("search") search?: string,
    @Query("city") city?: string,
    @Query("county") county?: string,
    @Query("careTypeId") careTypeId?: string,
    @Query("isVerified") isVerified?: boolean,
    @Query("isFeatured") isFeatured?: boolean
  ) {
    const filters = {
      search,
      city,
      county,
      careTypeId,
      isVerified,
      isFeatured,
    };
    return this.adminService.getAllCareHomes(filters);
  }

  @Version("v1")
  @Get("care-homes/:id")
  @ApiOperation({
    summary: "Get care home details",
    description: "Retrieves detailed information about a specific care home",
  })
  @ApiParam({ name: "id", description: "Care home ID" })
  @ApiResponse({
    status: 200,
    description: "Returns care home details",
  })
  async getCareHomeDetails(@Param("id") id: string) {
    return this.adminService.getCareHomeDetails(id);
  }

  @Version("v1")
  @Post("care-homes")
  @ApiOperation({
    summary: "Create new care home",
    description:
      "Creates a new care home with specified details including name, address, care type, and facilities",
  })
  @ApiBody({ type: CreateCareHomeDto })
  @ApiResponse({
    status: 201,
    description: "Care home created successfully",
    type: CreateCareHomeDto,
  })
  async createCareHome(@Body() createCareHomeDto: CreateCareHomeDto) {
    return this.adminService.createCareHome(createCareHomeDto);
  }

  @Version("v1")
  @Put("care-homes/:id")
  @ApiOperation({
    summary: "Update care home",
    description:
      "Updates care home information including details, facilities, and verification status",
  })
  @ApiParam({ name: "id", description: "Care home ID" })
  @ApiBody({ type: UpdateCareHomeDto })
  @ApiResponse({
    status: 200,
    description: "Care home updated successfully",
    type: UpdateCareHomeDto,
  })
  async updateCareHome(
    @Param("id") id: string,
    @Body() updateCareHomeDto: UpdateCareHomeDto
  ) {
    return this.adminService.updateCareHome(id, updateCareHomeDto);
  }

  @Version("v1")
  @Delete("care-homes/:id")
  @ApiOperation({
    summary: "Delete care home",
    description: "Permanently removes a care home from the system",
  })
  @ApiParam({ name: "id", description: "Care home ID" })
  @ApiResponse({
    status: 200,
    description: "Care home deleted successfully",
  })
  async deleteCareHome(@Param("id") id: string) {
    return this.adminService.deleteCareHome(id);
  }

  // Analytics
  @Version("v1")
  @Get("analytics/care-homes")
  @ApiOperation({
    summary: "Get care home analytics",
    description:
      "Retrieves care home analytics data for a specified date range including total care homes, reviews, and user engagement",
  })
  @ApiQuery({
    name: "startDate",
    required: true,
    type: Date,
    description: "Start date for analytics (YYYY-MM-DD)",
  })
  @ApiQuery({
    name: "endDate",
    required: true,
    type: Date,
    description: "End date for analytics (YYYY-MM-DD)",
  })
  @ApiResponse({
    status: 200,
    description: "Returns care home analytics data",
    schema: {
      type: "object",
      properties: {
        totalCareHomes: { type: "number", description: "Total care homes" },
        totalReviews: {
          type: "number",
          description: "Total number of reviews",
        },
        averageRating: {
          type: "number",
          description: "Average rating across all care homes",
        },
        careHomesByDate: {
          type: "object",
          description: "Daily care home registrations",
          additionalProperties: { type: "number" },
        },
      },
    },
  })
  async getCareHomeAnalytics(
    @Query("startDate") startDate: Date,
    @Query("endDate") endDate: Date
  ) {
    return this.adminService.getCareHomeAnalytics(startDate, endDate);
  }
}
