import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CareType } from "../healthcare-homes/entities/care-type.entity";
import { Specialization } from "../healthcare-homes/entities/specialization.entity";
import { CareHomeFacility } from "../healthcare-homes/entities/care-home-facility.entity";
import {
  CreateCareTypeDto,
  UpdateCareTypeDto,
} from "../healthcare-homes/dto/care-type.dto";
import {
  CreateSpecializationDto,
  UpdateSpecializationDto,
} from "../healthcare-homes/dto/specialization.dto";
import {
  CreateFacilityDto,
  UpdateFacilityDto,
} from "../healthcare-homes/dto/facility.dto";

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(CareType)
    private readonly careTypeRepository: Repository<CareType>,
    @InjectRepository(Specialization)
    private readonly specializationRepository: Repository<Specialization>,
    @InjectRepository(CareHomeFacility)
    private readonly facilityRepository: Repository<CareHomeFacility>
  ) {}

  // Care Type CRUD Operations
  async getAllCareTypes() {
    return this.careTypeRepository.find({
      order: { name: "ASC" },
    });
  }

  async getCareTypeById(id: number) {
    const careType = await this.careTypeRepository.findOne({ where: { id } });
    if (!careType) {
      throw new NotFoundException(`Care type with ID ${id} not found`);
    }
    return careType;
  }

  async createCareType(createCareTypeDto: CreateCareTypeDto) {
    const careType = this.careTypeRepository.create({
      ...createCareTypeDto,
      isActive: createCareTypeDto.isActive ?? true,
    });
    return this.careTypeRepository.save(careType);
  }

  async updateCareType(id: number, updateCareTypeDto: UpdateCareTypeDto) {
    const careType = await this.getCareTypeById(id);
    Object.assign(careType, updateCareTypeDto);
    return this.careTypeRepository.save(careType);
  }

  async deleteCareType(id: number) {
    const careType = await this.getCareTypeById(id);
    await this.careTypeRepository.remove(careType);
    return { message: "Care type deleted successfully" };
  }

  // Specialization CRUD Operations
  async getAllSpecializations() {
    return this.specializationRepository.find({
      order: { sortOrder: "ASC", name: "ASC" },
    });
  }

  async getSpecializationById(id: number) {
    const specialization = await this.specializationRepository.findOne({
      where: { id },
    });
    if (!specialization) {
      throw new NotFoundException(`Specialization with ID ${id} not found`);
    }
    return specialization;
  }

  async createSpecialization(createSpecializationDto: CreateSpecializationDto) {
    const specialization = this.specializationRepository.create({
      ...createSpecializationDto,
      isActive: createSpecializationDto.isActive ?? true,
      sortOrder: createSpecializationDto.sortOrder ?? 0,
    });
    return this.specializationRepository.save(specialization);
  }

  async updateSpecialization(
    id: number,
    updateSpecializationDto: UpdateSpecializationDto
  ) {
    const specialization = await this.getSpecializationById(id);
    Object.assign(specialization, updateSpecializationDto);
    return this.specializationRepository.save(specialization);
  }

  async deleteSpecialization(id: number) {
    const specialization = await this.getSpecializationById(id);
    await this.specializationRepository.remove(specialization);
    return { message: "Specialization deleted successfully" };
  }

  // Facility CRUD Operations
  async getAllFacilities() {
    return this.facilityRepository.find({
      order: { sortOrder: "ASC", name: "ASC" },
    });
  }

  async getFacilityById(id: string) {
    const facility = await this.facilityRepository.findOne({ where: { id } });
    if (!facility) {
      throw new NotFoundException(`Facility with ID ${id} not found`);
    }
    return facility;
  }

  async createFacility(createFacilityDto: CreateFacilityDto) {
    const facility = this.facilityRepository.create({
      ...createFacilityDto,
      isActive: createFacilityDto.isActive ?? true,
      sortOrder: createFacilityDto.sortOrder ?? 0,
    });
    return this.facilityRepository.save(facility);
  }

  async updateFacility(id: string, updateFacilityDto: UpdateFacilityDto) {
    const facility = await this.getFacilityById(id);
    Object.assign(facility, updateFacilityDto);
    return this.facilityRepository.save(facility);
  }

  async deleteFacility(id: string) {
    const facility = await this.getFacilityById(id);
    await this.facilityRepository.remove(facility);
    return { message: "Facility deleted successfully" };
  }
}
