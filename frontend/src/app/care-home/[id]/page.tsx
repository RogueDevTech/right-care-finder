"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useHealthcareHomesActions,
  CareHome,
} from "@/actions-client/healthcare-homes";
import { toast } from "react-hot-toast";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import styles from "./care-home-details.module.scss";

export default function CareHomeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getCareHomeById } = useHealthcareHomesActions();

  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const careHomeId = params.id as string;

  useEffect(() => {
    const fetchCareHome = async () => {
      if (!careHomeId) return;

      setIsLoading(true);
      try {
        const response = await getCareHomeById(careHomeId);

        if (!response.success) {
          toast.error("Failed to load care home details");
          router.push("/");
        } else {
          setCareHome(response.data || null);
        }
      } catch (error) {
        console.error("Error fetching care home:", error);
        toast.error("Failed to load care home details");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareHome();
  }, [careHomeId, router]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <NavBar />
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading care home details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!careHome) {
    return (
      <div className={styles.container}>
        <NavBar />
        <div className={styles.error}>
          <h2>Care Home Not Found</h2>
          <p>
            The care home you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/")}
            className={styles.backButton}
          >
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <NavBar />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.imageGallery}>
            {careHome.images && careHome.images.length > 0 ? (
              <>
                <div className={styles.mainImage}>
                  <img
                    src={careHome.images[activeImageIndex].url}
                    alt={
                      careHome.images[activeImageIndex].altText || careHome.name
                    }
                  />
                  {careHome.isVerified && (
                    <div className={styles.verifiedBadge}>Verified</div>
                  )}
                </div>
                {careHome.images.length > 1 && (
                  <div className={styles.thumbnailGrid}>
                    {careHome.images.map((image, index) => (
                      <button
                        key={image.id}
                        className={`${styles.thumbnail} ${
                          index === activeImageIndex ? styles.active : ""
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img
                          src={image.url}
                          alt={
                            image.altText ||
                            `${careHome.name} - Image ${index + 1}`
                          }
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noImage}>
                <span>No images available</span>
              </div>
            )}
          </div>

          <div className={styles.heroContent}>
            <div className={styles.header}>
              <h1>{careHome.name}</h1>
              <p className={styles.location}>
                {careHome.addressLine1}, {careHome.city}, {careHome.region}{" "}
                {careHome.postcode}
              </p>
              <p className={styles.careType}>{careHome.careType?.name}</p>
            </div>

            <div className={styles.quickInfo}>
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

              {careHome.weeklyPrice && (
                <div className={styles.price}>
                  <span className={styles.priceAmount}>
                    £{careHome.weeklyPrice.toLocaleString()}
                  </span>
                  <span className={styles.pricePeriod}>/week</span>
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

            <div className={styles.actions}>
              <button className={styles.primaryButton}>
                Contact Care Home
              </button>
              <button className={styles.secondaryButton}>Book a Visit</button>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className={styles.details}>
          <div className={styles.content}>
            <div className={styles.mainContent}>
              {/* Description */}
              <div className={styles.section}>
                <h2>About {careHome.name}</h2>
                <div className={styles.description}>
                  {careHome.description.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              {careHome.specializations &&
                careHome.specializations.length > 0 && (
                  <div className={styles.section}>
                    <h2>Specializations</h2>
                    <div className={styles.specializations}>
                      {careHome.specializations.map((spec, index) => (
                        <span key={index} className={styles.specialization}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Facilities */}
              {careHome.facilities && careHome.facilities.length > 0 && (
                <div className={styles.section}>
                  <h2>Facilities & Services</h2>
                  <div className={styles.facilities}>
                    {careHome.facilities.map((facility) => (
                      <div key={facility.id} className={styles.facility}>
                        <h4>{facility.name}</h4>
                        <p>{facility.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opening Hours */}
              <div className={styles.section}>
                <h2>Opening Hours</h2>
                <div className={styles.openingHours}>
                  {Object.entries(careHome.openingHours).map(([day, hours]) => (
                    <div key={day} className={styles.hoursRow}>
                      <span className={styles.day}>{day}</span>
                      <span className={styles.hours}>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              {careHome.reviews && careHome.reviews.length > 0 && (
                <div className={styles.section}>
                  <h2>Reviews</h2>
                  <div className={styles.reviews}>
                    {careHome.reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className={styles.review}>
                        <div className={styles.reviewHeader}>
                          <div className={styles.reviewerInfo}>
                            <span className={styles.reviewerName}>
                              {review.user.name}
                            </span>
                            <span className={styles.reviewDate}>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className={styles.reviewRating}>
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                        </div>
                        <p className={styles.reviewComment}>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.contactCard}>
                <h3>Contact Information</h3>

                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Phone:</span>
                  <a
                    href={`tel:${careHome.phone}`}
                    className={styles.contactValue}
                  >
                    {careHome.phone}
                  </a>
                </div>

                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Email:</span>
                  <a
                    href={`mailto:${careHome.email}`}
                    className={styles.contactValue}
                  >
                    {careHome.email}
                  </a>
                </div>

                {careHome.website && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>Website:</span>
                    <a
                      href={careHome.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactValue}
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {careHome.contactInfo.emergency && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>Emergency:</span>
                    <a
                      href={`tel:${careHome.contactInfo.emergency}`}
                      className={styles.contactValue}
                    >
                      {careHome.contactInfo.emergency}
                    </a>
                  </div>
                )}

                {careHome.contactInfo.manager && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>Manager:</span>
                    <span className={styles.contactValue}>
                      {careHome.contactInfo.manager}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.infoCard}>
                <h3>Care Home Information</h3>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Total Beds:</span>
                  <span className={styles.infoValue}>
                    {careHome.totalBeds || "Not specified"}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Available Beds:</span>
                  <span className={styles.infoValue}>
                    {careHome.availableBeds !== undefined
                      ? careHome.availableBeds
                      : "Not specified"}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Care Type:</span>
                  <span className={styles.infoValue}>
                    {careHome.careType?.name}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Status:</span>
                  <span className={styles.infoValue}>
                    {careHome.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
