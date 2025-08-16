import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { BaseResponseDto } from "../../common/dto/base-response.dto";
import { User } from "./entities/user.entity";
import { Address } from "./entities/address.entity";
import { UpdateUserDto, UserResponseDto } from "./dto/user.dto";
import {
  CreateAddressDto,
  UpdateAddressDto,
  AddressResponseDto,
} from "./dto/address.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags("Users")
@ApiBearerAuth()
@Controller("v1/users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "Returns the current user's profile",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getMe(@Req() req: RequestWithUser): Promise<BaseResponseDto<User>> {
    const user = await this.usersService.findOne(req.user.id);
    return BaseResponseDto.success("Current user retrieved successfully", user);
  }

  @Patch("me")
  @ApiOperation({ summary: "Update current user profile" })
  @ApiResponse({
    status: 200,
    description: "Returns the updated user profile",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async updateMe(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<BaseResponseDto<User>> {
    console.log("Updating user profile:", {
      userId: req.user.id,
      updateData: updateUserDto,
    });
    const user = await this.usersService.update(req.user.id, updateUserDto);
    console.log("User updated successfully:", user);
    return BaseResponseDto.success("User updated successfully", user);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user profile" })
  @ApiParam({
    name: "id",
    description: "User ID",
    type: "string",
    format: "uuid",
  })
  @ApiResponse({
    status: 200,
    description: "Returns the updated user profile",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<BaseResponseDto<User>> {
    const user = await this.usersService.update(id, updateUserDto);
    return BaseResponseDto.success("User updated successfully", user);
  }

  // Address endpoints
  @Get("me/addresses")
  @ApiOperation({ summary: "Get current user's addresses" })
  @ApiResponse({
    status: 200,
    description: "Returns the current user's addresses",
    type: [AddressResponseDto],
  })
  async getMyAddresses(
    @Req() req: RequestWithUser,
  ): Promise<BaseResponseDto<Address[]>> {
    const addresses = await this.usersService.getUserAddresses(req.user.id);
    return BaseResponseDto.success(
      "Addresses retrieved successfully",
      addresses,
    );
  }

  @Post("me/addresses")
  @ApiOperation({ summary: "Create a new address for current user" })
  @ApiResponse({
    status: 201,
    description: "Address created successfully",
    type: AddressResponseDto,
  })
  async createMyAddress(
    @Req() req: RequestWithUser,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<BaseResponseDto<Address>> {
    const address = await this.usersService.createAddress(
      req.user.id,
      createAddressDto,
    );
    return BaseResponseDto.success("Address created successfully", address);
  }

  @Patch("me/addresses/:id")
  @ApiOperation({ summary: "Update an address for current user" })
  @ApiParam({ name: "id", description: "Address ID" })
  @ApiResponse({
    status: 200,
    description: "Address updated successfully",
    type: AddressResponseDto,
  })
  async updateMyAddress(
    @Req() req: RequestWithUser,
    @Param("id") addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<BaseResponseDto<Address>> {
    const address = await this.usersService.updateAddress(
      req.user.id,
      addressId,
      updateAddressDto,
    );
    return BaseResponseDto.success("Address updated successfully", address);
  }

  @Delete("me/addresses/:id")
  @ApiOperation({ summary: "Delete an address for current user" })
  @ApiParam({ name: "id", description: "Address ID" })
  @ApiResponse({
    status: 200,
    description: "Address deleted successfully",
  })
  async deleteMyAddress(
    @Req() req: RequestWithUser,
    @Param("id") addressId: string,
  ): Promise<BaseResponseDto<void>> {
    await this.usersService.deleteAddress(req.user.id, addressId);
    return BaseResponseDto.success("Address deleted successfully");
  }

  @Patch("me/addresses/:id/default")
  @ApiOperation({ summary: "Set an address as default for current user" })
  @ApiParam({ name: "id", description: "Address ID" })
  @ApiResponse({
    status: 200,
    description: "Address set as default successfully",
    type: AddressResponseDto,
  })
  async setDefaultAddress(
    @Req() req: RequestWithUser,
    @Param("id") addressId: string,
  ): Promise<BaseResponseDto<Address>> {
    const address = await this.usersService.setDefaultAddress(
      req.user.id,
      addressId,
    );
    return BaseResponseDto.success(
      "Address set as default successfully",
      address,
    );
  }
}
