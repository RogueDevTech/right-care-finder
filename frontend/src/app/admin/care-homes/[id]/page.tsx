"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { errorToString } from "@/utils/error-to-string";
import Link from "next/link";
import AdminLayout from "@/components/layout/admin-layout";
import { useAdminActions, CareHome } from "@/actions-client/admin";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import styles from "./care-home-detail.module.scss";

export default function CareHomeDetailPage() {
  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingVerification, setIsUpdatingVerification] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>("");
  const router = useRouter();
  const params = useParams();
  const careHomeId = params.id as string;
  const {
    getCareHomeById,
    toggleCareHomeStatus,
    toggleCareHomeVerification,
    deleteCareHome,
  } = useAdminActions();

  useEffect(() => {
    if (careHomeId) {
      fetchCareHomeDetails();
    }
  }, [careHomeId]);

  const fetchCareHomeDetails = async () => {
    try {
      setIsLoading(true);
      const result = await getCareHomeById(careHomeId);

      if (result.success && result.data) {
        setCareHome(result.data);
      } else {
        toast.error(result.error ? errorToString(result.error, "Failed to load care home details") : "Failed to load care home details");
      }
    } catch (error) {
      console.error("Error fetching care home details:", error);
      toast.error("Failed to load care home details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (!careHome || isUpdatingStatus) return;

    setPendingStatus(newStatus);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!careHome || isUpdatingStatus) return;

    try {
      setIsUpdatingStatus(true);
      const isActive = pendingStatus === "active";
      const result = await toggleCareHomeStatus(careHomeId, isActive);

      if (result.success) {
        setCareHome((prev) =>
          prev
            ? {
                ...prev,
                isActive: isActive,
              }
            : null
        );
        toast.success("Care home status updated successfully");
        setShowStatusModal(false);
      } else {
        toast.error(result.error ? errorToString(result.error, "Failed to update care home status") : "Failed to update care home status");
      }
    } catch (error) {
      console.error("Error updating care home status:", error);
      toast.error("Failed to update care home status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleVerificationToggle = () => {
    if (!careHome || isUpdatingVerification) return;
    setShowVerificationModal(true);
  };

  const confirmVerificationToggle = async () => {
    if (!careHome || isUpdatingVerification) return;

    try {
      setIsUpdatingVerification(true);
      const isVerified = !careHome.isVerified;
      const result = await toggleCareHomeVerification(careHomeId, isVerified);

      if (result.success) {
        setCareHome((prev) =>
          prev ? { ...prev, isVerified: isVerified } : null
        );
        toast.success(
          `Care home ${isVerified ? "verified" : "unverified"} successfully`
        );
        setShowVerificationModal(false);
      } else {
        toast.error(result.error ? errorToString(result.error, "Failed to update verification status") : "Failed to update verification status");
      }
    } catch (error) {
      console.error("Error updating verification status:", error);
      toast.error("Failed to update verification status");
    } finally {
      setIsUpdatingVerification(false);
    }
  };

  const handleDeleteClick = () => {
    if (!careHome || isDeleting) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!careHome || isDeleting) return;

    try {
      setIsDeleting(true);
      const result = await deleteCareHome(careHomeId);

      if (result.success) {
        toast.success("Care home deleted successfully");
        setShowDeleteModal(false);
        router.push("/admin/care-homes");
      } else {
        toast.error(
          result.error
            ? errorToString(result.error, "Failed to delete care home")
            : "Failed to delete care home"
        );
      }
    } catch (error) {
      console.error("Error deleting care home:", error);
      toast.error("Failed to delete care home");
    } finally {
      setIsDeleting(false);
    }
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
              onClick={() =>
                router.push(`/admin/care-homes/${careHomeId}/edit`)
              }
              disabled={isLoading}
            >
              Edit Details
            </button>
            <button
              className={styles.deleteButton}
              onClick={handleDeleteClick}
              disabled={isLoading}
            >
              Delete Care Home
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingCard}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading care home details...</p>
            </div>
          </div>
        ) : careHome ? (
          <>
            {/* Status and Quick Actions */}
            <div className={styles.statusCard}>
              <div className={styles.statusHeader}>
                <div className={styles.statusInfo}>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Status</span>
                    <span
                      className={`${styles.statusBadge} ${
                        careHome.isActive ? styles.active : styles.inactive
                      }`}
                    >
                      {careHome.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {careHome.isVerified && (
                    <div className={styles.statusItem}>
                      <span className={styles.verifiedBadge}>✓ Verified</span>
                    </div>
                  )}
                </div>
                <div className={styles.statusActions}>
                  <select
                    value={careHome.isActive ? "active" : "inactive"}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={styles.statusSelect}
                    disabled={isUpdatingStatus}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    className={styles.verifyButton}
                    onClick={handleVerificationToggle}
                    disabled={isUpdatingVerification}
                  >
                    {isUpdatingVerification
                      ? "Updating..."
                      : careHome.isVerified
                      ? "Unverify"
                      : "Verify"}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className={styles.contentGrid}>
              {/* Basic Information Card */}
              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <h3>Basic Information</h3>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Care Home Name</span>
                      <span className={styles.infoValue}>{careHome.name}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Address Line 1</span>
                      <span className={styles.infoValue}>
                        {careHome.addressLine1}
                      </span>
                    </div>
                    {careHome.addressLine2 && (
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Address Line 2</span>
                        <span className={styles.infoValue}>
                          {careHome.addressLine2}
                        </span>
                      </div>
                    )}
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>City</span>
                      <span className={styles.infoValue}>{careHome.city}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Region/County</span>
                      <span className={styles.infoValue}>
                        {careHome.region || "Not specified"}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Postal Code</span>
                      <span className={styles.infoValue}>
                        {careHome.postcode}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Country</span>
                      <span className={styles.infoValue}>
                        {careHome.country || "Not specified"}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Coordinates</span>
                      <span className={styles.infoValue}>
                        {careHome.latitude && careHome.longitude
                          ? `${careHome.latitude}, ${careHome.longitude}`
                          : "Not available"}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Phone</span>
                      <span className={styles.infoValue}>{careHome.phone}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Email</span>
                      <span className={styles.infoValue}>
                        {careHome.email || "Not provided"}
                      </span>
                    </div>
                    {careHome.website && (
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Website</span>
                        <a
                          href={careHome.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.websiteLink}
                        >
                          {careHome.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Care Details Card */}
              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <h3>Care Details</h3>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Rating</span>
                      <div className={styles.ratingInfo}>
                        <span className={styles.ratingStars}>
                          {careHome.rating ? `${careHome.rating}/5` : "N/A"}
                        </span>
                        {careHome.reviewCount > 0 && (
                          <span className={styles.reviewCount}>
                            ({careHome.reviewCount} reviews)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Care Type ID</span>
                      <div className={styles.typeTags}>
                        <span className={styles.typeTag}>
                          {careHome.careTypeId || "Not specified"}
                        </span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Total Beds</span>
                      <span className={styles.infoValue}>
                        {careHome.totalBeds} beds
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Available Beds</span>
                      <span className={styles.infoValue}>
                        {careHome.availableBeds} beds
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Weekly Price</span>
                      <span className={styles.infoValue}>
                        {careHome.weeklyPrice
                          ? `£${careHome.weeklyPrice}`
                          : "Not specified"}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Monthly Price</span>
                      <span className={styles.infoValue}>
                        {careHome.monthlyPrice
                          ? `£${careHome.monthlyPrice}`
                          : "Not specified"}
                      </span>
                    </div>
                    {careHome.description &&
                      careHome.description.length > 0 && (
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Description</span>
                          <div className={styles.descriptionList}>
                            {careHome.description.map((desc, idx) => (
                              <p key={idx} className={styles.description}>
                                {desc}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Specializations Card */}
              {careHome.specializations &&
                careHome.specializations.length > 0 && (
                  <div className={styles.infoCard}>
                    <div className={styles.cardHeader}>
                      <h3>Specializations</h3>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.specializationsGrid}>
                        {careHome.specializations.map((specialization, idx) => (
                          <span key={idx} className={styles.specializationTag}>
                            {specialization}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {/* Contact Information Card */}
              {careHome.contactInfo && (
                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <h3>Contact Information</h3>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.infoGrid}>
                      {careHome.contactInfo.manager && (
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Manager</span>
                          <span className={styles.infoValue}>
                            {careHome.contactInfo.manager}
                          </span>
                        </div>
                      )}
                      {careHome.contactInfo.emergency && (
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>
                            Emergency Contact
                          </span>
                          <span className={styles.infoValue}>
                            {careHome.contactInfo.emergency}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Opening Hours Card */}
              {careHome.openingHours && (
                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <h3>Opening Hours</h3>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.openingHoursGrid}>
                      {Object.entries(careHome.openingHours).map(
                        ([day, hours]) => (
                          <div key={day} className={styles.hoursItem}>
                            <span className={styles.dayLabel}>{day}</span>
                            <span className={styles.hoursValue}>{hours}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* System Information Card */}
              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <h3>System Information</h3>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Care Home ID</span>
                      <span className={styles.infoValue}>{careHome.id}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Created Date</span>
                      <span className={styles.infoValue}>
                        {new Date(careHome.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Last Updated</span>
                      <span className={styles.infoValue}>
                        {new Date(careHome.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Featured</span>
                      <span
                        className={`${styles.statusBadge} ${
                          careHome.isFeatured ? styles.active : styles.inactive
                        }`}
                      >
                        {careHome.isFeatured ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>🏠</div>
            <h2>Care Home Not Found</h2>
            <p>The care home you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/admin/care-homes" className={styles.backButton}>
              ← Back to Care Homes
            </Link>
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={confirmStatusChange}
        title={`${
          pendingStatus === "active" ? "Activate" : "Deactivate"
        } Care Home`}
        message={`Are you sure you want to ${
          pendingStatus === "active" ? "activate" : "deactivate"
        } this care home? This will ${
          pendingStatus === "active" ? "make it visible" : "hide it"
        } from public listings.`}
        confirmText={pendingStatus === "active" ? "Activate" : "Deactivate"}
        cancelText="Cancel"
        isLoading={isUpdatingStatus}
        type="warning"
      />

      <ConfirmationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onConfirm={confirmVerificationToggle}
        title={`${careHome?.isVerified ? "Unverify" : "Verify"} Care Home`}
        message={`Are you sure you want to ${
          careHome?.isVerified ? "unverify" : "verify"
        } this care home? ${
          careHome?.isVerified
            ? "This will remove the verified badge"
            : "This will add a verified badge"
        } and may affect its credibility.`}
        confirmText={careHome?.isVerified ? "Unverify" : "Verify"}
        cancelText="Cancel"
        isLoading={isUpdatingVerification}
        type="info"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Care Home"
        message="Are you sure you want to delete this care home? This action cannot be undone."
        confirmText="Delete Care Home"
        cancelText="Cancel"
        isLoading={isDeleting}
        type="danger"
      />
    </AdminLayout>
  );
}
