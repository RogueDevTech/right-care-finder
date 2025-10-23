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
            Math.ceil(((response.data as any).data.total || 0) / 20)
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
    careHomes.length
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
  );
};

export default CareerHomeCard;
