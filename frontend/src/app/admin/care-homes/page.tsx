"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AdminLayout from "@/components/layout/admin-layout";
import {
  useAdminActions,
  CareHome,
  CareHomesQueryParams,
} from "@/actions-client/admin";
import styles from "./care-homes.module.scss";

export default function CareHomesPage() {
  const [careHomes, setCareHomes] = useState<CareHome[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCareHomes, setTotalCareHomes] = useState(0);
  const router = useRouter();
  const { getCareHomes } = useAdminActions();

  useEffect(() => {
    fetchCareHomes();
  }, [currentPage, searchTerm, statusFilter, regionFilter]);

  const fetchCareHomes = async () => {
    try {
      setIsLoading(true);

      const queryParams: CareHomesQueryParams = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        isActive:
          statusFilter === "all" ? undefined : statusFilter === "active",
        region: regionFilter === "all" ? undefined : regionFilter,
      };

      const result = await getCareHomes(queryParams);
      if (result.success && result.data) {
        setCareHomes(result.data.data || []);
        setTotalPages(Math.ceil((result.data.total || 0) / 10));
        setTotalCareHomes(result.data.total || 0);
      } else {
        toast.error(result.error || "Failed to load care homes");
      }
    } catch (error) {
      console.error("Error fetching care homes:", error);
      toast.error("Failed to load care homes");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, regionFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? styles.active : styles.inactive;
  };

  return (
    <AdminLayout>
      <div className={styles.careHomesContainer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/admin" className={styles.backButton}>
              ← Back to Dashboard
            </Link>
            <h1>Care Home Management</h1>
          </div>
          <button
            className={styles.addButton}
            onClick={() => router.push("/admin/care-homes/add")}
          >
            + Add New Care Home
          </button>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search care homes by name, city, or postcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Regions</option>
              <option value="Greater London">Greater London</option>
              <option value="Greater Manchester">Greater Manchester</option>
              <option value="West Midlands">West Midlands</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.careHomesGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.skeletonCareHomeCard}>
                <div className={styles.skeletonCardHeader}>
                  <div className={styles.skeletonCardInfo}>
                    <div className={styles.skeletonCardTitle}></div>
                    <div className={styles.skeletonCardLocation}>
                      <div className={styles.skeletonLocationLine}></div>
                      <div className={styles.skeletonLocationLine}></div>
                    </div>
                  </div>
                  <div className={styles.skeletonStatusBadge}>
                    <div className={styles.skeletonStatus}></div>
                    <div className={styles.skeletonVerifiedBadge}></div>
                  </div>
                </div>
                <div className={styles.skeletonCardBody}>
                  <div className={styles.skeletonContactInfo}>
                    <div className={styles.skeletonContactItem}>
                      <div className={styles.skeletonContactLabel}></div>
                      <div className={styles.skeletonContactValue}></div>
                    </div>
                    <div className={styles.skeletonContactItem}>
                      <div className={styles.skeletonContactLabel}></div>
                      <div className={styles.skeletonContactValue}></div>
                    </div>
                  </div>
                  <div className={styles.skeletonDetails}>
                    <div className={styles.skeletonRating}>
                      <div className={styles.skeletonRatingLabel}></div>
                      <div className={styles.skeletonRatingValue}></div>
                    </div>
                    <div className={styles.skeletonSpecializations}>
                      <div
                        className={styles.skeletonSpecializationsLabel}
                      ></div>
                      <div className={styles.skeletonSpecializationsTags}>
                        <div className={styles.skeletonTag}></div>
                        <div className={styles.skeletonTag}></div>
                        <div className={styles.skeletonTag}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.careHomesGrid}>
            {careHomes.map((careHome) => (
              <div
                key={careHome.id}
                className={styles.careHomeCard}
                onClick={() => router.push(`/admin/care-homes/${careHome.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.careHomeInfo}>
                    <h3>{careHome.name}</h3>
                    <div className={styles.location}>
                      <span>
                        📍 {careHome.city}, {careHome.region}
                      </span>
                      <span>📮 {careHome.postcode}</span>
                    </div>
                  </div>
                  <div className={styles.statusBadge}>
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
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                      <span className={styles.label}>📞 Phone:</span>
                      <span>{careHome.phone}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <span className={styles.label}>✉️ Email:</span>
                      <span>{careHome.email || "Not provided"}</span>
                    </div>
                  </div>

                  <div className={styles.details}>
                    <div className={styles.cqcRating}>
                      <span className={styles.label}>Rating:</span>
                      <span className={styles.rating}>
                        {careHome.rating
                          ? `${careHome.rating}/5 (${careHome.reviewCount} reviews)`
                          : "No reviews yet"}
                      </span>
                    </div>

                    <div className={styles.careTypes}>
                      <span className={styles.label}>Specializations:</span>
                      <div className={styles.typeTags}>
                        {careHome.specializations.map(
                          (specialization, index) => (
                            <span key={index} className={styles.typeTag}>
                              {specialization}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && careHomes.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🏠</div>
            <h3>No Care Homes Found</h3>
            <p>
              {searchTerm || statusFilter !== "all" || regionFilter !== "all"
                ? "No care homes match your current search criteria. Try adjusting your filters or search terms."
                : "Get started by adding your first care home to help families find the right care."}
            </p>
            <div className={styles.emptyStateActions}>
              {searchTerm ||
              statusFilter !== "all" ||
              regionFilter !== "all" ? (
                <button
                  className={styles.emptyStateButton}
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setRegionFilter("all");
                  }}
                >
                  Clear All Filters
                </button>
              ) : (
                <Link href="/admin/care-homes/add">
                  <button className={styles.emptyStateButton}>
                    + Add Your First Care Home
                  </button>
                </Link>
              )}
            </div>
            {searchTerm || statusFilter !== "all" || regionFilter !== "all" ? (
              <div className={styles.emptyStateFilters}>
                <span className={styles.filterLabel}>Active filters:</span>
                {searchTerm && (
                  <span className={styles.filterTag}>
                    Search: &quot;{searchTerm}&quot;
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className={styles.filterTag}>
                    Status: {statusFilter === "active" ? "Active" : "Inactive"}
                  </span>
                )}
                {regionFilter !== "all" && (
                  <span className={styles.filterTag}>
                    Region: {regionFilter}
                  </span>
                )}
              </div>
            ) : (
              <div className={styles.emptyStateStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>0</span>
                  <span className={styles.statLabel}>Total Care Homes</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>0</span>
                  <span className={styles.statLabel}>Active Homes</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>0</span>
                  <span className={styles.statLabel}>Verified Homes</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Showing {(currentPage - 1) * 10 + 1} to{" "}
              {Math.min(currentPage * 10, totalCareHomes)} of {totalCareHomes}{" "}
              care homes
            </div>
            <div className={styles.paginationControls}>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
