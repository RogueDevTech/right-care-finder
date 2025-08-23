"use client";

import { useClient } from "@/hooks";
import { ISignUpData, IUpdateUser, IUser } from "@/interfaces";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { handleError } from "@/utils/handle-error";
import { createSession } from "@/actions-server";
import { useAuthStore } from "@/store/auth.store";

interface ILoginData {
  email: string;
  password: string;
}

export const useUserActions = () => {
  const client = useClient();
  const router = useRouter();
  const { session } = useAuthStore();

  const signUp = async (payload: ISignUpData) => {
    const response = await client.post("/auth/register", payload);

    if (response.data) {
      // Store user data in localStorage for navbar (even though they need to verify email)
      localStorage.setItem(
        "userData",
        JSON.stringify({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          role: "user",
        })
      );

      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
      router.push("/login");
      return response.data;
    } else {
      handleError(response.error);
    }
  };

  const login = async (payload: ILoginData) => {
    const response = await client.post("/auth/login", payload);
    if (response.data) {
      const sessionData = response.data as { token: string; user: IUser };
      const res = await createSession(sessionData);

      if (res.ok) {
        // Store user data in localStorage for navbar
        localStorage.setItem("authToken", sessionData.token);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            firstName: sessionData.user.firstName,
            lastName: sessionData.user.lastName,
            email: sessionData.user.email,
            role: sessionData.user.role,
          })
        );

        if (["user"].includes(sessionData.user.role)) {
          router.push("/");
        } else if (["admin"].includes(sessionData.user.role)) {
          router.push("/admin");
        }
      }
      return response.data;
    } else {
      handleError(response.error);
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
      handleError(response.error);
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
      handleError(response.error);
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
      handleError(response.error);
    }
  };

  const updateProfile = async (payload: IUpdateUser) => {
    const response = await client.patch("/users/me", payload);
    if (response.error) {
      handleError(response.error);
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
      handleError(response.error);
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

  return {
    signUp,
    login,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
    updateProfile,
    changePassword,
  };
};
