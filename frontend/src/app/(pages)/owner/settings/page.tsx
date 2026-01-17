"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useUserActions } from "@/actions-client/user";
import { useAuthStore } from "@/store/auth.store";
import { getSession } from "@/actions-server";
import Button from "@/components/ui/button";
import styles from "./settings.module.scss";

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function OwnerSettingsPage() {
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const { session, setSession } = useAuthStore();
  const { updateProfile, changePassword } = useUserActions();

  // Fetch session on mount if not available
  useEffect(() => {
    const fetchSession = async () => {
      if (!session?.user) {
        try {
          const serverSession = await getSession();
          if (serverSession) {
            setSession(serverSession);
          }
        } catch (error) {
          console.error("Error fetching session:", error);
        } finally {
          setIsLoadingSession(false);
        }
      } else {
        setIsLoadingSession(false);
      }
    };

    fetchSession();
  }, [session, setSession]);

  useEffect(() => {
    if (session?.user) {
      setProfileForm({
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        email: session.user.email || "",
        phoneNumber: session.user.phoneNumber || "",
      });
    }
  }, [session]);

  const handleProfileChange = (field: keyof ProfileForm, value: string) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingProfile(true);

    try {
      const result = await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        phoneNumber: profileForm.phoneNumber,
      });

      if (result?.success) {
        // Toast is already shown in the action
        // Refresh the page to get updated session data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoadingPassword(true);

    try {
      const result = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (result?.success) {
        // Toast is already shown in the action
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        // Error is already handled in the action
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setIsLoadingPassword(false);
    }
  };

  if (isLoadingSession || !session?.user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.header}>
        <h1>Settings</h1>
        <p>Manage your account information and security</p>
      </div>

      <div className={styles.settingsGrid}>
        {/* Profile Information */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <h2>Profile Information</h2>
            <p>Update your personal information</p>
          </div>

          <form onSubmit={handleProfileSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.label}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={profileForm.firstName}
                  onChange={(e) =>
                    handleProfileChange("firstName", e.target.value)
                  }
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.label}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={profileForm.lastName}
                  onChange={(e) =>
                    handleProfileChange("lastName", e.target.value)
                  }
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={profileForm.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber" className={styles.label}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={profileForm.phoneNumber}
                onChange={(e) =>
                  handleProfileChange("phoneNumber", e.target.value)
                }
                className={styles.input}
                placeholder="+44 20 1234 5678"
              />
            </div>

            <div className={styles.formActions}>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoadingProfile}
              >
                {isLoadingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <h2>Change Password</h2>
            <p>Update your password to keep your account secure</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword" className={styles.label}>
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  handlePasswordChange("currentPassword", e.target.value)
                }
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword" className={styles.label}>
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  handlePasswordChange("newPassword", e.target.value)
                }
                className={styles.input}
                required
                minLength={8}
              />
              <p className={styles.helpText}>
                Password must be at least 8 characters long
              </p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange("confirmPassword", e.target.value)
                }
                className={styles.input}
                required
                minLength={8}
              />
            </div>

            <div className={styles.formActions}>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoadingPassword}
              >
                {isLoadingPassword ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
