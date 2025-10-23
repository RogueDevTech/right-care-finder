"use client";
import CareerHomeCard from "./components/career-home-card";
import styles from "./styles.module.scss";
import Input from "./components/input";
import DropDown from "./components/dropdowns";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function CareerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState<{
    careTypeId?: string;
    region?: string;
    specializations?: string[];
    search?: string;
  }>({});

  // Read query parameters and set initial filters
  useEffect(() => {
    const careTypeId = searchParams.get("careTypeId");
    const region = searchParams.get("region");
    const specializations = searchParams.get("specializations");
    const search = searchParams.get("search");

    const initialFilters: {
      careTypeId?: string;
      region?: string;
      specializations?: string[];
      search?: string;
    } = {};

    if (careTypeId) {
      initialFilters.careTypeId = careTypeId;
    }
    if (region) {
      initialFilters.region = decodeURIComponent(region);
    }
    if (specializations) {
      initialFilters.specializations = [decodeURIComponent(specializations)];
    }
    if (search) {
      initialFilters.search = decodeURIComponent(search);
    }
    setFilters(initialFilters);
  }, [searchParams]);

  const handleFilterChange = (newFilters: {
    careTypeId?: string;
    region?: string;
    specializations?: string[];
    search?: string;
  }) => {
    // Check if filters have actually changed to prevent infinite loops
    const hasChanged =
      filters.careTypeId !== newFilters.careTypeId ||
      filters.region !== newFilters.region ||
      JSON.stringify(filters.specializations) !==
        JSON.stringify(newFilters.specializations) ||
      filters.search !== newFilters.search;

    if (!hasChanged) {
      return;
    }

    setFilters(newFilters);

    // Update URL with new query parameters
    const params = new URLSearchParams();

    if (newFilters.careTypeId) {
      params.set("careTypeId", newFilters.careTypeId.toString());
    }
    if (newFilters.region) {
      params.set("region", encodeURIComponent(newFilters.region));
    }
    if (newFilters.specializations && newFilters.specializations.length > 0) {
      params.set(
        "specializations",
        encodeURIComponent(newFilters.specializations[0])
      );
    }
    if (newFilters.search) {
      params.set("search", encodeURIComponent(newFilters.search));
    }

    // Create new URL with updated parameters
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newUrl, { scroll: false });
  };

  const handleSearchChange = (search: string) => {
    // Only update if the search value is actually different
    if (filters.search !== search) {
      handleFilterChange({
        ...filters,
        search: search || undefined,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <Input onSearchChange={handleSearchChange} disableDropdown={true} />
        <div className={styles.dropdownWrapper}>
          <DropDown
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </div>
      </div>

      <div className={styles.cardWrapper}>
        <CareerHomeCard key={JSON.stringify(filters)} filters={filters} />
      </div>
    </div>
  );
}
