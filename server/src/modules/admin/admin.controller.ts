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
import { CreateProductDto } from "../products/dto/create-product.dto";
import { UpdateProductDto } from "../products/dto/update-product.dto";
import { UpdateOrderDto } from "../orders/dto/update-order.dto";
import { UpdateUserDto } from "../users/dto/user.dto";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { ChartDataDto } from "./dto/chart-data.dto";
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
      "Retrieves comprehensive dashboard data including total users, orders, products, revenue, and recent activities",
  })
  @ApiResponse({
    status: 200,
    description: "Returns admin dashboard data",
    schema: {
      type: "object",
      properties: {
        totalUsers: { type: "number", description: "Total number of users" },
        totalOrders: { type: "number", description: "Total number of orders" },
        totalProducts: {
          type: "number",
          description: "Total number of products",
        },
        revenue: { type: "number", description: "Total revenue" },
        pendingOrders: {
          type: "number",
          description: "Number of pending orders",
        },
        recentOrders: { type: "array", description: "List of recent orders" },
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
    @Body() updateUserDto: UpdateUserDto,
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

  // Order Management
  @Version("v1")
  @Get("orders")
  @ApiOperation({
    summary: "Get all orders",
    description: "Retrieves a list of all orders in the system",
  })
  @ApiResponse({
    status: 200,
    description: "Returns list of all orders",
  })
  async getAllOrders(
    @Query("search") search?: string,
    @Query("status") status?: string,
    @Query("minAmount") minAmount?: string,
    @Query("maxAmount") maxAmount?: string,
    @Query("dateRange") dateRange?: string,
  ) {
    const filters = {
      search,
      status,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
      dateRange,
    };
    return this.adminService.getAllOrders(filters);
  }

  @Version("v1")
  @Get("orders/:id")
  @ApiOperation({
    summary: "Get order details",
    description: "Retrieves detailed information about a specific order",
  })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Returns order details",
  })
  async getOrderDetails(@Param("id") id: string) {
    return this.adminService.getOrderDetails(id);
  }

  @Version("v1")
  @Put("orders/:id")
  @ApiOperation({
    summary: "Update order status",
    description: "Updates the status and tracking information of an order",
  })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: "Order updated successfully",
    type: UpdateOrderDto,
  })
  async updateOrderStatus(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.adminService.updateOrderStatus(id, updateOrderDto);
  }

  // Product Management
  @Version("v1")
  @Post("products")
  @ApiOperation({
    summary: "Create new product",
    description:
      "Creates a new product with specified details including name, price, stock, and category",
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: "Product created successfully",
    type: CreateProductDto,
  })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.adminService.createProduct(createProductDto);
  }

  @Version("v1")
  @Put("products/:id")
  @ApiOperation({
    summary: "Update product",
    description:
      "Updates product information including price, stock, and other details",
  })
  @ApiParam({ name: "id", description: "Product ID" })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: "Product updated successfully",
    type: UpdateProductDto,
  })
  async updateProduct(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.adminService.updateProduct(id, updateProductDto);
  }

  @Version("v1")
  @Delete("products/:id")
  @ApiOperation({
    summary: "Delete product",
    description: "Permanently removes a product from the system",
  })
  @ApiParam({ name: "id", description: "Product ID" })
  @ApiResponse({
    status: 200,
    description: "Product deleted successfully",
  })
  async deleteProduct(@Param("id") id: string) {
    return this.adminService.deleteProduct(id);
  }

  // Analytics
  @Version("v1")
  @Get("analytics/sales")
  @ApiOperation({
    summary: "Get sales analytics",
    description:
      "Retrieves sales analytics data for a specified date range including total sales, order count, and average order value",
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
    description: "Returns sales analytics data",
    schema: {
      type: "object",
      properties: {
        totalSales: { type: "number", description: "Total sales amount" },
        orderCount: { type: "number", description: "Total number of orders" },
        averageOrderValue: {
          type: "number",
          description: "Average value per order",
        },
        salesByDate: {
          type: "object",
          description: "Daily sales breakdown",
          additionalProperties: { type: "number" },
        },
      },
    },
  })
  async getSalesAnalytics(
    @Query("startDate") startDate: Date,
    @Query("endDate") endDate: Date,
  ) {
    return this.adminService.getSalesAnalytics(startDate, endDate);
  }

  @Get("dashboard/charts")
  @ApiOperation({
    summary: "Get dashboard chart data",
    description:
      "Retrieves data for dashboard charts including top categories, revenue by day, order status distribution, and top products",
  })
  @ApiResponse({
    status: 200,
    description: "Returns chart data for dashboard visualization",
    type: ChartDataDto,
  })
  async getChartData(): Promise<ChartDataDto> {
    return this.adminService.getChartData();
  }

  @Get("dashboard/recent-orders")
  @ApiOperation({
    summary: "Get recent orders",
    description: "Retrieves the most recent orders for the dashboard",
  })
  @ApiResponse({
    status: 200,
    description: "Returns list of recent orders",
  })
  async getRecentOrders() {
    return this.adminService.getRecentOrders();
  }
}
