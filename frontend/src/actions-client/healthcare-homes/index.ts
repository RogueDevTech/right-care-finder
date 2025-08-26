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
  }>;
  images: Array<{
    id: string;
    url: string;
    altText?: string;
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
  careTypeId?: number;
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
            queryParams.append(key, value.join(","));
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
    async (
      id: string
    ): Promise<{
      success: boolean;
      data?: CareHome;
      error?: string;
    }> => {
      const response = await client.get(`/healthcare-homes/${id}`);

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
            queryParams.append(key, value.join(","));
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

  return {
    searchCareHomes,
    getCareHomeById,
    getHomeCreListings,
  };
};
