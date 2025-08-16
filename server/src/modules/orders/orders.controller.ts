import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";
import { OrderStatus, Order } from "./entities/order.entity";
import { BaseResponseDto } from "../../common/dto/base-response.dto";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

@Controller("v1/orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: RequestWithUser,
  ): Promise<BaseResponseDto<Order>> {
    const order = await this.ordersService.create(createOrderDto, req.user.id);
    return BaseResponseDto.success("Order created successfully", order);
  }

  @Get()
  @ApiOperation({ summary: "Get all orders" })
  @ApiResponse({ status: 200, description: "Return all orders" })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query("search") search?: string,
    @Query("status") status?: string,
    @Query("minAmount") minAmount?: string,
    @Query("maxAmount") maxAmount?: string,
    @Query("dateRange") dateRange?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const filters = {
      search,
      status,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
      dateRange,
    };

    const pageNumber = page ? Math.max(1, parseInt(page) || 1) : 1;
    const limitNumber = limit
      ? Math.max(1, Math.min(100, parseInt(limit) || 10))
      : 10;

    const result = await this.ordersService.findAll(
      filters,
      pageNumber,
      limitNumber,
    );
    return BaseResponseDto.success(
      "Orders retrieved successfully",
      result.data,
    );
  }

  @Get("my-orders")
  @ApiOperation({ summary: "Get current user's orders" })
  @ApiResponse({ status: 200, description: "Return current user's orders" })
  async findMyOrders(
    @Request() req: RequestWithUser,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const pageNumber = page ? Math.max(1, parseInt(page) || 1) : 1;
    const limitNumber = limit
      ? Math.max(1, Math.min(100, parseInt(limit) || 10))
      : 10;

    const result = await this.ordersService.findUserOrders(
      req.user.id,
      pageNumber,
      limitNumber,
    );
    return BaseResponseDto.success(
      "User orders retrieved successfully",
      result.data,
    );
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<BaseResponseDto<Order>> {
    const order = await this.ordersService.findOne(id);
    return BaseResponseDto.success("Order retrieved successfully", order);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<BaseResponseDto<Order>> {
    const order = await this.ordersService.update(id, updateOrderDto);
    return BaseResponseDto.success("Order updated successfully", order);
  }

  @Patch(":id/status")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param("id") id: string,
    @Body("status") status: OrderStatus,
  ): Promise<BaseResponseDto<Order>> {
    const order = await this.ordersService.updateStatus(id, status);
    return BaseResponseDto.success("Order status updated successfully", order);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param("id") id: string): Promise<BaseResponseDto<void>> {
    await this.ordersService.remove(id);
    return BaseResponseDto.success("Order deleted successfully");
  }

  // Order Items endpoints
  @Post(":id/items")
  async addOrderItem(
    @Param("id") id: string,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ): Promise<BaseResponseDto<Order>> {
    const order = await this.ordersService.addOrderItem(id, createOrderItemDto);
    return BaseResponseDto.success("Order item added successfully", order);
  }

  @Delete(":orderId/items/:itemId")
  async removeOrderItem(
    @Param("orderId") orderId: string,
    @Param("itemId") itemId: string,
  ): Promise<BaseResponseDto<Order>> {
    const order = await this.ordersService.removeOrderItem(orderId, itemId);
    return BaseResponseDto.success("Order item removed successfully", order);
  }
}
