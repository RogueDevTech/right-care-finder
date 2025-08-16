import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order, OrderStatus } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import { ProductsService } from "../products/products.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    console.log("Creating order with DTO:", createOrderDto);
    console.log("User ID:", userId);

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    console.log("User found:", user.email);

    // Create order items first
    const orderItems = await Promise.all(
      createOrderDto.items.map(async (item) => {
        console.log("Processing order item:", item);
        const product = await this.productsService.findOne(item.productId);
        console.log("Product found:", product?.name);

        const orderItem = await this.orderItemsRepository.save({
          product,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: product.price * item.quantity,
        });

        console.log("Order item created:", orderItem.id);
        return orderItem;
      }),
    );

    // Calculate total from order items
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + Number(item.totalPrice),
      0,
    );

    // Create order with items and total
    return this.ordersRepository.save({
      user,
      shippingAddress: createOrderDto.shippingAddress,
      totalAmount,
      status: OrderStatus.PENDING,
      orderItems,
    });
  }

  async findAll(
    filters?: {
      search?: string;
      status?: string;
      minAmount?: number;
      maxAmount?: number;
      dateRange?: string;
    },
    page: number = 1,
    limit: number = 10,
  ) {
    const queryBuilder = this.ordersRepository
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.orderItems", "orderItems")
      .leftJoinAndSelect("orderItems.product", "product");

    if (filters?.search) {
      queryBuilder.andWhere(
        "(order.id ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)",
        { search: `%${filters.search}%` },
      );
    }

    if (filters?.status && filters.status !== "all") {
      queryBuilder.andWhere("order.status = :status", {
        status: filters.status,
      });
    }

    if (filters?.minAmount) {
      queryBuilder.andWhere("order.totalAmount >= :minAmount", {
        minAmount: filters.minAmount,
      });
    }

    if (filters?.maxAmount) {
      queryBuilder.andWhere("order.totalAmount <= :maxAmount", {
        maxAmount: filters.maxAmount,
      });
    }

    if (filters?.dateRange) {
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }

      queryBuilder.andWhere("order.createdAt >= :startDate", { startDate });
    }

    // Add pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Get total count for pagination
    const total = await queryBuilder.getCount();

    // Get paginated results
    const orders = await queryBuilder.getMany();

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ["user", "orderItems", "orderItems.product"],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findUserOrders(userId: string, page: number = 1, limit: number = 10) {
    const queryBuilder = this.ordersRepository
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.orderItems", "orderItems")
      .leftJoinAndSelect("orderItems.product", "product")
      .where("order.user.id = :userId", { userId })
      .orderBy("order.createdAt", "DESC");

    // Add pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Get total count for pagination
    const total = await queryBuilder.getCount();

    // Get paginated results
    const orders = await queryBuilder.getMany();

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, updateOrderDto: any): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return await this.ordersRepository.save(order);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return await this.ordersRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }

  async addOrderItem(
    orderId: string,
    createOrderItemDto: { productId: string; quantity: number },
  ): Promise<Order> {
    const order = await this.findOne(orderId);
    const product = await this.productsService.findOne(
      createOrderItemDto.productId,
    );

    const orderItem = this.orderItemsRepository.create({
      ...createOrderItemDto,
      order,
      product,
      unitPrice: product.price,
      totalPrice: product.price * createOrderItemDto.quantity,
    });

    await this.orderItemsRepository.save(orderItem);
    return this.findOne(orderId);
  }

  async removeOrderItem(orderId: string, orderItemId: string): Promise<Order> {
    await this.findOne(orderId); // Verify order exists
    const orderItem = await this.orderItemsRepository.findOne({
      where: { id: orderItemId, order: { id: orderId } },
    });

    if (!orderItem) {
      throw new NotFoundException(
        `Order item with ID ${orderItemId} not found`,
      );
    }

    await this.orderItemsRepository.remove(orderItem);
    return this.findOne(orderId);
  }
}
