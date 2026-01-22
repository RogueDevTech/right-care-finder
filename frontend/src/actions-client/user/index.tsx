"use client";

import { useClient } from "@/hooks";
import { ISignUpData, IUpdateUser, IUser } from "@/interfaces";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { handleError } from "@/utils/handle-error";
import { createSession } from "@/actions-server";
import { useAuthStore } from "@/store/auth.store";
import { CareHome } from "../healthcare-homes";

interface ILoginData {
  email: string;
  password: string;
}

export interface Booking {
  id: string;
  residentName: string;
  contactName: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  roomType: string;
  specialRequirements?: string;
  createdAt: string;
  careHomeName: string;
  careHomeId?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  careHomeName: string;
  careHomeId?: string;
  createdAt: string;
  readAt?: string;
  repliedAt?: string;
}

export const useUserActions = () => {
  const client = useClient();
  const router = useRouter();
  const { session } = useAuthStore();

  // Helper function to convert unknown error to string | string[]
  const normalizeError = (error: unknown): string | string[] => {
    if (typeof error === "string") return error;
    if (Array.isArray(error)) return error.map(String);
    if (error instanceof Error) return error.message;
    return "An error occurred";
  };

  // Helper function to convert unknown error to string (for error fields)
  const errorToString = (error: unknown, fallback: string = "An error occurred"): string => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return fallback;
  };

  const signUp = async (payload: ISignUpData) => {
    const response = await client.post("/auth/register", payload);

    if (response.data) {
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
      router.push("/login");
      return response.data;
    } else {
      handleError(normalizeError(response.error));
    }
  };

  const login = async (payload: ILoginData) => {
    const response = await client.post("/auth/login", payload);
    if (response.data) {
      const sessionData = (
        response.data as { data: { token: string; user: IUser } }
      ).data as { token: string; user: IUser };
      const res = await createSession(sessionData);

      if (res.ok) {
        if (["user"].includes(sessionData.user.role)) {
          router.push("/");
        } else if (["admin"].includes(sessionData.user.role)) {
          router.push("/admin");
        } else if (["owner"].includes(sessionData.user.role)) {
          router.push("/owner");
        }
      }
      return response.data;
    } else {
      handleError(normalizeError(response.error));
    }
  };

  const forgotPassword = async (email: string) => {
    const response = await client.post("/auth/forgot-password", {
      email,
    });
    if (response.data) {
      toast.success("Password reset link sent! Please check your email.");
      return response.data;
    } else {
      handleError(normalizeError(response.error));
    }
  };

  const resetPassword = async (token: string, password: string) => {
    const response = await client.post("/auth/reset-password", {
      token,
      password,
    });
    if (response.data) {
      toast.success("Password reset successful! You can now sign in.");
      return response.data;
    } else {
      handleError(normalizeError(response.error));
    }
  };

  const resendVerificationEmail = async () => {
    const response = await client.post("/auth/resend-email-verification", {
      email: session.user?.email,
    });
    if (response.data) {
      toast.success("Verification email sent successfully!");
      return response.data;
    } else {
      handleError(normalizeError(response.error));
    }
  };

  const updateProfile = async (payload: IUpdateUser) => {
    const response = await client.patch("/users/me", payload);
    if (response.error) {
      handleError(normalizeError(response.error));
      return {
        success: false,
        data: null,
      };
    } else {
      toast.success("Profile updated successfully!");
      return {
        success: true,
        data: response.data,
      };
    }
  };

  const changePassword = async (payload: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await client.patch("/users/change-password", payload);
    if (response.error) {
      handleError(normalizeError(response.error));
      return {
        success: false,
        data: null,
      };
    } else {
      toast.success("Password changed successfully!");
      return {
        success: true,
        data: response.data,
      };
    }
  };

  // Owner-specific actions
  const getMyCareHomes = async (): Promise<{
    success: boolean;
    data?: CareHome[];
    error?: string;
  }> => {
    try {
      // Use the owner-specific endpoint to get care homes
      const response = await client.get("/users/me/care-homes");

      if (response.error) {
        const errorMessage = errorToString(response.error, "Failed to fetch care homes");
        return {
          success: false,
          error: errorMessage,
        };
      }

      // The response should be in the format: { data: { data: CareHome[] } }
      const careHomes = (response.data as { data: CareHome[] })?.data || [];

      return {
        success: true,
        data: careHomes,
      };
    } catch (error) {
      console.error("Error fetching care homes:", error);
      return {
        success: false,
        error:
          "Failed to fetch care homes. Please contact support if this issue persists.",
      };
    }
  };

  // Booking actions for owners
  const getMyBookings = async (params?: {
    status?: "pending" | "confirmed" | "cancelled" | "completed";
    search?: string;
  }): Promise<{
    success: boolean;
    data?: Booking[];
    error?: string;
  }> => {
    try {
      // TODO: Replace with actual endpoint when backend is ready
      // const queryParams = new URLSearchParams();
      // if (params?.status) queryParams.append("status", params.status);
      // if (params?.search) queryParams.append("search", params.search);
      // const response = await client.get(`/users/me/bookings?${queryParams.toString()}`);

      // For now, return empty array - backend endpoint will be implemented later
      // This is a placeholder that will be replaced when the API is ready
      // Using params to avoid linter warning - will be used when API is ready
      void params;
      return {
        success: true,
        data: [],
      };
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return {
        success: false,
        error:
          "Failed to fetch bookings. Please contact support if this issue persists.",
      };
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: "confirmed" | "cancelled"
  ): Promise<{
    success: boolean;
    data?: Booking;
    error?: string;
  }> => {
    try {
      // TODO: Replace with actual endpoint when backend is ready
      // const response = await client.patch(`/users/me/bookings/${bookingId}/status`, { status });

      // Placeholder response
      // Using parameters to avoid linter warning - will be used when API is ready
      void bookingId;
      void status;
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error updating booking status:", error);
      return {
        success: false,
        error: "Failed to update booking status. Please try again.",
      };
    }
  };

  // Enquiry actions for owners
  const getMyEnquiries = async (params?: {
    status?: "new" | "read" | "replied" | "archived";
    search?: string;
  }): Promise<{
    success: boolean;
    data?: Enquiry[];
    error?: string;
  }> => {
    try {
      // TODO: Replace with actual endpoint when backend is ready
      // const queryParams = new URLSearchParams();
      // if (params?.status) queryParams.append("status", params.status);
      // if (params?.search) queryParams.append("search", params.search);
      // const response = await client.get(`/users/me/enquiries?${queryParams.toString()}`);

      // For now, return empty array - backend endpoint will be implemented later
      // This is a placeholder that will be replaced when the API is ready
      // Using params to avoid linter warning - will be used when API is ready
      void params;
      return {
        success: true,
        data: [],
      };
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      return {
        success: false,
        error:
          "Failed to fetch enquiries. Please contact support if this issue persists.",
      };
    }
  };

  const updateEnquiryStatus = async (
    enquiryId: string,
    status: "read" | "archived"
  ): Promise<{
    success: boolean;
    data?: Enquiry;
    error?: string;
  }> => {
    try {
      // TODO: Replace with actual endpoint when backend is ready
      // const response = await client.patch(`/users/me/enquiries/${enquiryId}/status`, { status });

      // Placeholder response
      // Using parameters to avoid linter warning - will be used when API is ready
      void enquiryId;
      void status;
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error updating enquiry status:", error);
      return {
        success: false,
        error: "Failed to update enquiry status. Please try again.",
      };
    }
  };

  const replyToEnquiry = async (
    enquiryId: string,
    message: string
  ): Promise<{
    success: boolean;
    data?: Enquiry;
    error?: string;
  }> => {
    try {
      // TODO: Replace with actual endpoint when backend is ready
      // const response = await client.post(`/users/me/enquiries/${enquiryId}/reply`, { message });

      // Placeholder response
      // Using parameters to avoid linter warning - will be used when API is ready
      void enquiryId;
      void message;
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error replying to enquiry:", error);
      return {
        success: false,
        error: "Failed to send reply. Please try again.",
      };
    }
  };

  return {
    signUp,
    login,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
    updateProfile,
    changePassword,
    getMyCareHomes,
    getMyBookings,
    updateBookingStatus,
    getMyEnquiries,
    updateEnquiryStatus,
    replyToEnquiry,
  };
};
