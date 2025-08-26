"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useHealthcareHomesActions,
  CareHome,
} from "@/actions-client/healthcare-homes";
import { toast } from "react-hot-toast";
import styles from "./styles.module.scss";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CareHome[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const { searchCareHomes } = useHealthcareHomesActions();

  // Debounce search
  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await searchCareHomes({
          search: searchTerm,
          limit: 10,
          sortBy: "name",
          sortOrder: "ASC",
        });

        if (!response.success) {
          toast.error("Failed to search care homes");
          setSearchResults([]);
        } else {
          setSearchResults(response.data?.data || []);
        }
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to search care homes");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [searchCareHomes]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setShowResults(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        handleResultClick(searchResults[selectedIndex]);
      } else if (query.trim()) {
        // Navigate to search results page with query
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    } else if (event.key === "Escape") {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  };

  const handleResultClick = (careHome: CareHome) => {
    setQuery(careHome.name);
    setShowResults(false);
    setSelectedIndex(-1);
    // Navigate to care home details page
    router.push(`/care-home/${careHome.id}`);
  };

  const handleSearchClick = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow for clicks
    setTimeout(() => {
      setShowResults(false);
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search for care homes, locations, or care types..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className={styles.searchInput}
      />
      <button
        className={styles.searchButton}
        onClick={handleSearchClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className={styles.loadingSpinner}></div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.searchIcon}
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.632 4.632a.75.75 0 11-1.06 1.06l-4.63-4.632A8.25 8.25 0 012.25 10.5z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Search Results Dropdown */}
      {showResults && (searchResults.length > 0 || isLoading) && (
        <div className={styles.searchResults}>
          {isLoading ? (
            <div className={styles.loadingItem}>
              <div className={styles.loadingSpinner}></div>
              <span>Searching...</span>
            </div>
          ) : (
            searchResults.map((careHome, index) => (
              <div
                key={careHome.id}
                className={`${styles.resultItem} ${
                  index === selectedIndex ? styles.selected : ""
                }`}
                onClick={() => handleResultClick(careHome)}
              >
                <div className={styles.resultContent}>
                  <h4 className={styles.careHomeName}>{careHome.name}</h4>
                  <p className={styles.careHomeLocation}>
                    {careHome.city}, {careHome.region}
                  </p>
                  <p className={styles.careHomeType}>
                    {careHome.careType?.name}
                  </p>
                </div>
                {careHome.weeklyPrice && (
                  <div className={styles.priceInfo}>
                    <span className={styles.price}>
                      £{careHome.weeklyPrice.toLocaleString()}/week
                    </span>
                  </div>
                )}
              </div>
            ))
          )}

          {searchResults.length > 0 && (
            <div className={styles.searchFooter}>
              <button
                className={styles.viewAllButton}
                onClick={() =>
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`)
                }
              >
                View all results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Debounce utility function
function debounce(
  func: (searchTerm: string) => void,
  wait: number
): (searchTerm: string) => void {
  let timeout: NodeJS.Timeout;
  return (searchTerm: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(searchTerm), wait);
  };
}
