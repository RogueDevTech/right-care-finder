"use client";
import styles from "./styles.module.scss";
import { useState, useEffect, useRef } from "react";
import {
  useHealthcareHomesActions,
  CareType,
  Specialization,
  RegionStatistics,
} from "@/actions-client/healthcare-homes";

interface DropDownProps {
  onFilterChange?: (filters: {
    careTypeId?: string;
    region?: string;
    specialization?: string;
  }) => void;
  initialFilters?: {
    careTypeId?: string;
    region?: string;
    specialization?: string;
  };
}

const DropDown: React.FC<DropDownProps> = ({
  onFilterChange,
  initialFilters,
}) => {
  const [region, setRegion] = useState("Region");
  const [careType, setCareType] = useState("Care Type");
  const [specialization, setSpecialization] = useState("Specialization");

  // Dropdown open states
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isCareTypeOpen, setIsCareTypeOpen] = useState(false);
  const [isSpecializationOpen, setIsSpecializationOpen] = useState(false);

  // Refs for click outside detection
  const regionRef = useRef<HTMLDivElement>(null);
  const careTypeRef = useRef<HTMLDivElement>(null);
  const specializationRef = useRef<HTMLDivElement>(null);

  // Dynamic data states
  const [careTypes, setCareTypes] = useState<CareType[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [regionStats, setRegionStats] = useState<RegionStatistics[]>([]);

  // Loading states
  const [isLoadingCareTypes, setIsLoadingCareTypes] = useState(true);
  const [isLoadingSpecializations, setIsLoadingSpecializations] =
    useState(true);
  const [isLoadingRegions, setIsLoadingRegions] = useState(true);

  const { getCareTypes, getSpecializations, getRegionStatistics } =
    useHealthcareHomesActions();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch care types
      try {
        setIsLoadingCareTypes(true);
        const careTypesResult = await getCareTypes();
        if (careTypesResult.success && careTypesResult.data) {
          setCareTypes(careTypesResult.data);
        }
      } catch (error) {
        console.error("Error fetching care types:", error);
      } finally {
        setIsLoadingCareTypes(false);
      }

      // Fetch specializations
      try {
        setIsLoadingSpecializations(true);
        const specializationsResult = await getSpecializations();
        if (specializationsResult.success && specializationsResult.data) {
          setSpecializations(specializationsResult.data);
        }
      } catch (error) {
        console.error("Error fetching specializations:", error);
      } finally {
        setIsLoadingSpecializations(false);
      }

      // Fetch region statistics
      try {
        setIsLoadingRegions(true);
        const regionsResult = await getRegionStatistics();
        if (regionsResult.success && regionsResult.data) {
          setRegionStats(regionsResult.data);
        }
      } catch (error) {
        console.error("Error fetching region statistics:", error);
      } finally {
        setIsLoadingRegions(false);
      }
    };

    fetchData();
  }, []);

  // Set initial values when data is loaded and initialFilters are provided
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.region && regionStats.length > 0) {
        const foundRegion = regionStats.find(
          (r) => r.region === initialFilters.region
        );
        if (foundRegion) {
          setRegion(initialFilters.region);
        }
      }

      if (initialFilters.careTypeId && careTypes.length > 0) {
        const foundCareType = careTypes.find(
          (ct) => ct.id === initialFilters.careTypeId
        );
        if (foundCareType) {
          setCareType(foundCareType.name);
        }
      }

      if (initialFilters.specialization && specializations.length > 0) {
        const foundSpecialization = specializations.find(
          (s) => s.name === initialFilters.specialization
        );
        if (foundSpecialization) {
          setSpecialization(initialFilters.specialization);
        }
      }
    }
  }, [initialFilters, regionStats, careTypes, specializations]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        regionRef.current &&
        !regionRef.current.contains(event.target as Node)
      ) {
        setIsRegionOpen(false);
      }
      if (
        careTypeRef.current &&
        !careTypeRef.current.contains(event.target as Node)
      ) {
        setIsCareTypeOpen(false);
      }
      if (
        specializationRef.current &&
        !specializationRef.current.contains(event.target as Node)
      ) {
        setIsSpecializationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRegionChange = (selectedRegion: string) => {
    setRegion(selectedRegion);
    setIsRegionOpen(false);
    onFilterChange?.({
      ...initialFilters,
      region: selectedRegion === "Region" ? undefined : selectedRegion,
    });
  };

  const handleCareTypeChange = (
    selectedCareType: string,
    careTypeId?: string
  ) => {
    setCareType(selectedCareType);
    setIsCareTypeOpen(false);
    onFilterChange?.({
      ...initialFilters,
      careTypeId: selectedCareType === "Care Type" ? undefined : careTypeId,
    });
  };

  const handleSpecializationChange = (selectedSpecialization: string) => {
    setSpecialization(selectedSpecialization);
    setIsSpecializationOpen(false);
    onFilterChange?.({
      ...initialFilters,
      specialization:
        selectedSpecialization === "Specialization"
          ? undefined
          : selectedSpecialization,
    });
  };

  const handleClearAll = () => {
    setRegion("Region");
    setCareType("Care Type");
    setSpecialization("Specialization");
    onFilterChange?.({});
  };

  const handleClearRegion = () => {
    setRegion("Region");
    onFilterChange?.({
      ...initialFilters,
      region: undefined,
    });
  };

  const handleClearCareType = () => {
    setCareType("Care Type");
    onFilterChange?.({
      ...initialFilters,
      careTypeId: undefined,
    });
  };

  const handleClearSpecialization = () => {
    setSpecialization("Specialization");
    onFilterChange?.({
      ...initialFilters,
      specialization: undefined,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.sortCard}>
        <div className={styles.dropdown} ref={regionRef}>
          <div className={styles.dropdownHeader}>
            <button
              className={styles.dropdownBtn}
              onClick={() => setIsRegionOpen(!isRegionOpen)}
            >
              {region}
            </button>
            {region !== "Region" && (
              <button
                className={styles.clearBtn}
                onClick={handleClearRegion}
                title="Clear region filter"
              >
                ×
              </button>
            )}
          </div>
          {isRegionOpen && (
            <div className={styles.dropdownContent}>
              {isLoadingRegions ? (
                <div className={styles.dropdownItem} data-loading="true">
                  Loading...
                </div>
              ) : (
                <>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => handleRegionChange("Region")}
                    data-selected={region === "Region"}
                  >
                    All Regions
                  </div>
                  {regionStats.map((regionStat) => (
                    <div
                      key={regionStat.region}
                      className={styles.dropdownItem}
                      onClick={() => handleRegionChange(regionStat.region)}
                      data-selected={region === regionStat.region}
                    >
                      <span>{regionStat.region}</span>
                      <span className={styles.count}>{regionStat.count}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.sortCard}>
        <div className={styles.dropdown} ref={careTypeRef}>
          <div className={styles.dropdownHeader}>
            <button
              className={styles.dropdownBtn}
              onClick={() => setIsCareTypeOpen(!isCareTypeOpen)}
            >
              {careType}
            </button>
            {careType !== "Care Type" && (
              <button
                className={styles.clearBtn}
                onClick={handleClearCareType}
                title="Clear care type filter"
              >
                ×
              </button>
            )}
          </div>
          {isCareTypeOpen && (
            <div className={styles.dropdownContent}>
              {isLoadingCareTypes ? (
                <div className={styles.dropdownItem} data-loading="true">
                  Loading...
                </div>
              ) : (
                <>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => handleCareTypeChange("Care Type")}
                    data-selected={careType === "Care Type"}
                  >
                    All Care Types
                  </div>
                  {careTypes.map((careTypeItem) => (
                    <div
                      key={careTypeItem.id}
                      className={styles.dropdownItem}
                      onClick={() =>
                        handleCareTypeChange(careTypeItem.name, careTypeItem.id)
                      }
                      data-selected={careType === careTypeItem.name}
                    >
                      {careTypeItem.name}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.sortCard}>
        <div className={styles.dropdown} ref={specializationRef}>
          <div className={styles.dropdownHeader}>
            <button
              className={styles.dropdownBtn}
              onClick={() => setIsSpecializationOpen(!isSpecializationOpen)}
            >
              {specialization}
            </button>
            {specialization !== "Specialization" && (
              <button
                className={styles.clearBtn}
                onClick={handleClearSpecialization}
                title="Clear specialization filter"
              >
                ×
              </button>
            )}
          </div>
          {isSpecializationOpen && (
            <div className={styles.dropdownContent}>
              {isLoadingSpecializations ? (
                <div className={styles.dropdownItem} data-loading="true">
                  Loading...
                </div>
              ) : (
                <>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => handleSpecializationChange("Specialization")}
                    data-selected={specialization === "Specialization"}
                  >
                    All Specializations
                  </div>
                  {specializations.map((spec) => (
                    <div
                      key={spec.id}
                      className={styles.dropdownItem}
                      onClick={() => handleSpecializationChange(spec.name)}
                      data-selected={specialization === spec.name}
                    >
                      {spec.name}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Clear All Button */}
        <button className={styles.clearAllBtn} onClick={handleClearAll}>
          Clear All
        </button>
      </div>
    </div>
  );
};
export default DropDown;
