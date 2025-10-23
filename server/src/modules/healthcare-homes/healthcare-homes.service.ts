import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { CareHome } from "./entities/care-home.entity";
import { CareType } from "./entities/care-type.entity";
import { CareHomeFacility } from "./entities/care-home-facility.entity";
import { CareHomeImage } from "./entities/care-home-image.entity";
import { CareHomeReview } from "./entities/care-home-review.entity";
import { Specialization } from "./entities/specialization.entity";
import { CreateCareHomeDto } from "./dto/create-care-home.dto";
import { UpdateCareHomeDto } from "./dto/update-care-home.dto";
import { CareHomeQueryDto } from "./dto/care-home-query.dto";
import { CreateReviewDto } from "./dto/create-review.dto";

@Injectable()
export class HealthcareHomesService {
  constructor(
    @InjectRepository(CareHome)
    private careHomeRepository: Repository<CareHome>,
    @InjectRepository(CareType)
    private careTypeRepository: Repository<CareType>,
    @InjectRepository(CareHomeFacility)
    private facilityRepository: Repository<CareHomeFacility>,
    @InjectRepository(CareHomeImage)
    private imageRepository: Repository<CareHomeImage>,
    @InjectRepository(CareHomeReview)
    private reviewRepository: Repository<CareHomeReview>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>
  ) {}

  async bulkImport(
    careHomes: CreateCareHomeDto[],
    userId?: string
  ): Promise<{ success: number; failed: number; errors: any[] }> {
    let success = 0;
    let failed = 0;
    const errors: any[] = [];

    for (const careHomeDto of careHomes) {
      try {
        await this.create(careHomeDto, userId);
        success++;
      } catch (error) {
        failed++;
        errors.push({
          careHome: careHomeDto.name || "Unknown",
          error: error.message,
        });
      }
    }

    return { success, failed, errors };
  }

  async create(
    createCareHomeDto: CreateCareHomeDto,
    userId?: string
  ): Promise<CareHome> {
    const careType = await this.careTypeRepository.findOne({
      where: { id: createCareHomeDto.careTypeId },
    });

    if (!careType) {
      throw new NotFoundException("Care type not found");
    }

    const careHome = this.careHomeRepository.create({
      ...createCareHomeDto,
      careType,
      createdBy: userId ? { id: userId } : null,
    });

    // Handle facilities
    if (createCareHomeDto.facilityIds?.length) {
      const facilities = await this.facilityRepository.find({
        where: { id: In(createCareHomeDto.facilityIds) },
      });
      careHome.facilities = facilities;
    }

    const savedCareHome = await this.careHomeRepository.save(careHome);

    // Handle images
    if (createCareHomeDto.imageUrls?.length) {
      const images = createCareHomeDto.imageUrls.map((url, index) =>
        this.imageRepository.create({
          url,
          isPrimary: index === 0,
          sortOrder: index,
          careHome: savedCareHome,
        })
      );
      await this.imageRepository.save(images);
    }

    return this.findOne(savedCareHome.id);
  }

  async findAll(
    query: CareHomeQueryDto
  ): Promise<{ data: CareHome[]; total: number; page: number; limit: number }> {
    const {
      search,
      city,
      postcode,
      careTypeId,
      facilityIds,
      minPrice,
      maxPrice,
      minRating,
      hasAvailableBeds,
      isVerified,
      isFeatured,
      isActive,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
      latitude,
      longitude,
      radius,
    } = query;

    const queryBuilder = this.careHomeRepository
      .createQueryBuilder("careHome")
      .leftJoinAndSelect("careHome.careType", "careType")
      .leftJoinAndSelect("careHome.images", "images")
      .leftJoinAndSelect("careHome.facilities", "facilities")
      .leftJoinAndSelect("careHome.reviews", "reviews");

    // Only filter by isActive if explicitly provided
    if (isActive !== undefined) {
      queryBuilder.where("careHome.isActive = :isActive", { isActive });
    }

    // Search functionality
    if (search) {
      queryBuilder.andWhere(
        "(careHome.name ILIKE :search OR careHome.city ILIKE :search OR careHome.addressLine1 ILIKE :search OR EXISTS (SELECT 1 FROM unnest(careHome.description) AS desc_item WHERE desc_item ILIKE :search))",
        { search: `%${search}%` }
      );
    }

    // Location filters
    if (city) {
      queryBuilder.andWhere("careHome.city ILIKE :city", { city: `%${city}%` });
    }

    if (query.region) {
      queryBuilder.andWhere("careHome.region ILIKE :region", {
        region: `%${query.region}%`,
      });
    }

    if (postcode) {
      queryBuilder.andWhere("careHome.postcode ILIKE :postcode", {
        postcode: `%${postcode}%`,
      });
    }

    if (query.country) {
      queryBuilder.andWhere("careHome.country ILIKE :country", {
        country: `%${query.country}%`,
      });
    }

    // Care type filter
    if (careTypeId) {
      queryBuilder.andWhere("careType.id = :careTypeId", { careTypeId });
    }

    // Facility filters
    if (facilityIds?.length) {
      queryBuilder.andWhere("facilities.id IN (:...facilityIds)", {
        facilityIds,
      });
    }

    // Price filters
    if (minPrice !== undefined) {
      queryBuilder.andWhere("careHome.weeklyPrice >= :minPrice", { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere("careHome.weeklyPrice <= :maxPrice", { maxPrice });
    }

    // Rating filter
    if (minRating !== undefined) {
      queryBuilder.andWhere("careHome.rating >= :minRating", { minRating });
    }

    // Available beds filter
    if (hasAvailableBeds) {
      queryBuilder.andWhere("careHome.availableBeds > 0");
    }

    // Verification filter
    if (isVerified !== undefined) {
      queryBuilder.andWhere("careHome.isVerified = :isVerified", {
        isVerified,
      });
    }

    // Featured filter
    if (isFeatured !== undefined) {
      queryBuilder.andWhere("careHome.isFeatured = :isFeatured", {
        isFeatured,
      });
    }

    // CQC Rating filter
    if (query.cqcRating) {
      queryBuilder.andWhere("careHome.cqcRating = :cqcRating", {
        cqcRating: query.cqcRating,
      });
    }

    // Age restriction filter
    if (query.ageRestriction) {
      queryBuilder.andWhere("careHome.ageRestriction = :ageRestriction", {
        ageRestriction: query.ageRestriction,
      });
    }

    // Accepting new residents filter
    if (query.acceptingNewResidents !== undefined) {
      queryBuilder.andWhere(
        "careHome.acceptingNewResidents = :acceptingNewResidents",
        { acceptingNewResidents: query.acceptingNewResidents }
      );
    }

    // Specializations filter
    if (query.specializations?.length) {
      // Use OR condition for each specialization to check if it exists in the array
      const conditions = query.specializations.map(
        (spec, index) => `careHome.specializations @> ARRAY[:spec${index}]`
      );
      const parameters = query.specializations.reduce((acc, spec, index) => {
        acc[`spec${index}`] = spec;
        return acc;
      }, {} as any);

      queryBuilder.andWhere(`(${conditions.join(" OR ")})`, parameters);
    }

    // Distance filter (if coordinates provided)
    if (latitude && longitude && radius) {
      const distanceFormula = `
        (6371 * acos(cos(radians(:latitude)) * cos(radians(careHome.latitude)) * 
        cos(radians(careHome.longitude) - radians(:longitude)) + 
        sin(radians(:latitude)) * sin(radians(careHome.latitude))))
      `;
      queryBuilder.andWhere(`${distanceFormula} <= :radius`, {
        latitude,
        longitude,
        radius: radius * 1.60934, // Convert miles to km
      });
    }

    // Sorting
    queryBuilder.orderBy(`careHome.${sortBy}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<CareHome> {
    const careHome = await this.careHomeRepository.findOne({
      where: { id },
      relations: [
        "careType",
        "images",
        "facilities",
        "reviews",
        "reviews.user",
        "createdBy",
      ],
    });

    if (!careHome) {
      throw new NotFoundException("Care home not found");
    }

    return careHome;
  }

  async update(
    id: string,
    updateCareHomeDto: UpdateCareHomeDto
  ): Promise<CareHome> {
    const careHome = await this.findOne(id);

    // Handle care type update
    if (updateCareHomeDto.careTypeId) {
      const careType = await this.careTypeRepository.findOne({
        where: { id: updateCareHomeDto.careTypeId },
      });
      if (!careType) {
        throw new NotFoundException("Care type not found");
      }
      careHome.careType = careType;
    }

    // Handle facilities update
    if (updateCareHomeDto.facilityIds) {
      const facilities = await this.facilityRepository.find({
        where: { id: In(updateCareHomeDto.facilityIds) },
      });
      careHome.facilities = facilities;
    }

    // Handle images update
    if (updateCareHomeDto.imageUrls) {
      // Remove existing images
      await this.imageRepository.delete({ careHome: { id } });

      // Add new images
      const images = updateCareHomeDto.imageUrls.map((url, index) =>
        this.imageRepository.create({
          url,
          isPrimary: index === 0,
          sortOrder: index,
          careHome: { id },
        })
      );
      await this.imageRepository.save(images);
    }

    Object.assign(careHome, updateCareHomeDto);
    await this.careHomeRepository.save(careHome);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const careHome = await this.findOne(id);
    await this.careHomeRepository.remove(careHome);
  }

  async addReview(
    careHomeId: string,
    createReviewDto: CreateReviewDto,
    userId?: string
  ): Promise<CareHomeReview> {
    const careHome = await this.findOne(careHomeId);

    const review = this.reviewRepository.create({
      ...createReviewDto,
      careHome,
      user: userId ? { id: userId } : null,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Update care home rating
    await this.updateCareHomeRating(careHomeId);

    return savedReview;
  }

  private async updateCareHomeRating(careHomeId: string): Promise<void> {
    const result = (await this.reviewRepository
      .createQueryBuilder("review")
      .select("AVG(review.rating)", "avgRating")
      .addSelect("COUNT(review.id)", "reviewCount")
      .where("review.careHome.id = :careHomeId", { careHomeId })
      .andWhere("review.isVerified = :isVerified", { isVerified: true })
      .getRawOne()) as { avgRating: string; reviewCount: string };

    await this.careHomeRepository.update(careHomeId, {
      rating: parseFloat(result.avgRating) || 0,
      reviewCount: parseInt(result.reviewCount) || 0,
    });
  }

  async getCareTypes(): Promise<CareType[]> {
    return this.careTypeRepository.find({
      where: { isActive: true },
      order: { name: "ASC" },
    });
  }

  async getFacilities(): Promise<CareHomeFacility[]> {
    return this.facilityRepository.find({
      where: { isActive: true },
      order: { sortOrder: "ASC" },
    });
  }

  async getFeaturedCareHomes(limit: number = 6): Promise<CareHome[]> {
    return this.careHomeRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ["careType", "images"],
      take: limit,
      order: { createdAt: "DESC" },
    });
  }

  async getNearbyCareHomes(
    latitude: number,
    longitude: number,
    radius: number = 10
  ): Promise<CareHome[]> {
    const distanceFormula = `
      (6371 * acos(cos(radians(:latitude)) * cos(radians(careHome.latitude)) * 
      cos(radians(careHome.longitude) - radians(:longitude)) + 
      sin(radians(:latitude)) * sin(radians(careHome.latitude))))
    `;

    return this.careHomeRepository
      .createQueryBuilder("careHome")
      .leftJoinAndSelect("careHome.careType", "careType")
      .leftJoinAndSelect("careHome.images", "images")
      .where("careHome.isActive = :isActive", { isActive: true })
      .andWhere(`${distanceFormula} <= :radius`, {
        latitude,
        longitude,
        radius: radius * 1.60934, // Convert miles to km
      })
      .orderBy(distanceFormula, "ASC")
      .take(10)
      .getMany();
  }

  async getRegionStatistics(): Promise<
    {
      region: string;
      count: number;
      averageRating: number;
    }[]
  > {
    const query = this.careHomeRepository
      .createQueryBuilder("careHome")
      .select("careHome.region", "region")
      .addSelect("COUNT(careHome.id)", "count")
      .addSelect("AVG(careHome.rating)", "averageRating")
      .where("careHome.isActive = :isActive", { isActive: true })
      .andWhere("careHome.region IS NOT NULL")
      .andWhere("careHome.region != ''")
      .groupBy("careHome.region")
      .orderBy("count", "DESC");

    const results = await query.getRawMany();

    return results.map((result) => ({
      region: result.region,
      count: parseInt(result.count),
      averageRating: result.averageRating
        ? parseFloat(result.averageRating)
        : 0,
    }));
  }

  async getSpecializations(): Promise<Specialization[]> {
    return this.specializationRepository.find({
      where: { isActive: true },
      order: { sortOrder: "ASC", name: "ASC" },
    });
  }
}
