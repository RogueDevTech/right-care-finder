import { useClient } from "@/hooks/use-client";
import { useCallback } from "react";

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
  countryCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website?: string;
  weeklyPrice?: number;
  monthlyPrice?: number;
  totalBeds?: number;
  availableBeds?: number;
  isActive: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  specializations: string[];
  openingHours: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  contactInfo: {
    emergency: string;
    manager: string;
  };
  careType: {
    id: number;
    name: string;
    description: string;
  };
  facilities: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
  images: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
    };
  }>;
  averageRating?: number;
  totalReviews?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CareHomeQueryParams {
  // Search and location filters
  search?: string;
  city?: string;
  county?: string;
  postcode?: string;

  // Care type and facility filters
  careTypeId?: string; // Changed from number to string to match backend UUID validation
  facilityIds?: string[];
  specializations?: string[];

  // Price filters
  minPrice?: number;
  maxPrice?: number;

  // Rating and quality filters
  minRating?: number;
  cqcRating?: string;

  // Availability filters
  hasAvailableBeds?: boolean;
  acceptingNewResidents?: boolean;
  ageRestriction?: string;

  // Status filters
  isVerified?: boolean;
  isFeatured?: boolean;

  // Pagination and sorting
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";

  // Distance-based filtering
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface CareHomeResponse {
  data: CareHome[];
  total: number;
  page: number;
  limit: number;
}

export interface RegionStatistics {
  region: string;
  count: number;
  averageRating: number;
}

export interface CareType {
  id: string; // Changed from number to string to match backend UUID validation
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Specialization {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const useHealthcareHomesActions = () => {
  const client = useClient();

  const searchCareHomes = useCallback(
    async (
      params: CareHomeQueryParams = {}
    ): Promise<{
      success: boolean;
      data?: CareHomeResponse;
      error?: string;
    }> => {
      const queryParams = new URLSearchParams();

      // Add all non-undefined parameters to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // For arrays, append each value with array notation
            value.forEach((item) => {
              queryParams.append(`${key}[]`, String(item));
            });
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const queryString = queryParams.toString();
      const url = `/healthcare-homes${queryString ? `?${queryString}` : ""}`;

      const response = await client.get(url);

      if (response.data) {
        return {
          success: true,
          data: response.data as CareHomeResponse,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    },
    [client]
  );

  const getCareHomeById = useCallback(
    async (id: string) => {
      const response = await client.get(`/healthcare-homes/${id}`);

      if (response.data) {
        return {
          success: true,
          data: (response.data as unknown as { data: CareHome })?.data,
        };
      } else {
        return {
          success: false,
          error: response.error || "Failed to fetch care home",
        };
      }
    },
    [client]
  );

  const getHomeCreListings = useCallback(
    async (
      params: CareHomeQueryParams = {}
    ): Promise<{
      success: boolean;
      data?: CareHomeResponse;
      error?: string;
    }> => {
      const queryParams = new URLSearchParams();

      // Add all non-undefined parameters to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // For arrays, append each value with array notation
            value.forEach((item) => {
              queryParams.append(`${key}[]`, String(item));
            });
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const queryString = queryParams.toString();
      const url = `/healthcare-homes${queryString ? `?${queryString}` : ""}`;

      const response = await client.get(url);

      if (response.data) {
        return {
          success: true,
          data: response.data as CareHomeResponse,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    },
    [client]
  );

  const getRegionStatistics = useCallback(async (): Promise<{
    success: boolean;
    data?: RegionStatistics[];
    error?: string;
  }> => {
    const response = await client.get("/healthcare-homes/statistics/regions");

    if (response.data) {
      return {
        success: true,
        data: (response.data as unknown as { data: RegionStatistics[] })?.data,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  }, [client]);

  const getCareTypes = useCallback(async () => {
    const response = await client.get("/healthcare-homes/care-types");

    if (response.data) {
      return {
        success: true,
        data: (response.data as unknown as { data: CareType[] })?.data,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  }, [client]);

  const getSpecializations = useCallback(async () => {
    const response = await client.get("/healthcare-homes/specializations");

    if (response.data) {
      return {
        success: true,
        data: (response.data as unknown as { data: Specialization[] })?.data,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  }, [client]);

  return {
    searchCareHomes,
    getCareHomeById,
    getHomeCreListings,
    getRegionStatistics,
    getCareTypes,
    getSpecializations,
  };
};
