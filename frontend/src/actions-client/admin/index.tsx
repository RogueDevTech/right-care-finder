"use client";

import { useClient } from "@/hooks";

export interface UserVerification {
  id: string;
  verificationId: string;
  propertyType: string;
  propertySize: string;
  address: string;
  state: string;
  localGovernment: string;
  country: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  paymentStatus: "pending" | "paid" | "failed";
  verificationFee: string;
  completedAt?: string;
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  name: string;
  description: string;
  type: "percentage" | "fixed_amount";
  value: string | number;
  minimumAmount?: number | null;
  maximumDiscount?: number | null;
  maxUses?: number | null;
  usedCount: number;
  validFrom: string;
  validUntil?: string | null;
  status: "active" | "inactive";
  createdBy: string;
  creator: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phoneNumber?: string;
    isEmailVerified: boolean;
    isActive: boolean;
    hearFromUs?: string;
    createdAt: string;
    updatedAt: string;
  };
  assignedToUserId?: string | null;
  assignedToUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  isSingleUse: boolean;
  usedByUsers: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface PricingConfig {
  id: string;
  propertyType: string;
  baseFee: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeeCalculation {
  propertyType: string;
  baseFee: number;
  promoCode?: string;
  discountAmount: number;
  finalFee: number;
}

export interface Transaction {
  id: string;
  userId: string;
  paymentId: string;
  verificationId: string;
  reference: string;
  transactionType: "payment" | "refund" | "fee" | "verification";
  status: "pending" | "success" | "failed" | "cancelled";
  amount: number;
  fees: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentProvider: string;
  channel: string;
  transactionDate: string;
  paidAt: string;
  providerResponse: Record<string, unknown>;
  description: string;
  failureReason: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "BUYER" | "DEVELOPER" | "BROKER" | "OWNER" | "LENDER";
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt?: string;
  phoneNumber?: string;
  address?: string;
  state?: string;
  localGovernment?: string;
  country?: string;
  dateOfBirth?: string;
  lastLoginAt?: string;
  companyName?: string;
  licenseNumber?: string;
  businessAddress?: string;
  website?: string;
  bio?: string;
  preferredLocations?: string;
  budgetRange?: string;
  hearFromUs?: string;
  referralCode?: string;
  verifications?: UserVerification[];
}

export interface UsersResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: "admin" | "buyer" | "developer" | "broker" | "owner" | "lender";
  verificationStatus?: "unverified" | "pending" | "verified" | "rejected";
  hearFromUs?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

// Care Home Interfaces
export interface CareHome {
  id: string;
  name: string;
  description: string[];
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email?: string;
  website?: string;
  weeklyPrice?: number;
  monthlyPrice?: number;
  totalBeds: number;
  availableBeds: number;
  isActive: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  specializations: string[];
  openingHours: Record<string, string>;
  contactInfo: Record<string, string>;
  careTypeId: string;
  facilityIds: string[];
  imageUrls: string[];
  rating?: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCareHomeData {
  name: string;
  description: string[];
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email?: string;
  website?: string;
  weeklyPrice?: number;
  monthlyPrice?: number;
  totalBeds?: number;
  availableBeds?: number;
  isActive: boolean;
  specializations: string[];
  openingHours: Record<string, string>;
  contactInfo: Record<string, string>;
  careTypeId: string;
  facilityIds: string[];
  imageUrls: string[];
}

export interface CareHomesResponse {
  careHomes: CareHome[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CareHomesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  region?: string;
  country?: string;
  careTypeId?: string;
  isActive?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  hasAvailableBeds?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

// Configuration Interfaces
export interface CareType {
  id: number;
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Specialization {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const useAdminActions = () => {
  const client = useClient();

  const getUsers = async (params: UsersQueryParams = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.role) queryParams.append("role", params.role);
    if (params.verificationStatus)
      queryParams.append("verificationStatus", params.verificationStatus);
    if (params.hearFromUs) queryParams.append("hearFromUs", params.hearFromUs);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await client.get(`/admin/users?${queryParams.toString()}`);

    if (response.data) {
      return {
        success: true,
        data: response.data as UsersResponse,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const getUserById = async (userId: string) => {
    const response = await client.get(`/admin/users/${userId}`);

    if (response.data) {
      return {
        success: true,
        data: response.data as AdminUser,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  // Care Home Management
  const getCareHomes = async (params: CareHomesQueryParams = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.city) queryParams.append("city", params.city);
    if (params.region) queryParams.append("region", params.region);
    if (params.country) queryParams.append("country", params.country);
    if (params.careTypeId) queryParams.append("careTypeId", params.careTypeId);
    if (params.isActive !== undefined)
      queryParams.append("isActive", params.isActive.toString());
    if (params.isVerified !== undefined)
      queryParams.append("isVerified", params.isVerified.toString());
    if (params.isFeatured !== undefined)
      queryParams.append("isFeatured", params.isFeatured.toString());
    if (params.minPrice)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params.hasAvailableBeds)
      queryParams.append(
        "hasAvailableBeds",
        params.hasAvailableBeds.toString()
      );
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await client.get(
      `/admin/care-homes?${queryParams.toString()}`
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as CareHomesResponse,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const getCareHomeById = async (careHomeId: string) => {
    const response = await client.get(`/admin/care-homes/${careHomeId}`);

    if (response.data) {
      return {
        success: true,
        data: response.data as CareHome,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const createCareHome = async (careHomeData: CreateCareHomeData) => {
    const response = await client.post("/admin/care-homes", careHomeData);

    if (response.data) {
      return {
        success: true,
        data: response.data as CareHome,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const updateCareHome = async (
    careHomeId: string,
    careHomeData: Partial<CreateCareHomeData>
  ) => {
    const response = await client.patch(
      `/admin/care-homes/${careHomeId}`,
      careHomeData
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as CareHome,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const deleteCareHome = async (careHomeId: string) => {
    const response = await client.delete(`/admin/care-homes/${careHomeId}`);

    if (response.data) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const toggleCareHomeStatus = async (
    careHomeId: string,
    isActive: boolean
  ) => {
    const response = await client.patch(
      `/admin/care-homes/${careHomeId}/status`,
      {
        isActive,
      }
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as CareHome,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const toggleCareHomeVerification = async (
    careHomeId: string,
    isVerified: boolean
  ) => {
    const response = await client.patch(
      `/admin/care-homes/${careHomeId}/verification`,
      {
        isVerified,
      }
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as CareHome,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const toggleCareHomeFeatured = async (
    careHomeId: string,
    isFeatured: boolean
  ) => {
    const response = await client.patch(
      `/admin/care-homes/${careHomeId}/featured`,
      {
        isFeatured,
      }
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as CareHome,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  // Configuration Management
  const getCareTypes = async () => {
    const response = await client.get("/admin/config/care-types");

    if (response.data) {
      return {
        success: true,
        data: response.data as CareType[],
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const createCareType = async (careTypeData: {
    name: string;
    description: string;
    icon?: string;
    isActive: boolean;
  }) => {
    const response = await client.post(
      "/admin/config/care-types",
      careTypeData
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as CareType,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const updateCareType = async (
    careTypeId: number,
    careTypeData: Partial<{
      name: string;
      description: string;
      icon: string;
      isActive: boolean;
    }>
  ) => {
    const response = await client.put(
      `/admin/config/care-types/${careTypeId}`,
      careTypeData
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as CareType,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const deleteCareType = async (careTypeId: number) => {
    const response = await client.delete(
      `/admin/config/care-types/${careTypeId}`
    );

    if (response.data) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const getSpecializations = async () => {
    const response = await client.get("/admin/config/specializations");

    if (response.data) {
      return {
        success: true,
        data: response.data as Specialization[],
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const createSpecialization = async (specializationData: {
    name: string;
    description?: string;
    isActive: boolean;
  }) => {
    const response = await client.post(
      "/admin/config/specializations",
      specializationData
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as Specialization,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const updateSpecialization = async (
    specializationId: number,
    specializationData: Partial<{
      name: string;
      description: string;
      isActive: boolean;
    }>
  ) => {
    const response = await client.put(
      `/admin/config/specializations/${specializationId}`,
      specializationData
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as Specialization,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const deleteSpecialization = async (specializationId: number) => {
    const response = await client.delete(
      `/admin/config/specializations/${specializationId}`
    );

    if (response.data) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const getFacilities = async () => {
    const response = await client.get("/admin/config/facilities");

    if (response.data) {
      return {
        success: true,
        data: response.data as Facility[],
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const createFacility = async (facilityData: {
    name: string;
    description?: string;
    icon?: string;
    isActive: boolean;
  }) => {
    const response = await client.post(
      "/admin/config/facilities",
      facilityData
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as Facility,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const updateFacility = async (
    facilityId: string,
    facilityData: Partial<{
      name: string;
      description: string;
      icon: string;
      isActive: boolean;
    }>
  ) => {
    const response = await client.put(
      `/admin/config/facilities/${facilityId}`,
      facilityData
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as Facility,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const deleteFacility = async (facilityId: string) => {
    const response = await client.delete(
      `/admin/config/facilities/${facilityId}`
    );

    if (response.data) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  return {
    getUsers,
    getUserById,
    // Care Home Management
    getCareHomes,
    getCareHomeById,
    createCareHome,
    updateCareHome,
    deleteCareHome,
    toggleCareHomeStatus,
    toggleCareHomeVerification,
    toggleCareHomeFeatured,
    // Configuration Management
    getCareTypes,
    createCareType,
    updateCareType,
    deleteCareType,
    getSpecializations,
    createSpecialization,
    updateSpecialization,
    deleteSpecialization,
    getFacilities,
    createFacility,
    updateFacility,
    deleteFacility,
  };
};
