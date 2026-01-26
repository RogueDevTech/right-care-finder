"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCounterStore } from "@/store/useStore";
import { LocationIcon, PhoneIcon } from "@/components/icon";
// import starRating from "@/../public/starRating.png";
import primaryCare from "@/../public/primaryCategory.png";
// import ownersSectionImage from "@/../public/ownersSectionImage.png";
import careProvided from "@/../public/careProvided.png";
import lengthOfStarting from "@/../public/lenghtOfStating.png";
import demantiaCare from "@/../public/demantiaCare.png";
import dementia from "@/../public/dementia.png";
// import rating from "@/../public/starRating.png";
import ReviewModal from "@/features/view-home-details/ratings-and-reviews/review-modal";
import { StarIcon } from "@/components/icon";
import {
  useHealthcareHomesActions,
  CareHome,
} from "@/actions-client/healthcare-homes";
import { toast } from "react-hot-toast";
import { errorToString } from "@/utils/error-to-string";
import styles from "./care-homes-details.module.scss";
import absoluteGradient from "@/../public/abstract-wave-gradient.jpg";
type ImageType = {
  id: number;
  src: string;
  alt: string;
};
type ReviewItem = {
  id?: string;
  rating: number;
  isAnonymous?: boolean;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    id?: string;
    name?: string;
  } | null;
  comment?: string;
  createdAt?: string;
};

// Removed static initialImages - now using dynamic images from API
import Image from "next/image";
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// Format UK phone number with +44 prefix for tel: links
function formatPhoneForDial(phone: string | undefined): string {
  if (!phone) return "";

  // Remove all spaces and special characters except + and digits
  let cleaned = phone.replace(/[^\d+]/g, "");

  // If it already starts with +44, return as is
  if (cleaned.startsWith("+44")) {
    return cleaned;
  }

  // If it starts with 44 (without +), add the +
  if (cleaned.startsWith("44")) {
    return `+${cleaned}`;
  }

  // If it starts with 0 (UK domestic format), replace 0 with +44
  if (cleaned.startsWith("0")) {
    return `+44${cleaned.substring(1)}`;
  }

  // Otherwise, assume it's a UK number and add +44
  return `+44${cleaned}`;
}
// import { careHomes } from "@/components/data";

export default function CareHomesDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { openReviewModal, setOpenReviewModal } = useCounterStore();
  const { getCareHomeById, getReviews } = useHealthcareHomesActions();

  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const [images, setImages] = useState<ImageType[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const reviewsSectionRef = useRef<HTMLDivElement>(null);

  // Resolve external page URLs (e.g., unsplash page links) to direct image sources
  const resolveImageUrl = (url: string): string => {
    try {
      const parsed = new URL(url);
      if (
        (parsed.hostname === "unsplash.com" ||
          parsed.hostname === "www.unsplash.com") &&
        parsed.pathname.startsWith("/photos/")
      ) {
        const segments = parsed.pathname.split("/");
        const last = segments[segments.length - 1];
        const id = last.split("-").pop() || last;
        return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const scrollToReviews = () => {
    if (reviewsSectionRef.current) {
      reviewsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const careHomeId = params.id as string;

  const fetchReviews = async () => {
    if (!careHomeId) return;

    setReviewsLoading(true);
    try {
      const response = await getReviews(careHomeId, {
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });

      if (response.success && response.data) {
        // Ensure we always set an array, even if response.data.data is undefined
        const reviewsArray = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setReviews(reviewsArray);
      } else {
        console.error("Failed to fetch reviews:", response.error);
        // Set empty array on error to prevent map errors
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Set empty array on error to prevent map errors
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviews();
  };

  useEffect(() => {
    const fetchCareHome = async () => {
      if (!careHomeId) return;

      setIsLoading(true);
      try {
        const response = await getCareHomeById(careHomeId);
        if (!response.success) {
          toast.error(
            `Failed to load care home details: ${errorToString(response.error, "Unknown error")}`,
          );
          // Don't redirect immediately, let user see the error
          setCareHome(null);
        } else {
          setCareHome(response.data || null);

          // Set images from care home data
          if (response.data?.images && response.data.images.length > 0) {
            const careHomeImages = response.data.images.map(
              (
                img: { id: string; url: string; alt?: string },
                index: number,
              ) => ({
                id: index + 1,
                src: img.url,
                alt: img.alt || `Care home image ${index + 1}`,
              }),
            );
            setImages(careHomeImages);
            setCurrentImageIndex(0);
          } else {
            // No images available - set empty array
            setImages([]);
          }
        }
      } catch (error) {
        console.error("Error fetching care home:", error);
        toast.error("Network error loading care home details");
        setCareHome(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareHome();
    fetchReviews();
  }, [careHomeId, router]);

  // Auto-advance slideshow
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrev = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const overallRating = useMemo(() => {
    const ch = careHome as unknown as {
      rating?: string | number;
      averageRating?: string | number;
    } | null;
    const rawRating = ch?.rating ?? ch?.averageRating ?? 0;
    const num =
      typeof rawRating === "string"
        ? parseFloat(rawRating)
        : Number(rawRating || 0);
    return Math.max(0, Math.min(5, num));
  }, [careHome]);

  if (isLoading) {
    return (
      <main>
        {/* Slideshow Skeleton */}
        <div className={styles.slideshow}>
          <div className={styles.slideshowViewport}>
            <div className={`${styles.skeleton} ${styles.image}`}></div>
          </div>
          <div className={styles.thumbnailsRow}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles.thumbBtn}>
                <div
                  className={`${styles.skeleton} ${styles.thumbnail}`}
                  style={{ height: "72px" }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className={styles.details}>
          <div className={styles.nameAndReview}>
            <div className={styles.nameSection}>
              <div
                className={`${styles.skeleton} ${styles.title}`}
                style={{ width: "60%" }}
              ></div>
              <div
                className={`${styles.skeleton} ${styles.subtitle}`}
                style={{ width: "80%" }}
              ></div>
            </div>
            <div className={styles.review}>
              <div
                className={`${styles.skeleton} ${styles.text}`}
                style={{ width: "100px" }}
              ></div>
              <div
                className={`${styles.skeleton} ${styles.text}`}
                style={{ width: "80px" }}
              ></div>
            </div>
          </div>
          <div className={styles.getInTouch}>
            <div className={styles.contactUs}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={`${styles.skeleton} ${styles.button}`}
                  style={{ width: "150px" }}
                ></div>
              ))}
            </div>
            <div className={styles.price}>
              <div
                className={`${styles.skeleton} ${styles.text}`}
                style={{ width: "120px" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Cares Provided Skeleton */}
        <div className={styles.CaresProvidedWrapper}>
          <div
            className={`${styles.skeleton} ${styles.title}`}
            style={{ width: "200px", marginBottom: "2rem" }}
          ></div>
          <div className={styles.serviceProvided}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={styles.careCard}>
                <div className={styles.image}>
                  <div
                    className={`${styles.skeleton} ${styles.image}`}
                    style={{
                      height: "80px",
                      width: "80px",
                      borderRadius: "8px",
                    }}
                  ></div>
                </div>
                <div className={styles.CareContent}>
                  <div
                    className={`${styles.skeleton} ${styles.title}`}
                    style={{ width: "80%", marginBottom: "1rem" }}
                  ></div>
                  <div>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${styles.skeleton} ${styles.line}`}
                        style={{ width: "90%", marginBottom: "0.5rem" }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities Skeleton */}
        <div className={styles.facilitiesContainer}>
          <div
            className={`${styles.skeleton} ${styles.title}`}
            style={{ width: "150px", marginBottom: "2rem" }}
          ></div>
          <div className={styles.facilitiesCardContainer}>
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className={styles.facilitiesCard}>
                <div className={styles.absoluteGradient}>
                  <div
                    className={`${styles.skeleton} ${styles.image}`}
                    style={{ height: "100%", width: "100%" }}
                  ></div>
                </div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <div
                      className={`${styles.skeleton} ${styles.text}`}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        marginBottom: "0.5rem",
                      }}
                    ></div>
                    <div
                      className={`${styles.skeleton} ${styles.line}`}
                      style={{ width: "80px" }}
                    ></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* About Care Home Skeleton */}
        <div className={styles.aboutCareHome}>
          <div className={styles.mobile}>
            <div
              className={`${styles.skeleton} ${styles.image}`}
              style={{ height: "300px" }}
            ></div>
          </div>
          <div className={styles.careHomeDetail}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles.info}>
                <div
                  className={`${styles.skeleton} ${styles.subtitle}`}
                  style={{ width: "120px", marginBottom: "0.5rem" }}
                ></div>
                <div
                  className={`${styles.skeleton} ${styles.line}`}
                  style={{ width: "80%" }}
                ></div>
              </div>
            ))}
          </div>
          <div className={styles.ownersSectionImage}>
            <div
              className={`${styles.skeleton} ${styles.image}`}
              style={{ height: "300px" }}
            ></div>
          </div>
        </div>

        {/* Reviews Skeleton */}
        <div className={styles.ratingsAndReviewWrapper}>
          <div className={styles.header}>
            <div
              className={`${styles.skeleton} ${styles.title}`}
              style={{ width: "250px" }}
            ></div>
            <div
              className={`${styles.skeleton} ${styles.button}`}
              style={{ width: "150px" }}
            ></div>
          </div>
          <div className={styles.reviewsSection}>
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className={styles.reviewCard}>
                <div className={styles.rating}>
                  <div
                    className={`${styles.skeleton} ${styles.text}`}
                    style={{ width: "100px", height: "20px" }}
                  ></div>
                </div>
                <div className={styles.reviewContent}>
                  <div className={styles.reviewer}>
                    <div
                      className={`${styles.skeleton} ${styles.subtitle}`}
                      style={{ width: "100px", marginBottom: "1rem" }}
                    ></div>
                    <div>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className={`${styles.skeleton} ${styles.line}`}
                          style={{
                            width: i === 3 ? "60%" : "100%",
                            marginBottom: "0.5rem",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.likes}>
                    <div
                      className={`${styles.skeleton} ${styles.text}`}
                      style={{ width: "150px" }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!careHome) {
    return (
      <div className={styles.error}>
        <h2>Care Home Not Found</h2>
        <p>
          The care home you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <button onClick={() => router.push("/")} className={styles.backButton}>
          Back to Home
        </button>
      </div>
    );
  }
  return (
    <main>
      <div className={styles.gallery}>
        {images.length === 0 ? (
          // No images - show placeholder
          <div className={styles.noImageContainer}>
            <div className={styles.noImagePlaceholder}>
              <span>No images available</span>
            </div>
          </div>
        ) : images.length === 1 ? (
          // Single image - full width
          <div className={styles.singleImageContainer}>
            <img
              src={resolveImageUrl(images[0].src)}
              alt={images[0].alt}
              className={styles.singleImage}
            />
          </div>
        ) : (
          <div className={styles.slideshow}>
            <div className={styles.slideshowViewport}>
              <button
                className={styles.navButton}
                onClick={goToPrev}
                aria-label="Previous image"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <img
                src={resolveImageUrl(images[currentImageIndex].src)}
                alt={images[currentImageIndex].alt}
                className={styles.mainImage}
              />
              <button
                className={`${styles.navButton} ${styles.next}`}
                onClick={goToNext}
                aria-label="Next image"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6 8.59 7.41 13.17 12 8.59 16.59 10 18l6-6z" />
                </svg>
              </button>
              <div className={styles.indicators}>
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    className={`${styles.dot} ${
                      idx === currentImageIndex ? styles.active : ""
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className={styles.thumbnailsRow}>
              {images.map((img, index) => (
                <button
                  key={img.id}
                  className={`${styles.thumbBtn} ${
                    index === currentImageIndex ? styles.selected : ""
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={resolveImageUrl(img.src)}
                    alt={img.alt}
                    className={styles.thumbImage}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={styles.details}>
        <div className={styles.nameAndReview}>
          <div className={styles.nameSection}>
            <h3>{careHome.name}</h3>
            <p>
              <span>
                <LocationIcon />
              </span>
              {careHome.addressLine1}
            </p>
          </div>
          <div className={styles.review}>
            <div className={styles.starsInline}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(overallRating)
                      ? styles.starFilledInline
                      : styles.starEmptyInline
                  }
                >
                  ★
                </span>
              ))}
              <span className={styles.ratingInlineNumber}>
                {overallRating.toFixed(1)}
              </span>
            </div>
            <p
              onClick={scrollToReviews}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {careHome.reviewCount} reviews
            </p>
          </div>
        </div>
        <div className={styles.getInTouch}>
          <div className={styles.contactUs}>
            <a href={`tel:${formatPhoneForDial(careHome.phone)}`}>
              <span>
                <PhoneIcon />
                <span>{careHome.phone}</span>
              </span>
            </a>
            <a href={`mailto:${careHome.email || ""}`}>
              <span>
                <PhoneIcon />
                <span>Send an email</span>
              </span>
            </a>
            <a
              href={`mailto:${careHome.email || ""}?subject=Request a Tour - ${
                careHome.name
              }`}
            >
              <span>
                <PhoneIcon />
                <span>Request a tour</span>
              </span>
            </a>
            <a
              href={`mailto:${careHome.email || ""}?subject=General Enquiry - ${
                careHome.name
              }`}
            >
              <span>
                <PhoneIcon />
                <span>Make an enquiry</span>
              </span>
            </a>
          </div>
          <div className={styles.price}>
            £{careHome.weeklyPrice?.toString().split(".")[0]}/Week
          </div>
        </div>
      </div>
      <div className={styles.CaresProvidedWrapper}>
        <h2>Cares Provided</h2>
        <div className={styles.serviceProvided}>
          <div className={styles.careCard}>
            <div className={styles.image}>
              <Image src={primaryCare} alt="primary care" />
            </div>
            <div className={styles.CareContent}>
              <h3 className={styles.h3}>
                <span>
                  <StarIcon />
                </span>
                Primary care categories
              </h3>
              <ul>
                <li>Older person care</li>
                <li>Dementia</li>
                <li>mental health condition</li>
                <li>Visual / hearing impairment</li>
                <li>Younger adults</li>
              </ul>
            </div>
          </div>
          <div className={styles.careCard}>
            <div className={styles.image}>
              <Image src={careProvided} alt="primary care" />
            </div>
            <div className={styles.CareContent}>
              <h3 className={styles.h3}>
                <span>
                  <StarIcon />
                </span>
                Care types provided
              </h3>
              <ul>
                {careHome.careType && (
                  <li>
                    {careHome.careType.icon && `${careHome.careType.icon} `}
                    {careHome.careType.name}
                  </li>
                )}
                {careHome.specializations &&
                  careHome.specializations.length > 0 &&
                  careHome.specializations.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                {careHome.totalBeds && (
                  <li>For a maximum of {careHome.totalBeds} service users</li>
                )}
              </ul>
            </div>
          </div>
          <div className={styles.careCard}>
            <div className={styles.image}>
              <Image src={lengthOfStarting} alt="primary care" />
            </div>
            <div className={styles.CareContent}>
              <h3 className={styles.h3}>
                <span>
                  <StarIcon />
                </span>
                Length of staying
              </h3>
              <ul>
                <li>Permanent</li>
                <li>Respite care</li>
              </ul>
            </div>
          </div>
          <div className={styles.careCard}>
            <div className={styles.image}>
              <Image src={demantiaCare} alt="primary care" />
            </div>
            <div className={styles.CareContent}>
              <h3 className={styles.h3}>
                <span>
                  <StarIcon />
                </span>
                Dementia care types
              </h3>
              <ul>
                <li>Mild dementia</li>
                <li>Moderate dementia</li>
                <li>Advanced / complex dememtia</li>
                <li>Visual / hearing impairment</li>
                <li>Younger adults</li>
              </ul>
            </div>
          </div>
          <div className={styles.careCard}>
            <div className={styles.image}>
              <Image src={dementia} alt="primary care" />
            </div>
            <div className={styles.CareContent}>
              <h3 className={styles.h3}>
                <span>
                  <StarIcon />
                </span>
                Dementia care types
              </h3>
              <ul>
                <li>Mild dementia</li>
                <li>Moderate dementia</li>
                <li>Advanced / complex dememtia</li>
                <li>Visual / hearing impairment</li>
                <li>Younger adults</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.facilitiesContainer}>
        <h3>Facilities</h3>
        <div className={styles.facilitiesCardContainer}>
          {careHome?.facilities &&
            chunkArray(careHome.facilities, 4).map((chunk, index) => (
              <div key={index} className={styles.facilitiesCard}>
                <div className={styles.absoluteGradient}>
                  <Image src={absoluteGradient} alt="absolute gradient" />
                </div>
                {chunk.map((facility) => (
                  <div key={facility.id}>
                    <span>{facility.icon}</span>
                    <p>{facility.name}</p>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>

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
      {/* <div className={styles.aboutCareHome}>
        <div className={styles.mobile}>
          <Image src={ownersSectionImage} alt="owners section image" />
        </div>
        <div className={styles.careHomeDetail}>
          <div className={styles.info}>
            <h5>Owner</h5>
            <p>MOP Healthcare Ltd</p>
          </div>
          <div className={styles.info}>
            <h5>Person in charge</h5>
            <p>Dania Meadows</p>
          </div>
          <div className={styles.info}>
            <h5>Admission criteria</h5>
            <p>Resident aged 45 years and over</p>
          </div>
          <div className={styles.info}>
            <h5>Care home building</h5>
            <div className="">
              <p>
                year: <span>2016</span>
              </p>
              <p>
                Number of floors:<span>2</span>
              </p>
              <p>
                Last refurbishment: <span>2014</span>
              </p>
            </div>
          </div>
          <div className={styles.info}>
            <h5>Visiting</h5>
            <p>No restrictions to visiting hours</p>
          </div>
          <div className="">
            <h5>Parking</h5>
            <p>Free parking</p>
          </div>
          <div className="">
            <h5>Room info</h5>
            <div className="">
              <p>
                single room <span>(80)</span>
              </p>
              <p>
                Double room:<span>40</span>
              </p>
              <p>
                Last refurbishment: <span>2014</span>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.ownersSectionImage}>
          <Image src={ownersSectionImage} alt="owners section image" />
        </div>
      </div> */}
      <div className={styles.ratingsAndReviewWrapper} ref={reviewsSectionRef}>
        <div className={styles.headerTitle}>
          <h2>Rating and reviews</h2>
        </div>

        <div className={styles.reviewsSection}>
          {reviewsLoading ? (
            <div className={styles.loadingReviews}>
              <p>Loading reviews...</p>
            </div>
          ) : !Array.isArray(reviews) || reviews.length === 0 ? (
            <div className={styles.noReviews}>
              <p>No reviews yet. Be the first to leave a review!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className={styles.reviewRow}>
                <div className={styles.reviewHeader}>
                  <p className={styles.reviewerName}>
                    {review.isAnonymous
                      ? "Anonymous"
                      : `${review.user?.firstName || ""} ${
                          review.user?.lastName || ""
                        }`.trim() ||
                        (review.user?.email
                          ? review.user.email.split("@")[0]
                          : "User")}
                  </p>
                  <p className={styles.reviewTime}>
                    {new Date(
                      review.createdAt || new Date().toISOString(),
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className={styles.reviewStarsRow}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className={
                        index < review.rating
                          ? styles.starFilled
                          : styles.starEmpty
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className={styles.reviewText}>{review.comment}</p>
              </div>
            ))
          )}
        </div>

        <div className={styles.addReviewSection}>
          <button
            onClick={setOpenReviewModal}
            className={styles.addReviewButton}
          >
            Leave a review
          </button>
        </div>

        {openReviewModal && (
          <div className={styles.reviewModal} onClick={setOpenReviewModal}>
            <ReviewModal
              onClose={setOpenReviewModal}
              careHomeId={careHomeId}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        )}
      </div>
    </main>
  );
}
