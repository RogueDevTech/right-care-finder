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

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface TransactionsQueryParams {
  page?: number;
  limit?: number;
  status?: "pending" | "success" | "failed" | "cancelled";
  transactionType?: "payment" | "refund" | "fee" | "verification";
  userId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface PromoCodesResponse {
  promoCodes: PromoCode[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
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

export interface DashboardOverview {
  totalUsers: {
    count: number;
    thisMonth: number;
  };
  properties: {
    total: number;
    verified: number;
  };
  applications: {
    total: number;
    thisMonth: number;
  };
  verifications: {
    total: number;
    pending: number;
    completed: number;
  };
  usersByRole: {
    developers: number;
    brokers: number;
    owners: number;
    lenders: number;
    buyers: number;
  };
  pendingApprovals: number;
  verifiedUsers: number;
  rejectedUsers: number;
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

  const updateUser = async (userId: string, userData: Partial<AdminUser>) => {
    const response = await client.patch(`/admin/users/${userId}`, userData);

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

  const deleteUser = async (userId: string) => {
    const response = await client.delete(`/admin/users/${userId}`);

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

  const bulkUpdateUsers = async (
    userIds: string[],
    updates: Partial<AdminUser>
  ) => {
    const response = await client.patch("/admin/users/bulk", {
      userIds,
      updates,
    });

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

  const bulkDeleteUsers = async (userIds: string[]) => {
    const response = await client.delete("/admin/users/bulk", {
      data: { userIds },
    });

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

  const bulkActivateUsers = async (userIds: string[]) => {
    const response = await client.patch("/admin/users/bulk-activate", {
      userIds,
    });

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

  const bulkDeactivateUsers = async (userIds: string[]) => {
    const response = await client.patch("/admin/users/bulk-deactivate", {
      userIds,
    });

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

  const activateUser = async (userId: string) => {
    const response = await client.patch(`/admin/users/${userId}/activate`);

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

  const deactivateUser = async (userId: string) => {
    const response = await client.patch(`/admin/users/${userId}/deactivate`);

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

  const sendBulkEmail = async (data: {
    emails: string[];
    subject: string;
    message: string;
    attachment?: string; // base64 encoded file data
    attachmentName?: string; // original filename
    attachmentType?: string; // MIME type
  }) => {
    const response = await client.post("/admin/bulk-email", data);

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

  const getDashboardOverview = async () => {
    const response = await client.get("/admin/dashboard");

    if (response.data) {
      return {
        success: true,
        data: response.data as DashboardOverview,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const getRecentActivity = async (limit: number = 10) => {
    const response = await client.get(
      `/admin/dashboard/recent-activity?limit=${limit}`
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

  const getVerificationStats = async () => {
    const response = await client.get("/admin/verification-stats");

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

  // Promo Codes Management
  const createPromoCode = async (promoData: {
    code: string;
    name: string;
    description: string;
    type: "percentage" | "fixed_amount";
    value: number;
    minimumAmount?: number;
    maximumDiscount?: number;
    maxUses?: number;
    validFrom: string;
    validUntil?: string;
    isSingleUse?: boolean;
  }) => {
    const response = await client.post("/admin/promo-codes", promoData);

    if (response.data) {
      return {
        success: true,
        data: response.data as PromoCode,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const getPromoCodes = async () => {
    const response = await client.get("/admin/promo-codes");

    if (response.data) {
      return {
        success: true,
        data: response.data as PromoCodesResponse,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const getPromoCodeById = async (id: string) => {
    const response = await client.get(`/admin/promo-codes/${id}`);

    if (response.data) {
      return {
        success: true,
        data: response.data as PromoCode,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const getPromoCodeDetails = async (id: string) => {
    const response = await client.get(`/admin/promo-codes/${id}`);

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

  const updatePromoCodeStatus = async (id: string, isActive: boolean) => {
    const response = await client.put(`/admin/promo-codes/${id}/status`, {
      status: isActive ? "active" : "inactive",
    });

    if (response.data) {
      return {
        success: true,
        data: response.data as PromoCode,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const deletePromoCode = async (id: string) => {
    const response = await client.delete(`/admin/promo-codes/${id}`);

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

  // User Assignment Management
  const assignUserToPromoCode = async (promoCodeId: string, email: string) => {
    const response = await client.post(
      `/admin/promo-codes/${promoCodeId}/assign-user`,
      {
        email,
      }
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as PromoCode,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const assignMultipleUsersToPromoCode = async (
    promoCodeId: string,
    emails: string[]
  ) => {
    const response = await client.post(
      `/admin/promo-codes/${promoCodeId}/assign-multiple-users`,
      {
        emails,
      }
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as PromoCode,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const removeUserFromPromoCode = async (
    promoCodeId: string,
    email: string
  ) => {
    const response = await client.delete(
      `/admin/promo-codes/${promoCodeId}/remove-user`,
      {
        data: { email },
      }
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as PromoCode,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const clearAssignedUser = async (promoCodeId: string) => {
    const response = await client.delete(
      `/admin/promo-codes/${promoCodeId}/clear-assigned-user`
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as PromoCode,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  // Pricing Management
  const createPricing = async (pricingData: {
    propertyType: string;
    baseFee: number;
    description?: string;
  }) => {
    const response = await client.post("/admin/pricing", pricingData);

    if (response.data) {
      return {
        success: true,
        data: response.data as PricingConfig,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const getPricingConfigs = async () => {
    const response = await client.get("/admin/pricing");

    if (response.data) {
      return {
        success: true,
        data: response.data as PricingConfig[],
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const getActivePricing = async () => {
    const response = await client.get("/admin/pricing/active");

    if (response.data) {
      return {
        success: true,
        data: response.data as PricingConfig[],
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const updatePricingStatus = async (id: string, isActive: boolean) => {
    const response = await client.put(`/admin/pricing/${id}/status`, {
      isActive,
    });

    if (response.data) {
      return {
        success: true,
        data: response.data as PricingConfig,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const deletePricing = async (id: string) => {
    const response = await client.delete(`/admin/pricing/${id}`);

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

  const calculateFees = async (data: {
    propertyType: string;
    promoCode?: string;
  }) => {
    const response = await client.post("/admin/pricing/calculate", data);

    if (response.data) {
      return {
        success: true,
        data: response.data as FeeCalculation,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  // Transaction Management
  const getTransactions = async (params: TransactionsQueryParams = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.status) queryParams.append("status", params.status);
    if (params.transactionType)
      queryParams.append("transactionType", params.transactionType);
    if (params.userId) queryParams.append("userId", params.userId);
    if (params.search) queryParams.append("search", params.search);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await client.get(
      `/admin/transactions?${queryParams.toString()}`
    );

    if (response.data) {
      return {
        success: true,
        data: response.data as TransactionsResponse,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  const getTransactionById = async (transactionId: string) => {
    const response = await client.get(`/admin/transactions/${transactionId}`);

    if (response.data) {
      return {
        success: true,
        data: response.data as Transaction,
      };
    } else {
      return {
        success: false,
        error: response.error,
      };
    }
  };

  // Sales Agents Management
  const getSalesAgents = async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      period?: string;
      sortBy?: string;
      sortOrder?: string;
    } = {}
  ) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.period && params.period !== "all")
      queryParams.append("period", params.period);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await client.get(
      `/admin/sales-agents?${queryParams.toString()}`
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

  const getSalesAgentsStats = async () => {
    const response = await client.get("/admin/sales-agents/stats");

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

  const getSalesAgentById = async (agentId: string) => {
    const response = await client.get(`/admin/sales-agents/${agentId}`);

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

  const inviteSalesAgent = async (inviteData: {
    firstName: string;
    lastName: string;
    email: string;
    agentCode: string;
    phoneNumber?: string;
  }) => {
    const response = await client.post(
      "/admin/sales-agents/invite",
      inviteData
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
    updateUser,
    deleteUser,
    bulkUpdateUsers,
    bulkDeleteUsers,
    bulkActivateUsers,
    bulkDeactivateUsers,
    activateUser,
    deactivateUser,
    sendBulkEmail,
    getDashboardOverview,
    getRecentActivity,
    getVerificationStats,
    createPromoCode,
    getPromoCodes,
    getPromoCodeById,
    getPromoCodeDetails,
    updatePromoCodeStatus,
    deletePromoCode,
    assignUserToPromoCode,
    assignMultipleUsersToPromoCode,
    removeUserFromPromoCode,
    clearAssignedUser,
    createPricing,
    getPricingConfigs,
    getActivePricing,
    updatePricingStatus,
    deletePricing,
    calculateFees,
    getTransactions,
    getTransactionById,
    getSalesAgents,
    getSalesAgentsStats,
    getSalesAgentById,
    inviteSalesAgent,
  };
};
