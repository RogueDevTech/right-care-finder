import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { HealthcareHomesService } from "../healthcare-homes/healthcare-homes.service";
import { CreateCareHomeDto } from "../healthcare-homes/dto/create-care-home.dto";
import { UpdateCareHomeDto } from "../healthcare-homes/dto/update-care-home.dto";
import { UpdateUserDto } from "../users/dto/user.dto";
import { CareHome } from "../healthcare-homes/entities/care-home.entity";

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly healthcareHomesService: HealthcareHomesService
  ) {}

  async getDashboardData() {
    const [users, careHomesResponse] = await Promise.all([
      this.usersService.findAll(),
      this.healthcareHomesService.findAll({}),
    ]);
    const careHomes = careHomesResponse.data;

    // Calculate active users (users who have logged in within the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = users.filter(
      (user) => user.lastLoginAt && new Date(user.lastLoginAt) >= sevenDaysAgo
    ).length;

    // Calculate active care homes (care homes with isActive = true)
    const activeCareHomes = careHomes.filter(
      (careHome: CareHome) => careHome.isActive
    ).length;

    // Calculate verified care homes
    const verifiedCareHomes = careHomes.filter(
      (careHome: CareHome) => careHome.isVerified
    ).length;

    return {
      totalUsers: users.length,
      totalCareHomes: careHomes.length,
      activeCareHomes,
      verifiedCareHomes,
      recentCareHomes: careHomes.slice(0, 5),
      activeUsers,
      totalReviews: careHomes.reduce(
        (sum, careHome: CareHome) => sum + careHome.reviewCount,
        0
      ),
    };
  }

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async getAllCareHomes(filters?: {
    search?: string;
    city?: string;
    county?: string;
    careTypeId?: string;
    isVerified?: boolean;
    isFeatured?: boolean;
  }) {
    return this.healthcareHomesService.findAll(filters);
  }

  // Care Home Management
  async createCareHome(createCareHomeDto: CreateCareHomeDto) {
    return this.healthcareHomesService.create(createCareHomeDto);
  }

  async updateCareHome(id: string, updateCareHomeDto: UpdateCareHomeDto) {
    return this.healthcareHomesService.update(id, updateCareHomeDto);
  }

  async deleteCareHome(id: string) {
    return this.healthcareHomesService.remove(id);
  }

  async getCareHomeDetails(id: string) {
    return this.healthcareHomesService.findOne(id);
  }

  async getCareHomeAnalytics(startDate: Date, endDate: Date) {
    const careHomesResponse = await this.healthcareHomesService.findAll({});
    const careHomes = careHomesResponse.data;

    // Filter care homes by date range
    const filteredCareHomes = careHomes.filter((careHome: CareHome) => {
      const createdAt = new Date(careHome.createdAt);
      return createdAt >= startDate && createdAt <= endDate;
    });

    // Calculate analytics
    const totalReviews = careHomes.reduce(
      (sum, careHome: CareHome) => sum + careHome.reviewCount,
      0
    );
    const averageRating =
      careHomes.length > 0
        ? careHomes.reduce(
            (sum, careHome: CareHome) => sum + (careHome.rating || 0),
            0
          ) / careHomes.length
        : 0;

    // Group care homes by date
    const careHomesByDate: Record<string, number> = {};
    filteredCareHomes.forEach((careHome: CareHome) => {
      const date = careHome.createdAt.toISOString().split("T")[0];
      careHomesByDate[date] = (careHomesByDate[date] || 0) + 1;
    });

    return {
      totalCareHomes: careHomes.length,
      totalReviews,
      averageRating: Math.round(averageRating * 100) / 100,
      careHomesByDate,
    };
  }

  // User Management
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  async deleteUser(id: string) {
    return this.usersService.remove(id);
  }
}
