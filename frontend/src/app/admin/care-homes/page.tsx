"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AdminLayout from "@/components/layout/admin-layout";
import styles from "./care-homes.module.scss";

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
}

export default function CareHomesPage() {
  const [careHomes, setCareHomes] = useState<CareHome[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    fetchCareHomes();
  }, []);

  const fetchCareHomes = async () => {
    try {
      // TODO: Replace with actual API call
      const mockCareHomes: CareHome[] = [
        {
          id: "1",
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
        },
        {
          id: "2",
          name: "Golden Years Residence",
          addressLine1: "456 Golden Lane",
          city: "Manchester",
          region: "Greater Manchester",
          postcode: "M1 1AA",
          phoneNumber: "+44 161 123 4567",
          email: "contact@goldenyears.co.uk",
          status: "pending",
          cqcRating: "Requires Improvement",
          careTypes: ["Nursing", "Residential"],
          createdAt: "2024-01-14T09:15:00Z",
          isVerified: false,
        },
        {
          id: "3",
          name: "Comfort Care Center",
          addressLine1: "789 Comfort Street",
          city: "Birmingham",
          region: "West Midlands",
          postcode: "B1 1AA",
          phoneNumber: "+44 121 123 4567",
          email: "hello@comfortcare.co.uk",
          status: "active",
          cqcRating: "Outstanding",
          careTypes: ["Residential", "Nursing", "Dementia"],
          createdAt: "2024-01-13T08:00:00Z",
          isVerified: true,
        },
      ];

      setCareHomes(mockCareHomes);
    } catch {
      toast.error("Failed to load care homes");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCareHomes = careHomes.filter((careHome) => {
    const matchesSearch =
      careHome.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      careHome.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      careHome.postcode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || careHome.status === statusFilter;
    const matchesRegion =
      regionFilter === "all" || careHome.region === regionFilter;

    return matchesSearch && matchesStatus && matchesRegion;
  });

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
        <p>Loading care homes...</p>
      </div>
    );
  }

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

        <div className={styles.careHomesGrid}>
          {filteredCareHomes.map((careHome) => (
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
                      careHome.status
                    )}`}
                  >
                    {careHome.status}
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
                    <span>{careHome.phoneNumber}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.label}>✉️ Email:</span>
                    <span>{careHome.email}</span>
                  </div>
                </div>

                <div className={styles.details}>
                  <div className={styles.cqcRating}>
                    <span className={styles.label}>CQC Rating:</span>
                    <span
                      className={`${styles.rating} ${getCqcRatingColor(
                        careHome.cqcRating
                      )}`}
                    >
                      {careHome.cqcRating || "Not Rated"}
                    </span>
                  </div>

                  <div className={styles.careTypes}>
                    <span className={styles.label}>Care Types:</span>
                    <div className={styles.typeTags}>
                      {careHome.careTypes.map((type, index) => (
                        <span key={index} className={styles.typeTag}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCareHomes.length === 0 && (
          <div className={styles.emptyState}>
            <p>No care homes found matching your criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
