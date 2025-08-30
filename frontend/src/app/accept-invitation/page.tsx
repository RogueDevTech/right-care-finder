"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import styles from "./accept-invitation.module.scss";

interface AcceptInvitationForm {
  password: string;
  confirmPassword: string;
  phoneNumber: string;
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

function AcceptInvitationContent() {
  const [formData, setFormData] = useState<AcceptInvitationForm>({
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(
    null
  );
  const [isValidating, setIsValidating] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      validateInvitation();
    } else {
      setIsValidating(false);
    }
  }, [token]);

  const validateInvitation = async () => {
    try {
      // TODO: Call API to validate invitation token
      const response = await fetch(`/api/invitations/validate?token=${token}`);
      const data = await response.json();

      if (data.success) {
        setInvitationData(data.invitation);
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

      // TODO: Call API to accept invitation and create user account
      const response = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Account created successfully! You can now log in.");
        router.push("/login");
      } else {
        toast.error(data.error || "Failed to create account");
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
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Validating your invitation...</p>
        </div>
      </div>
    );
  }

  if (!token || !invitationData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
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
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1>Welcome to Right Care Finder</h1>
          <p>Complete your account setup to start managing your care home</p>
        </div>

        <div className={styles.invitationInfo}>
          <h2>Invitation Details</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Name:</span>
              <span>
                {invitationData.firstName} {invitationData.lastName}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Email:</span>
              <span>{invitationData.email}</span>
            </div>
            {invitationData.careHomeName && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Care Home:</span>
                <span>{invitationData.careHomeName}</span>
              </div>
            )}
            {invitationData.careHomeAddress && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Address:</span>
                <span>{invitationData.careHomeAddress}</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

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
