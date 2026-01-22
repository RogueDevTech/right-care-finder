"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import AppLogo from "@/../public/right-care-logo.png";
import styles from "./accept-invitation.module.scss";
import { useAdminActions } from "@/actions-client/admin";

interface AcceptInvitationForm {
  password: string;
  confirmPassword: string;
}

interface InvitationData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  careHomeName?: string;
  careHomeAddress?: string;
  message?: string;
  status: "pending" | "accepted" | "expired";
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
}

interface ValidateInvitationResponse {
  success: boolean;
  invitation: InvitationData;
}

function AcceptInvitationContent() {
  const [formData, setFormData] = useState<AcceptInvitationForm>({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(
    null
  );
  const [isValidating, setIsValidating] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { validateInvitation, acceptInvitation } = useAdminActions();

  // Helper function to convert unknown error to string
  const errorToString = (error: unknown, fallback: string = "An error occurred"): string => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return fallback;
  };

  useEffect(() => {
    if (token) {
      validateInvitationToken();
    } else {
      setIsValidating(false);
    }
  }, [token]);

  const validateInvitationToken = async () => {
    try {
      const result = await validateInvitation(token!);

      if (result.success && result.data) {
        const response = result.data as ValidateInvitationResponse;
        if (response.invitation) {
          setInvitationData(response.invitation);
        } else {
          toast.error("Invalid or expired invitation link");
        }
      } else {
        toast.error("Invalid or expired invitation link");
      }
    } catch (error) {
      console.error("Error validating invitation:", error);
      toast.error("Failed to validate invitation");
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsLoading(true);

      const result = await acceptInvitation({
        token: token!,
        password: formData.password,
      });

      if (result.success) {
        toast.success("Account created successfully! You can now log in.");
        router.push("/login");
      } else {
        const errorMessage = result.error 
          ? errorToString(result.error, "Failed to create account")
          : "Failed to create account";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className={styles.container}>
        <div className={styles.backButton}>
          <Link href="/">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.logo}>
            <Image
              src={AppLogo}
              alt="Right Care Finder"
              width={120}
              height={40}
            />
          </div>
          <div className={styles.loadingSpinner}></div>
          <p>Validating your invitation...</p>
        </div>
      </div>
    );
  }

  if (!token || !invitationData) {
    return (
      <div className={styles.container}>
        <div className={styles.backButton}>
          <Link href="/">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
        <div className={styles.errorContainer}>
          <div className={styles.logo}>
            <Image
              src={AppLogo}
              alt="Right Care Finder"
              width={120}
              height={40}
            />
          </div>
          <div className={styles.errorIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1>Invalid Invitation</h1>
          <p>The invitation link is invalid or has expired.</p>
          <Link href="/" className={styles.homeLink}>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <Link href="/">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5M12 19L5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Image
              src={AppLogo}
              alt="Right Care Finder"
              width={120}
              height={40}
            />
          </div>
          <h1>Welcome to Right Care Finder</h1>
          <p>Complete your account setup to start managing your care home</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password (min 8 characters)"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            By creating an account, you agree to our{" "}
            <Link href="/terms" className={styles.link}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className={styles.link}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
