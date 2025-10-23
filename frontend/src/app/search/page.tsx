"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  useHealthcareHomesActions,
  CareHome,
  CareHomeQueryParams,
} from "@/actions-client/healthcare-homes";
import { toast } from "react-hot-toast";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import styles from "./search.module.scss";
import CareHomeCard from "@/components/ui/care-home-card";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const { searchCareHomes } = useHealthcareHomesActions();

  const [careHomes, setCareHomes] = useState<CareHome[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CareHomeQueryParams>({
    page: 1,
    limit: 12,
  });

  const query = searchParams.get("q") || "";
  const specializations = searchParams.get("specializations") || "";

  useEffect(() => {
    if (query) {
      setFilters((prev) => ({ ...prev, search: query, page: 1 }));
    }
  }, [query]);

  useEffect(() => {
    if (specializations) {
      setFilters((prev) => ({
        ...prev,
        specializations: [specializations],
        page: 1,
      }));
    }
  }, [specializations]);

  useEffect(() => {
    const fetchCareHomes = async () => {
      setIsLoading(true);
      try {
        const response = await searchCareHomes(filters);

        if (!response.success) {
          toast.error("Failed to load care homes");
          setCareHomes([]);
          setTotalResults(0);
        } else {
          setCareHomes(response.data?.data || []);
          setTotalResults(response.data?.total || 0);
        }
      } catch (error) {
        console.error("Error fetching care homes:", error);
        toast.error("Failed to load care homes");
        setCareHomes([]);
        setTotalResults(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareHomes();
  }, [filters, searchCareHomes]);

  const handleFilterChange = (newFilters: Partial<CareHomeQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalResults / (filters.limit || 12));

  return (
    <div className={styles.container}>
      <NavBar />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Search Results</h1>
          {query && (
            <p className={styles.searchQuery}>
              Results for &quot;{query}&quot; ({totalResults} care homes found)
            </p>
          )}
          {specializations && !query && (
            <p className={styles.searchQuery}>
              Results for specialization: &quot;{specializations}&quot; (
              {totalResults} care homes found)
            </p>
          )}
        </div>

        <div className={styles.content}>
          {/* Filters Sidebar */}
          <aside className={styles.filters}>
            <h3>Filters</h3>

            <div className={styles.filterSection}>
              <label>Location</label>
              <input
                type="text"
                placeholder="City or postcode"
                value={filters.city || ""}
                onChange={(e) => handleFilterChange({ city: e.target.value })}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterSection}>
              <label>Price Range (per week)</label>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange({
                      minPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className={styles.filterInput}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handleFilterChange({
                      maxPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className={styles.filterInput}
                />
              </div>
            </div>

            <div className={styles.filterSection}>
              <label>Minimum Rating</label>
              <select
                value={filters.minRating || ""}
                onChange={(e) =>
                  handleFilterChange({
                    minRating: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className={styles.filterSelect}
              >
                <option value="">Any rating</option>
                <option value="4">4+ stars</option>
                <option value="3">3+ stars</option>
                <option value="2">2+ stars</option>
              </select>
            </div>

            <div className={styles.filterSection}>
              <label>
                <input
                  type="checkbox"
                  checked={filters.hasAvailableBeds || false}
                  onChange={(e) =>
                    handleFilterChange({
                      hasAvailableBeds: e.target.checked ? true : undefined,
                    })
                  }
                  className={styles.filterCheckbox}
                />
                Available beds only
              </label>
            </div>

            <div className={styles.filterSection}>
              <label>
                <input
                  type="checkbox"
                  checked={filters.isVerified || false}
                  onChange={(e) =>
                    handleFilterChange({
                      isVerified: e.target.checked ? true : undefined,
                    })
                  }
                  className={styles.filterCheckbox}
                />
                Verified care homes only
              </label>
            </div>
          </aside>

          {/* Results Section */}
          <section className={styles.results}>
            {isLoading ? (
              <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading care homes...</p>
              </div>
            ) : careHomes.length === 0 ? (
              <div className={styles.noResults}>
                <h3>No care homes found</h3>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <>
                <div className={styles.resultsGrid}>
                  {careHomes.map((careHome) => (
                    <CareHomeCard key={careHome.id} careHome={careHome} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={styles.paginationButton}
                    >
                      Previous
                    </button>
                    <span className={styles.pageInfo}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={styles.paginationButton}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <NavBar />
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading search page...</p>
          </div>
          <Footer />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
