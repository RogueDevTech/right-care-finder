import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
    private readonly healthcareHomesService: HealthcareHomesService,
    @InjectRepository(CareHome)
    private readonly careHomeRepository: Repository<CareHome>
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
    region?: string;
    careTypeId?: string;
    isVerified?: boolean;
    isFeatured?: boolean;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    return this.healthcareHomesService.findAll(filters);
  }

  // Care Home Management
  async createCareHome(createCareHomeDto: CreateCareHomeDto) {
    return this.healthcareHomesService.create(createCareHomeDto);
  }

  async bulkImportCareHomes(
    careHomes: CreateCareHomeDto[],
    userId?: string
  ): Promise<{ success: number; failed: number; errors: any[] }> {
    return this.healthcareHomesService.bulkImport(careHomes, userId);
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

  async toggleCareHomeStatus(id: string, isActive: boolean) {
    console.log(
      `[toggleCareHomeStatus] Updating care home ${id} to isActive: ${isActive}`
    );

    const careHome = await this.careHomeRepository.findOne({
      where: { id },
    });

    if (!careHome) {
      throw new Error("Care home not found");
    }

    console.log(
      `[toggleCareHomeStatus] Current isActive status: ${careHome.isActive}`
    );

    careHome.isActive = isActive;
    const savedCareHome = await this.careHomeRepository.save(careHome);

    console.log(
      `[toggleCareHomeStatus] Saved care home with isActive: ${savedCareHome.isActive}`
    );

    return {
      message: `Care home ${isActive ? "activated" : "deactivated"} successfully`,
      careHome: savedCareHome,
    };
  }

  async toggleCareHomeVerification(id: string, isVerified: boolean) {
    console.log(
      `[toggleCareHomeVerification] Updating care home ${id} to isVerified: ${isVerified}`
    );

    const careHome = await this.careHomeRepository.findOne({
      where: { id },
    });

    if (!careHome) {
      throw new Error("Care home not found");
    }

    console.log(
      `[toggleCareHomeVerification] Current isVerified status: ${careHome.isVerified}`
    );

    careHome.isVerified = isVerified;
    const savedCareHome = await this.careHomeRepository.save(careHome);

    console.log(
      `[toggleCareHomeVerification] Saved care home with isVerified: ${savedCareHome.isVerified}`
    );

    return {
      message: `Care home ${isVerified ? "verified" : "unverified"} successfully`,
      careHome: savedCareHome,
    };
  }

  async toggleCareHomeFeatured(id: string, isFeatured: boolean) {
    console.log(
      `[toggleCareHomeFeatured] Updating care home ${id} to isFeatured: ${isFeatured}`
    );

    const careHome = await this.careHomeRepository.findOne({
      where: { id },
    });

    if (!careHome) {
      throw new Error("Care home not found");
    }

    console.log(
      `[toggleCareHomeFeatured] Current isFeatured status: ${careHome.isFeatured}`
    );

    careHome.isFeatured = isFeatured;
    const savedCareHome = await this.careHomeRepository.save(careHome);

    console.log(
      `[toggleCareHomeFeatured] Saved care home with isFeatured: ${savedCareHome.isFeatured}`
    );

    return {
      message: `Care home ${isFeatured ? "featured" : "unfeatured"} successfully`,
      careHome: savedCareHome,
    };
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

  async getCareHomesAvailableForOwners(search?: string, limit: number = 30) {
    // Query care homes that don't have accepted invitations (no owners)
    // This means care homes where there are no accepted invitations
    const queryBuilder = this.careHomeRepository
      .createQueryBuilder("careHome")
      .leftJoin(
        "invitations",
        "invitation",
        "invitation.careHomeId = careHome.id AND invitation.status = 'accepted'"
      )
      .where("careHome.isActive = :isActive", { isActive: true })
      .andWhere("invitation.id IS NULL");

    // Add search functionality
    if (search) {
      queryBuilder.andWhere(
        "(careHome.name ILIKE :search OR careHome.addressLine1 ILIKE :search OR careHome.city ILIKE :search OR careHome.postcode ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    // Add limit and order by name
    queryBuilder.orderBy("careHome.name", "ASC").limit(limit);

    const availableCareHomes = await queryBuilder.getMany();

    return availableCareHomes.map((careHome: CareHome) => ({
      id: careHome.id,
      name: careHome.name,
      addressLine1: careHome.addressLine1,
      city: careHome.city,
      postcode: careHome.postcode,
    }));
  }
}
