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
    icon?: string;
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

  // Helper function to convert unknown error to string
  const errorToString = (error: unknown, fallback: string = "An error occurred"): string => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return fallback;
  };

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
          error: errorToString(response.error, "Failed to fetch care homes"),
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
          error: errorToString(response.error, "Failed to fetch care home"),
        };
      }
    },
    [client]
  );

  const getCareHomeByRegionAndSlug = useCallback(
    async (region: string, slug: string) => {
      const response = await client.get(
        `/healthcare-homes/by-slug/${region}/${slug}`
      );

      if (response.data) {
        return {
          success: true,
          data: (response.data as unknown as { data: CareHome })?.data,
        };
      } else {
        return {
          success: false,
          error: errorToString(response.error, "Failed to fetch care home"),
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
          error: errorToString(response.error, "Failed to fetch care homes"),
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
        error: errorToString(response.error, "Failed to fetch region statistics"),
      };
    }
  }, [client, errorToString]);

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
        error: errorToString(response.error, "Failed to fetch care types"),
      };
    }
  }, [client, errorToString]);

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
        error: errorToString(response.error, "Failed to fetch specializations"),
      };
    }
  }, [client, errorToString]);

  const getFacilities = useCallback(async () => {
    const response = await client.get("/healthcare-homes/facilities");

    if (response.data) {
      return {
        success: true,
        data: (
          response.data as unknown as {
            data: Array<{
              id: string;
              name: string;
              description?: string;
              icon?: string;
              isActive: boolean;
              sortOrder?: number;
              createdAt?: string;
              updatedAt?: string;
            }>;
          }
        )?.data,
      };
    } else {
      return {
        success: false,
        error: errorToString(response.error, "Failed to fetch facilities"),
      };
    }
  }, [client, errorToString]);

  const updateCareHome = useCallback(
    async (
      id: string,
      data: Partial<{
        name: string;
        description: string[];
        addressLine1: string;
        addressLine2?: string;
        city: string;
        region?: string;
        postcode: string;
        country?: string;
        latitude?: number;
        longitude?: number;
        phone: string;
        email?: string;
        website?: string;
        weeklyPrice?: number;
        monthlyPrice?: number;
        totalBeds?: number;
        availableBeds?: number;
        isActive?: boolean;
        specializations?: string[];
        openingHours?: Record<string, string>;
        contactInfo?: {
          emergency?: string;
          manager?: string;
        };
        careTypeId?: string;
        facilityIds?: string[];
        imageUrls?: string[];
      }>
    ): Promise<{
      success: boolean;
      data?: CareHome;
      error?: string;
    }> => {
      const response = await client.patch(`/healthcare-homes/${id}`, data);

      if (response.data) {
        return {
          success: true,
          data: (response.data as unknown as { data: CareHome })?.data,
        };
      } else {
        return {
          success: false,
          error: errorToString(response.error, "Failed to update care home"),
        };
      }
    },
    [client]
  );

  const getReviews = useCallback(
    async (
      careHomeId: string,
      params?: {
        page?: number;
        limit?: number;
        sortBy?: "createdAt" | "rating";
        sortOrder?: "ASC" | "DESC";
      }
    ): Promise<{
      success: boolean;
      data?: {
        data: Array<{
          id: string;
          rating: number;
          comment: string;
          createdAt: string;
          updatedAt: string;
          isVerified: boolean;
          isAnonymous: boolean;
          reviewData?: Record<string, unknown>;
          user: {
            id: string;
            name: string;
          } | null;
        }>;
        total: number;
        page: number;
        limit: number;
      };
      error?: string;
    }> => {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append("page", String(params.page));
      if (params?.limit) queryParams.append("limit", String(params.limit));
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const queryString = queryParams.toString();
      const url = `/healthcare-homes/${careHomeId}/reviews${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await client.get(url);

      if (response.data) {
        return {
          success: true,
          data: (response.data as unknown as {
            data: Array<{
              id: string;
              rating: number;
              comment: string;
              createdAt: string;
              updatedAt: string;
              isVerified: boolean;
              isAnonymous: boolean;
              reviewData?: Record<string, unknown>;
              user: {
                id: string;
                name: string;
              } | null;
            }>;
            total: number;
            page: number;
            limit: number;
          }),
        };
      } else {
        return {
          success: false,
          error: errorToString(response.error, "Failed to fetch reviews"),
        };
      }
    },
    [client]
  );

  const createReview = useCallback(
    async (
      careHomeId: string,
      data: {
        rating: number;
        comment: string;
        isAnonymous?: boolean;
        reviewData?: Record<string, unknown>;
      }
    ): Promise<{
      success: boolean;
      data?: {
        id: string;
        rating: number;
        comment: string;
        createdAt: string;
        updatedAt: string;
        isVerified: boolean;
        isAnonymous: boolean;
        reviewData?: Record<string, unknown>;
        user: {
          id: string;
          name: string;
        } | null;
      };
      error?: string;
    }> => {
      const response = await client.post(
        `/healthcare-homes/${careHomeId}/reviews`,
        data
      );

      if (response.data) {
        return {
          success: true,
          data: response.data as {
            id: string;
            rating: number;
            comment: string;
            createdAt: string;
            updatedAt: string;
            isVerified: boolean;
            isAnonymous: boolean;
            reviewData?: Record<string, unknown>;
            user: {
              id: string;
              name: string;
            } | null;
          },
        };
      } else {
        return {
          success: false,
          error: errorToString(response.error, "Failed to submit review"),
        };
      }
    },
    [client]
  );

  return {
    searchCareHomes,
    getCareHomeById,
    getCareHomeByRegionAndSlug,
    getHomeCreListings,
    getRegionStatistics,
    getCareTypes,
    getSpecializations,
    getFacilities,
    updateCareHome,
    getReviews,
    createReview,
  };
};
