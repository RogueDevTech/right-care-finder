"use client";

import { useState, useEffect } from "react";
import { LocationIcon, PhoneIcon } from "@/components/icon";
import styles from "./styles.module.scss";
import {
  useHealthcareHomesActions,
  CareHome,
} from "@/actions-client/healthcare-homes";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

const CareerHomeCard: React.FC = () => {
  const [careHomes, setCareHomes] = useState<CareHome[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getHomeCreListings } = useHealthcareHomesActions();

  useEffect(() => {
    const fetchCareHomes = async () => {
      try {
        setIsLoading(true);
        const response = await getHomeCreListings({
          limit: 20,
          sortBy: "createdAt",
          sortOrder: "DESC",
        });

        if (response.success && response.data) {
          setCareHomes(response.data.data);
        } else {
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
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading care homes...</p>
      </div>
    );
  }

  if (careHomes.length === 0) {
    return (
      <div className={styles.noResults}>
        <h3>No care homes found</h3>
        <p>Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <>
      {careHomes.map((careHome) => (
        <div className={styles.careHomeCard} key={careHome.id}>
          <div className={styles.cardImage}>
            {careHome.images && careHome.images.length > 0 ? (
              <Image
                src={careHome.images[0].url}
                alt={careHome.images[0].altText || careHome.name}
                width={400}
                height={300}
              />
            ) : (
              <div className={styles.placeholderImage}>
                <span>No image available</span>
              </div>
            )}
            <div className={styles.phoneTag}>
              <PhoneIcon />
              {careHome.phone}
            </div>
            {careHome.isVerified && (
              <div className={styles.verifiedBadge}>Verified</div>
            )}
          </div>

          <div className={styles.cardContent}>
            <div className={styles.header}>
              <h2 className={styles.homeName}>{careHome.name}</h2>
              <div className={styles.price}>
                {careHome.weeklyPrice
                  ? `£${careHome.weeklyPrice.toLocaleString()}/week`
                  : "Price on request"}
              </div>
            </div>

            <div className={styles.location}>
              <LocationIcon />
              {careHome.city}, {careHome.region}
            </div>

            <p className={styles.description}>
              {careHome.description && careHome.description.length > 0
                ? careHome.description[0]
                : "A modern care home offering comprehensive care services in a warm, family-like environment."}
            </p>

            {careHome.careType && (
              <p className={styles.tagline}>{careHome.careType.name}</p>
            )}

            {careHome.averageRating && (
              <div className={styles.rating}>
                <span className={styles.stars}>
                  {"★".repeat(Math.round(careHome.averageRating))}
                  {"☆".repeat(5 - Math.round(careHome.averageRating))}
                </span>
                <span className={styles.ratingText}>
                  {careHome.averageRating.toFixed(1)} ({careHome.totalReviews}{" "}
                  reviews)
                </span>
              </div>
            )}

            {careHome.availableBeds !== undefined && (
              <div className={styles.beds}>
                <span className={styles.bedsAvailable}>
                  {careHome.availableBeds} beds available
                </span>
              </div>
            )}

            <Link href={`/care-home/${careHome.id}`}>
              <button className={styles.viewButton}>View home</button>
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default CareerHomeCard;
