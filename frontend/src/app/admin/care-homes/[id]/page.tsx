"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AdminLayout from "@/components/layout/admin-layout";
import styles from "./care-home-detail.module.scss";

interface CareHome {
  id: string;
  name: string;
  addressLine1: string;
  city: string;
  region: string;
  postcode: string;
  phoneNumber: string;
  email: string;
  status: "active" | "pending" | "inactive";
  cqcRating?: string;
  careTypes: string[];
  createdAt: string;
  isVerified: boolean;
  description?: string;
  website?: string;
  capacity?: number;
  managerName?: string;
  managerPhone?: string;
  managerEmail?: string;
}

export default function CareHomeDetailPage() {
  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const params = useParams();
  const careHomeId = params.id as string;

  useEffect(() => {
    if (careHomeId) {
      fetchCareHomeDetails();
    }
  }, []);

  const fetchCareHomeDetails = async () => {
    try {
      // TODO: Replace with actual API call
      const mockCareHome: CareHome = {
        id: careHomeId,
        name: "Sunset Care Home",
        addressLine1: "123 Sunset Boulevard",
        city: "London",
        region: "Greater London",
        postcode: "SW1A 1AA",
        phoneNumber: "+44 20 7123 4567",
        email: "info@sunsetcare.co.uk",
        status: "active",
        cqcRating: "Good",
        careTypes: ["Residential", "Dementia"],
        createdAt: "2024-01-15T10:30:00Z",
        isVerified: true,
        description:
          "A modern care home providing exceptional residential and dementia care services in the heart of London.",
        website: "https://sunsetcare.co.uk",
        capacity: 45,
        managerName: "Sarah Johnson",
        managerPhone: "+44 20 7123 4568",
        managerEmail: "sarah.johnson@sunsetcare.co.uk",
      };

      setCareHome(mockCareHome);
    } catch {
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
              status: newStatus as "active" | "pending" | "inactive",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return styles.active;
      case "pending":
        return styles.pending;
      case "inactive":
        return styles.inactive;
      default:
        return styles.inactive;
    }
  };

  const getCqcRatingColor = (rating?: string) => {
    switch (rating) {
      case "Outstanding":
        return styles.outstanding;
      case "Good":
        return styles.good;
      case "Requires Improvement":
        return styles.requiresImprovement;
      case "Inadequate":
        return styles.inadequate;
      default:
        return styles.noRating;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading care home details...</p>
      </div>
    );
  }

  if (!careHome) {
    return (
      <AdminLayout>
        <div className={styles.errorContainer}>
          <h2>Care Home Not Found</h2>
          <p>The care home you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin/care-homes" className={styles.backButton}>
            ← Back to Care Homes
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.detailContainer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/admin/care-homes" className={styles.backButton}>
              ← Back to Care Homes
            </Link>
            <h1>{careHome.name}</h1>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.editButton}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel Edit" : "Edit Details"}
            </button>
            <button className={styles.deleteButton} onClick={handleDelete}>
              Delete Care Home
            </button>
          </div>
        </div>

        <div className={styles.statusSection}>
          <div className={styles.statusInfo}>
            <span className={styles.label}>Status:</span>
            <span
              className={`${styles.status} ${getStatusColor(careHome.status)}`}
            >
              {careHome.status}
            </span>
            {careHome.isVerified && (
              <span className={styles.verifiedBadge}>✓ Verified</span>
            )}
          </div>
          <div className={styles.statusActions}>
            <select
              value={careHome.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={styles.statusSelect}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
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
                    {careHome.addressLine1}, {careHome.city}, {careHome.region}{" "}
                    {careHome.postcode}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Phone:</span>
                  <span>{careHome.phoneNumber}</span>
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
                {careHome.capacity && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Capacity:</span>
                    <span>{careHome.capacity} residents</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>Care Information</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>CQC Rating:</span>
                  <span
                    className={`${styles.rating} ${getCqcRatingColor(
                      careHome.cqcRating
                    )}`}
                  >
                    {careHome.cqcRating || "Not Rated"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Care Types:</span>
                  <div className={styles.typeTags}>
                    {careHome.careTypes.map((type, index) => (
                      <span key={index} className={styles.typeTag}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                {careHome.description && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Description:</span>
                    <p className={styles.description}>{careHome.description}</p>
                  </div>
                )}
              </div>
            </div>

            {careHome.managerName && (
              <div className={styles.infoCard}>
                <h3>Management</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Manager:</span>
                    <span>{careHome.managerName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Manager Phone:</span>
                    <span>{careHome.managerPhone}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Manager Email:</span>
                    <span>{careHome.managerEmail}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.sidebar}>
            <div className={styles.infoCard}>
              <h3>Quick Actions</h3>
              <div className={styles.actionButtons}>
                <button className={styles.actionButton}>📧 Send Message</button>
                <button className={styles.actionButton}>
                  📊 View Analytics
                </button>
                <button className={styles.actionButton}>📝 View Reviews</button>
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
      </div>
    </AdminLayout>
  );
}
