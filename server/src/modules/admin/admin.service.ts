import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { OrdersService } from "../orders/orders.service";
import { ProductsService } from "../products/products.service";
import { CreateProductDto } from "../products/dto/create-product.dto";
import { UpdateProductDto } from "../products/dto/update-product.dto";
import { UpdateOrderDto } from "../orders/dto/update-order.dto";
import { UpdateUserDto } from "../users/dto/user.dto";
import { OrderStatus, Order } from "../orders/entities/order.entity";
import { ChartDataDto } from "./dto/chart-data.dto";
import { Product } from "../products/entities/product.entity";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
  ) {}

  async getDashboardData() {
    const [users, ordersResponse, productsResponse] = await Promise.all([
      this.usersService.findAll(),
      this.ordersService.findAll(),
      this.productsService.findAll(),
    ]);
    const orders = ordersResponse.data;
    const products = productsResponse.data;

    // Calculate active users (users who have logged in within the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = users.filter(
      (user) => user.lastLoginAt && new Date(user.lastLoginAt) >= sevenDaysAgo,
    ).length;

    // Calculate active products (products with isActive = true)
    const activeProducts = products.filter(
      (product: Product) => product.isActive,
    ).length;

    return {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalProducts: products.length,
      recentOrders: orders.slice(0, 5),
      revenue: orders.reduce((sum, order: Order) => sum + order.totalAmount, 0),
      pendingOrders: orders.filter(
        (order: Order) => order.status === OrderStatus.PENDING,
      ).length,
      activeUsers,
      activeProducts,
    };
  }

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async getAllOrders(filters?: {
    search?: string;
    status?: string;
    minAmount?: number;
    maxAmount?: number;
    dateRange?: string;
  }) {
    return this.ordersService.findAll(filters);
  }

  // Product Management
  async createProduct(createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  async deleteProduct(id: string) {
    return this.productsService.remove(id);
  }

  // Order Management
  async updateOrderStatus(id: string, updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  async getOrderDetails(id: string) {
    return this.ordersService.findOne(id);
  }

  // User Management
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  async deleteUser(id: string) {
    return this.usersService.remove(id);
  }

  // Analytics
  async getSalesAnalytics(startDate: Date, endDate: Date) {
    const ordersResponse = await this.ordersService.findAll();
    const orders = ordersResponse.data;
    const filteredOrders = orders.filter(
      (order) => order.createdAt >= startDate && order.createdAt <= endDate,
    );

    return {
      totalSales: filteredOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0,
      ),
      orderCount: filteredOrders.length,
      averageOrderValue:
        filteredOrders.length > 0
          ? filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0) /
            filteredOrders.length
          : 0,
      salesByDate: this.groupSalesByDate(filteredOrders),
    };
  }

  private groupSalesByDate(orders: Order[]) {
    const salesByDate: Record<string, number> = {};
    orders.forEach((order: Order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      salesByDate[date] = (salesByDate[date] || 0) + order.totalAmount;
    });
    return salesByDate;
  }

  async getChartData(): Promise<ChartDataDto> {
    const [productsResponse, ordersResponse] = await Promise.all([
      this.productsService.findAll(),
      this.ordersService.findAll(),
    ]);
    const products = productsResponse.data;
    const orders = ordersResponse.data;

    // Calculate top categories
    const categoryCount = products.reduce<Record<string, number>>(
      (acc, product: Product) => {
        const category = product.category?.name || "Uncategorized";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {},
    );

    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Calculate revenue by day for the last 7 days
    const revenueByDay = this.calculateRevenueByDay(orders);

    // Calculate order status distribution
    const orderStatusDistribution =
      this.calculateOrderStatusDistribution(orders);

    // Calculate top products
    const topProducts = this.calculateTopProducts(orders);

    return {
      topCategories,
      revenueByDay,
      orderStatusDistribution,
      topProducts,
    };
  }

  private calculateRevenueByDay(
    orders: Order[],
  ): { date: string; revenue: number }[] {
    const revenueByDay: Record<string, number> = {};
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Initialize all days with 0 revenue
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      revenueByDay[dateStr] = 0;
    }

    // Calculate revenue for each day
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= sevenDaysAgo) {
        const dateStr = orderDate.toISOString().split("T")[0];
        revenueByDay[dateStr] =
          (revenueByDay[dateStr] || 0) + order.totalAmount;
      }
    });

    return Object.entries(revenueByDay)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private calculateOrderStatusDistribution(
    orders: Order[],
  ): { status: string; count: number }[] {
    const statusCount = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
    }));
  }

  private calculateTopProducts(
    orders: Order[],
  ): { id: string; name: string; sales: number; revenue: number }[] {
    const productSales = orders.reduce(
      (acc, order) => {
        if (order.orderItems) {
          order.orderItems.forEach((item) => {
            if (!acc[item.product.id]) {
              acc[item.product.id] = {
                id: item.product.id,
                name: item.product.name,
                sales: 0,
                revenue: 0,
              };
            }
            acc[item.product.id].sales += item.quantity;
            acc[item.product.id].revenue += item.unitPrice * item.quantity;
          });
        }
        return acc;
      },
      {} as Record<
        string,
        { id: string; name: string; sales: number; revenue: number }
      >,
    );

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }

  async getRecentOrders() {
    const ordersResponse = await this.ordersService.findAll();
    const orders = ordersResponse.data;
    return orders
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        user: {
          firstName: order.user.firstName,
          lastName: order.user.lastName,
          email: order.user.email,
        },
      }));
  }
}
