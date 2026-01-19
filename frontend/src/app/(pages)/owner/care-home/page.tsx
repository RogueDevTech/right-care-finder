"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useUserActions } from "@/actions-client/user";
import { CareHome } from "@/actions-client/healthcare-homes";
import { LocationIcon, PhoneIcon } from "@/components/icon";
import Link from "next/link";
import styles from "../owner.module.scss";

export default function MyCareHomePage() {
  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { getMyCareHomes } = useUserActions();

  useEffect(() => {
    fetchCareHome();
  }, []);

  // Reset image index when care home changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [careHome?.id]);

  const goToNextImage = () => {
    if (careHome?.images && careHome.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % careHome.images.length);
    }
  };

  const goToPreviousImage = () => {
    if (careHome?.images && careHome.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? careHome.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index: number) => {
    if (careHome?.images && index >= 0 && index < careHome.images.length) {
      setCurrentImageIndex(index);
    }
  };

  // Ensure external page URLs (e.g., unsplash.com/photos/...) are converted to direct image URLs
  const resolveImageUrl = (url: string): string => {
    try {
      const parsed = new URL(url);
      // Handle Unsplash page URLs → convert to images.unsplash.com direct source
      if (
        (parsed.hostname === "unsplash.com" ||
          parsed.hostname === "www.unsplash.com") &&
        parsed.pathname.startsWith("/photos/")
      ) {
        const segments = parsed.pathname.split("/");
        const last = segments[segments.length - 1];
        // The last segment often ends with the photo id
        const id = last.split("-").pop() || last;
        return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const fetchCareHome = async () => {
    try {
      setIsLoading(true);
      const result = await getMyCareHomes();
      if (result.success && result.data) {
        const homes = result.data;
        if (homes.length > 0) {
          setCareHome(homes[0]);
        } else {
          setCareHome(null);
        }
      } else {
        toast.error(result.error || "Failed to load care home");
        setCareHome(null);
      }
    } catch (error) {
      console.error("Error fetching care home:", error);
      toast.error("Failed to load care home");
      setCareHome(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>My Care Home</h1>
          <p>Manage your care home listing and information</p>
        </div>
        {careHome && !isLoading && (
          <Link href="/owner/care-home/edit" className={styles.editButton}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            Edit
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your care home...</p>
        </div>
      ) : !careHome ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>🏠</div>
          <h3>No Care Home Assigned</h3>
          <p>
            You don&apos;t have a care home assigned to your account yet.
            Contact an administrator to get started.
          </p>
        </div>
      ) : (
        <div className={styles.careHomeDashboard}>
          <div className={styles.heroSection}>
            <div className={styles.heroImage}>
              {careHome.images && careHome.images.length > 0 ? (
                <>
                  <img
                    src={resolveImageUrl(
                      careHome.images[currentImageIndex].url
                    )}
                    alt={
                      careHome.images[currentImageIndex].alt || careHome.name
                    }
                    className={styles.heroImageImg}
                  />
                  {careHome.images.length > 1 && (
                    <>
                      {/* Previous Button */}
                      <button
                        className={styles.imageNavButton}
                        onClick={goToPreviousImage}
                        aria-label="Previous image"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                      </button>
                      {/* Next Button */}
                      <button
                        className={`${styles.imageNavButton} ${styles.nextButton}`}
                        onClick={goToNextImage}
                        aria-label="Next image"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                      </button>
                      {/* Image Indicators/Dots */}
                      <div className={styles.imageIndicators}>
                        {careHome.images.map((_, index) => (
                          <button
                            key={index}
                            className={`${styles.imageDot} ${
                              index === currentImageIndex ? styles.active : ""
                            }`}
                            onClick={() => goToImage(index)}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                      {/* Image Counter */}
                      <div className={styles.imageCounter}>
                        {currentImageIndex + 1} / {careHome.images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className={styles.placeholderImage}>
                  <span>No image available</span>
                </div>
              )}
              {careHome.isVerified && (
                <div className={styles.verifiedBadge}>✓ Verified</div>
              )}
              <div
                className={`${styles.statusBadge} ${
                  careHome.isActive ? styles.active : styles.inactive
                }`}
              >
                {careHome.isActive ? "Active" : "Inactive"}
              </div>
            </div>

            <div className={styles.heroContent}>
              <div className={styles.titleSection}>
                <h2 className={styles.careHomeName}>{careHome.name}</h2>
                <div className={styles.badges}>
                  {careHome.isFeatured && (
                    <div className={styles.featuredBadge}>⭐ Featured</div>
                  )}
                </div>
              </div>

              <div className={styles.locationSection}>
                <LocationIcon />
                <div>
                  <span className={styles.address}>
                    {careHome.addressLine1}
                    {careHome.addressLine2 && `, ${careHome.addressLine2}`}
                  </span>
                  <span className={styles.city}>
                    {careHome.city}, {careHome.region} {careHome.postcode}
                  </span>
                  <span className={styles.country}>{careHome.country}</span>
                </div>
              </div>

              <div className={styles.contactSection}>
                <PhoneIcon />
                <div>
                  <span className={styles.phone}>{careHome.phone}</span>
                  {careHome.email && (
                    <span className={styles.email}>{careHome.email}</span>
                  )}
                  {careHome.website && (
                    <Link
                      href={careHome.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.website}
                    >
                      {careHome.website}
                    </Link>
                  )}
                </div>
              </div>

              {careHome.averageRating && (
                <div className={styles.ratingSection}>
                  <div className={styles.ratingStars}>
                    {"★".repeat(Math.round(careHome.averageRating))}
                    {"☆".repeat(5 - Math.round(careHome.averageRating))}
                  </div>
                  <span className={styles.ratingText}>
                    {careHome.averageRating.toFixed(1)} (
                    {careHome.reviewCount || 0} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>Total Beds</h3>
                <p className={styles.statNumber}>{careHome.totalBeds || 0}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>Available Beds</h3>
                <p className={styles.statNumber}>
                  {careHome.availableBeds || 0}
                </p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>Rating</h3>
                <p className={styles.statNumber}>
                  {careHome.averageRating
                    ? careHome.averageRating.toFixed(1)
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>Reviews</h3>
                <p className={styles.statNumber}>{careHome.reviewCount || 0}</p>
              </div>
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoCard}>
              <h3>About</h3>
              {careHome.description && careHome.description.length > 0 ? (
                <div className={styles.description}>
                  {careHome.description.map((desc, idx) => (
                    <p key={idx}>{desc}</p>
                  ))}
                </div>
              ) : (
                <p className={styles.noDescription}>
                  No description provided yet.
                </p>
              )}
            </div>

            <div className={styles.infoCard}>
              <h3>Care Type</h3>
              {careHome.careType ? (
                <div className={styles.careType}>{careHome.careType.name}</div>
              ) : (
                <p className={styles.noInfo}>Not specified</p>
              )}
            </div>

            {careHome.specializations &&
              careHome.specializations.length > 0 && (
                <div className={styles.infoCard}>
                  <h3>Specializations</h3>
                  <div className={styles.specializations}>
                    {careHome.specializations.map((spec, idx) => (
                      <span key={idx} className={styles.specTag}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Pricing Section */}
          {(careHome.weeklyPrice || careHome.monthlyPrice) && (
            <div className={styles.pricingSection}>
              <h3>Pricing Information</h3>
              <div className={styles.pricingGrid}>
                {careHome.weeklyPrice && (
                  <div className={styles.pricingCard}>
                    <div className={styles.pricingIcon}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                      </svg>
                    </div>
                    <div className={styles.pricingInfo}>
                      <h4>Weekly Rate</h4>
                      <p className={styles.pricingAmount}>
                        £{careHome.weeklyPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {careHome.monthlyPrice && (
                  <div className={styles.pricingCard}>
                    <div className={styles.pricingIcon}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                      </svg>
                    </div>
                    <div className={styles.pricingInfo}>
                      <h4>Monthly Rate</h4>
                      <p className={styles.pricingAmount}>
                        £{careHome.monthlyPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Opening Hours Section */}
          {careHome.openingHours && (
            <div className={styles.openingHoursSection}>
              <h3>Opening Hours</h3>
              <div className={styles.hoursGrid}>
                {Object.entries(careHome.openingHours).map(([day, hours]) => (
                  <div key={day} className={styles.hoursRow}>
                    <span className={styles.dayLabel}>{day}</span>
                    <span className={styles.hoursValue}>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information Section */}
          {careHome.contactInfo && (
            <div className={styles.contactInfoSection}>
              <h3>Contact Information</h3>
              <div className={styles.contactGrid}>
                {careHome.contactInfo.manager && (
                  <div className={styles.contactCard}>
                    <div className={styles.contactIcon}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className={styles.contactDetails}>
                      <h4>Manager</h4>
                      <p>{careHome.contactInfo.manager}</p>
                    </div>
                  </div>
                )}
                {careHome.contactInfo.emergency && (
                  <div className={styles.contactCard}>
                    <div className={styles.contactIcon}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                      </svg>
                    </div>
                    <div className={styles.contactDetails}>
                      <h4>Emergency Contact</h4>
                      <p>{careHome.contactInfo.emergency}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Facilities Section */}
          {careHome.facilities && careHome.facilities.length > 0 && (
            <div className={styles.facilitiesSection}>
              <h3>Facilities & Amenities</h3>
              <div className={styles.facilitiesGrid}>
                {careHome.facilities.map((facility) => (
                  <div key={facility.id} className={styles.facilityCard}>
                    <div className={styles.facilityIcon}>
                      <span>{facility.icon || "🏥"}</span>
                    </div>
                    <div className={styles.facilityInfo}>
                      <h4>{facility.name}</h4>
                      {facility.description && <p>{facility.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Gallery Section */}
          {careHome.images && careHome.images.length > 1 && (
            <div className={styles.imageGallerySection}>
              <h3>Image Gallery</h3>
              <div className={styles.imageGallery}>
                {careHome.images.map((image) => (
                  <div key={image.id} className={styles.galleryImage}>
                    <img
                      src={resolveImageUrl(image.url)}
                      alt={image.alt || careHome.name}
                      width={400}
                      height={300}
                      className={styles.galleryImageImg}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
