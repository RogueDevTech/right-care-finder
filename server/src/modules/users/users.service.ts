import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Address } from "./entities/address.entity";
import { CreateAddressDto, UpdateAddressDto } from "./dto/address.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(createUserDto: any): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return (await this.usersRepository.save(user)) as unknown as User;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    const user = await this.findOne(id);

    // Handle dateOfBirth conversion if provided
    if (
      updateUserDto.dateOfBirth &&
      typeof updateUserDto.dateOfBirth === "string"
    ) {
      updateUserDto.dateOfBirth = new Date(
        updateUserDto.dateOfBirth + "T00:00:00.000Z",
      );
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // Address methods
  async getUserAddresses(userId: string): Promise<Address[]> {
    return this.addressRepository.find({
      where: { userId },
      order: { isDefault: "DESC", createdAt: "ASC" },
    });
  }

  async createAddress(
    userId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    // If this is set as default, unset other default addresses
    if (createAddressDto.isDefault) {
      await this.addressRepository
        .createQueryBuilder()
        .update(Address)
        .set({ isDefault: false })
        .where("userId = :userId AND isDefault = :isDefault", {
          userId,
          isDefault: true,
        })
        .execute();
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      userId,
    });

    return this.addressRepository.save(address);
  }

  async updateAddress(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    // If this is set as default, unset other default addresses
    if (updateAddressDto.isDefault) {
      await this.addressRepository
        .createQueryBuilder()
        .update(Address)
        .set({ isDefault: false })
        .where(
          "userId = :userId AND isDefault = :isDefault AND id != :addressId",
          {
            userId,
            isDefault: true,
            addressId,
          },
        )
        .execute();
    }

    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    await this.addressRepository.remove(address);
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    // Unset all other default addresses
    await this.addressRepository
      .createQueryBuilder()
      .update(Address)
      .set({ isDefault: false })
      .where("userId = :userId AND isDefault = :isDefault", {
        userId,
        isDefault: true,
      })
      .execute();

    // Set this address as default
    address.isDefault = true;
    return this.addressRepository.save(address);
  }
}
