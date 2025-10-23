"use client";

import Link from "next/link";
import { LocationIcon, PhoneIcon } from "@/components/icon";
import styles from "./care-home-card.module.scss";
import { CareHome } from "@/actions-client/healthcare-homes";

interface CareHomeCardProps {
  careHome: CareHome;
  className?: string;
}

const CareHomeCard: React.FC<CareHomeCardProps> = ({ careHome, className }) => {
  return (
    <Link
      href={`/care-homes/${careHome.id}`}
      className={`${styles.cardLink} ${className || ""}`}
    >
      <div className={styles.careHomeCard}>
        <div className={styles.cardContainer}>
          <div className={styles.cardImage}>
            {careHome.images && careHome.images.length > 0 ? (
              <img
                src={careHome.images[0].url}
                alt={careHome.images[0].alt || careHome.name}
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
          </div>

          <div className={styles.cardFooter}>
            <button className={styles.viewButton}>View Home</button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CareHomeCard;
