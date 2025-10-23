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
        limit: 20,
        search: searchTerm || undefined,
        isActive:
          statusFilter === "all" ? undefined : statusFilter === "active",
        region: regionFilter === "all" ? undefined : regionFilter,
      };

      const result = await getCareHomes(queryParams);
      if (result.success && result.data) {
        setCareHomes(result.data.data || []);
        setTotalPages(Math.ceil((result.data.total || 0) / 20));
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
          <div className={styles.tableContainer}>
            <table className={styles.careHomesTable}>
              <thead>
                <tr>
                  <th>Care Home Name</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Specializations</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i} className={styles.skeletonRow}>
                    <td>
                      <div className={styles.nameCell}>
                        <div className={styles.skeletonName}></div>
                        <div className={styles.skeletonTextSmall}></div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.locationCell}>
                        <div className={styles.skeletonText}></div>
                        <div className={styles.skeletonTextSmall}></div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.contactCell}>
                        <div className={styles.skeletonText}></div>
                        <div className={styles.skeletonTextSmall}></div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.skeletonTags}>
                        <div className={styles.skeletonTag}></div>
                        <div className={styles.skeletonTag}></div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.skeletonStars}></div>
                    </td>
                    <td>
                      <div className={styles.skeletonStatus}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.careHomesTable}>
              <thead>
                <tr>
                  <th>Care Home Name</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Specializations</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {careHomes?.length > 0 &&
                  careHomes?.map((careHome) => (
                    <tr
                      key={careHome.id}
                      className={styles.clickableRow}
                      onClick={() =>
                        router.push(`/admin/care-homes/${careHome.id}`)
                      }
                    >
                      <td>
                        <div className={styles.nameCell}>
                          <strong>{careHome.name}</strong>
                          {careHome.isVerified && (
                            <span className={styles.verifiedBadgeTable}>
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.locationCell}>
                          <span>
                            {careHome.city}, {careHome.region}
                          </span>
                          <span className={styles.secondaryText}>
                            {careHome.postcode}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.contactCell}>
                          <span>{careHome.phone}</span>
                          <span className={styles.secondaryText}>
                            {careHome.email || "Not provided"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.specializationsCell}>
                          {careHome.specializations
                            .slice(0, 3)
                            .map((specialization, idx) => (
                              <span key={idx} className={styles.typeTag}>
                                {specialization}
                              </span>
                            ))}
                          {careHome.specializations.length > 3 && (
                            <span className={styles.typeTag}>
                              +{careHome.specializations.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.ratingCell}>
                          <span className={styles.ratingStars}>
                            {careHome.rating ? `${careHome.rating}/5` : "N/A"}
                          </span>
                          {careHome.reviewCount > 0 && (
                            <span className={styles.secondaryText}>
                              {careHome.reviewCount} reviews
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            careHome.isActive ? styles.active : styles.inactive
                          }`}
                        >
                          {careHome.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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
              Showing {(currentPage - 1) * 20 + 1} to{" "}
              {Math.min(currentPage * 20, totalCareHomes)} of {totalCareHomes}{" "}
              care homes
            </div>
            <div className={styles.paginationControls}>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                title="First Page"
              >
                ««
              </button>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Previous Page"
              >
                ‹
              </button>

              {/* Page Numbers */}
              <div className={styles.pageNumbers}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`${styles.pageNumber} ${
                        currentPage === pageNum ? styles.activePage : ""
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Next Page"
              >
                ›
              </button>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                title="Last Page"
              >
                »»
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
