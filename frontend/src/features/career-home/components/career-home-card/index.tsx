"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import {
  useHealthcareHomesActions,
  CareHome,
} from "@/actions-client/healthcare-homes";
import { toast } from "react-hot-toast";
import SkeletonLoader from "./skeleton-card";
import CareHomeCard from "@/components/ui/care-home-card";

interface CareerHomeCardProps {
  filters?: {
    careTypeId?: string;
    region?: string;
    specializations?: string[];
  };
}

const CareerHomeCard: React.FC<CareerHomeCardProps> = ({ filters = {} }) => {
  console.log("CareerHomeCard re-rendering with filters:", filters);
  const [careHomes, setCareHomes] = useState<CareHome[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCareHomes, setTotalCareHomes] = useState(0);
  const { getHomeCreListings } = useHealthcareHomesActions();

  // Clear care homes when filters change
  useEffect(() => {
    setCareHomes([]);
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    const fetchCareHomes = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching care homes with filters:", filters);
        const response = await getHomeCreListings({
          page: currentPage,
          limit: 20,
          sortBy: "createdAt",
          sortOrder: "DESC",
          ...filters,
        });

        console.log("API Response:", response);

        if (response.success && response.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const careHomesData = Array.isArray((response.data as any).data.data)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (response.data as any).data.data
            : [];
          console.log("Care homes data:", careHomesData);
          setCareHomes(careHomesData);
          setTotalPages(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Math.ceil(((response.data as any).data.total || 0) / 20),
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setTotalCareHomes((response.data as any).data.total || 0);
        } else {
          console.log("API call failed:", response);
          toast.error("Failed to load care homes");
          setCareHomes([]);
        }
      } catch (error) {
        console.error("Error fetching care homes:", error);
        toast.error("Failed to load care homes");
        setCareHomes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareHomes();
  }, [currentPage, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  console.log(
    "Current careHomes state:",
    careHomes,
    "Length:",
    careHomes.length,
  );

  if (careHomes.length === 0) {
    return (
      <div className={styles.noResults}>
        <h3>No care homes found</h3>
        <p>
          We couldn&apos;t find any care homes matching your current search
          criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.cardWrapper}>
      {careHomes.map((careHome) => (
        <CareHomeCard key={careHome.id} careHome={careHome} />
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationContent}>
            {/* Left: Page Info */}
            <div className={styles.pageInfo}>
              <span className={styles.pageText}>
                Page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong>
              </span>
              <span className={styles.separator}>•</span>
              <span className={styles.resultsText}>
                {totalCareHomes} {totalCareHomes === 1 ? "result" : "results"}
              </span>
            </div>

            {/* Center: Page Numbers */}
            <div className={styles.pageNumbersContainer}>
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`${styles.pageBtn} ${
                      currentPage === pageNum ? styles.pageActive : ""
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                    aria-label={`Page ${pageNum}`}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Right: Navigation */}
            <div className={styles.navButtons}>
              <button
                className={styles.navBtn}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12.5 15L7.5 10L12.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Previous</span>
              </button>
              <button
                className={styles.navBtn}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <span>Next</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerHomeCard;
