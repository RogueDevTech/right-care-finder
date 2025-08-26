"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AdminLayout from "@/components/layout/admin-layout";
import { useAdminActions, CareHome } from "@/actions-client/admin";
import styles from "./care-home-detail.module.scss";

export default function CareHomeDetailPage() {
  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const params = useParams();
  const careHomeId = params.id as string;
  const { getCareHomeById } = useAdminActions();

  useEffect(() => {
    if (careHomeId) {
      fetchCareHomeDetails();
    }
  }, [careHomeId, getCareHomeById]);

  const fetchCareHomeDetails = async () => {
    try {
      setIsLoading(true);
      const result = await getCareHomeById(careHomeId);

      if (result.success && result.data) {
        setCareHome(result.data);
      } else {
        toast.error(result.error || "Failed to load care home details");
      }
    } catch (error) {
      console.error("Error fetching care home details:", error);
      toast.error("Failed to load care home details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!careHome) return;

    try {
      // TODO: Replace with actual API call
      setCareHome((prev) =>
        prev
          ? {
              ...prev,
              isActive: newStatus === "active",
            }
          : null
      );
      toast.success("Care home status updated successfully");
    } catch {
      toast.error("Failed to update care home status");
    }
  };

  const handleVerificationToggle = async () => {
    if (!careHome) return;

    try {
      // TODO: Replace with actual API call
      setCareHome((prev) =>
        prev ? { ...prev, isVerified: !prev.isVerified } : null
      );
      toast.success(
        `Care home ${
          careHome.isVerified ? "unverified" : "verified"
        } successfully`
      );
    } catch {
      toast.error("Failed to update verification status");
    }
  };

  const handleDelete = async () => {
    if (!careHome) return;

    if (
      window.confirm(
        "Are you sure you want to delete this care home? This action cannot be undone."
      )
    ) {
      try {
        // TODO: Replace with actual API call
        toast.success("Care home deleted successfully");
        router.push("/admin/care-homes");
      } catch {
        toast.error("Failed to delete care home");
      }
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? styles.active : styles.inactive;
  };

  return (
    <AdminLayout>
      <div className={styles.detailContainer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/admin/care-homes" className={styles.backButton}>
              ← Back to Care Homes
            </Link>
            <h1>
              {isLoading ? "Loading..." : careHome?.name || "Care Home Details"}
            </h1>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.editButton}
              onClick={() => setIsEditing(!isEditing)}
              disabled={isLoading}
            >
              {isEditing ? "Cancel Edit" : "Edit Details"}
            </button>
            <button
              className={styles.deleteButton}
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete Care Home
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.pageLoader}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading care home details...</p>
          </div>
        ) : careHome ? (
          <>
            <div className={styles.statusSection}>
              <div className={styles.statusInfo}>
                <span className={styles.label}>Status:</span>
                <span
                  className={`${styles.status} ${getStatusColor(
                    careHome.isActive
                  )}`}
                >
                  {careHome.isActive ? "Active" : "Inactive"}
                </span>
                {careHome.isVerified && (
                  <span className={styles.verifiedBadge}>✓ Verified</span>
                )}
              </div>
              <div className={styles.statusActions}>
                <select
                  value={careHome.isActive ? "active" : "inactive"}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={styles.statusSelect}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button
                  className={styles.verifyButton}
                  onClick={handleVerificationToggle}
                >
                  {careHome.isVerified ? "Unverify" : "Verify"}
                </button>
              </div>
            </div>

            <div className={styles.contentGrid}>
              <div className={styles.mainInfo}>
                <div className={styles.infoCard}>
                  <h3>Basic Information</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Name:</span>
                      <span>{careHome.name}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Address:</span>
                      <span>
                        {careHome.addressLine1}, {careHome.city},{" "}
                        {careHome.region} {careHome.postcode}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Phone:</span>
                      <span>{careHome.phone}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Email:</span>
                      <span>{careHome.email}</span>
                    </div>
                    {careHome.website && (
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Website:</span>
                        <a
                          href={careHome.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {careHome.website}
                        </a>
                      </div>
                    )}
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Total Beds:</span>
                      <span>{careHome.totalBeds} beds</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Available Beds:</span>
                      <span>{careHome.availableBeds} beds</span>
                    </div>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <h3>Care Information</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Rating:</span>
                      <span className={styles.rating}>
                        {careHome.rating
                          ? `${careHome.rating}/5 (${careHome.reviewCount} reviews)`
                          : "No reviews yet"}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Care Type:</span>
                      <div className={styles.typeTags}>
                        <span className={styles.typeTag}>
                          {careHome.careTypeId || "Not specified"}
                        </span>
                      </div>
                    </div>
                    {careHome.description &&
                      careHome.description.length > 0 && (
                        <div className={styles.infoItem}>
                          <span className={styles.label}>Description:</span>
                          <p className={styles.description}>
                            {careHome.description[0]}
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {careHome.contactInfo && (
                  <div className={styles.infoCard}>
                    <h3>Contact Information</h3>
                    <div className={styles.infoGrid}>
                      {careHome.contactInfo.manager && (
                        <div className={styles.infoItem}>
                          <span className={styles.label}>Manager:</span>
                          <span>{careHome.contactInfo.manager}</span>
                        </div>
                      )}
                      {careHome.contactInfo.emergency && (
                        <div className={styles.infoItem}>
                          <span className={styles.label}>
                            Emergency Contact:
                          </span>
                          <span>{careHome.contactInfo.emergency}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.sidebar}>
                <div className={styles.infoCard}>
                  <h3>Quick Actions</h3>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton}>
                      📧 Send Message
                    </button>
                    <button className={styles.actionButton}>
                      📊 View Analytics
                    </button>
                    <button className={styles.actionButton}>
                      📝 View Reviews
                    </button>
                    <button className={styles.actionButton}>
                      🖼️ Manage Photos
                    </button>
                    <button className={styles.actionButton}>
                      📋 View Enquiries
                    </button>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <h3>Timeline</h3>
                  <div className={styles.timeline}>
                    <div className={styles.timelineItem}>
                      <span className={styles.timelineDate}>Jan 15, 2024</span>
                      <span className={styles.timelineEvent}>
                        Care home created
                      </span>
                    </div>
                    <div className={styles.timelineItem}>
                      <span className={styles.timelineDate}>Jan 20, 2024</span>
                      <span className={styles.timelineEvent}>
                        Verified by admin
                      </span>
                    </div>
                    <div className={styles.timelineItem}>
                      <span className={styles.timelineDate}>Jan 25, 2024</span>
                      <span className={styles.timelineEvent}>
                        First review received
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.errorContainer}>
            <h2>Care Home Not Found</h2>
            <p>The care home you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/admin/care-homes" className={styles.backButton}>
              ← Back to Care Homes
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
