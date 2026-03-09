"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCounterStore } from "@/store/useStore";
import {
  AdultFirstAidIcon,
  CaringHandIcon,
  LengthStayIcon,
  LocationIcon,
  PhoneIcon,
} from "@/components/icon";
import SectionHeader from "@/components/ui/section-header";
import HorizontalScroller from "@/components/ui/horizontal-scroller";
import ServiceCard from "@/components/ui/service-card";
// import starRating from "@/../public/starRating.png";
// import primaryCare from "@/../public/primaryCategory.png";
// import ownersSectionImage from "@/../public/ownersSectionImage.png";
// import careProvided from "@/../public/careProvided.png";
// import lengthOfStarting from "@/../public/lenghtOfStating.png";
// import demantiaCare from "@/../public/demantiaCare.png";
// import dementia from "@/../public/dementia.png";
// import rating from "@/../public/starRating.png";
import ReviewModal from "@/features/view-home-details/ratings-and-reviews/review-modal";
// import { StarIcon } from "@/components/icon";
import {
  useHealthcareHomesActions,
  CareHome,
} from "@/actions-client/healthcare-homes";
import { toast } from "react-hot-toast";
// import Image from "next/image";
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
  const cleaned = phone.replace(/[^\d+]/g, "");

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
  const [currentPage, setCurrentPage] = useState(0);

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

  useEffect(() => {
    setCurrentPage(Math.floor(currentImageIndex / 2));
  }, [currentImageIndex]);

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
        {/* Hero Gallery Skeleton (matches final layout) */}
        <div className={styles.heroGallery}>
          {/* Mobile slider skeleton */}
          <div className={styles.mobileSlider}>
            <div className={styles.sliderTrack}>
              <div className={styles.slide}>
                <div className={`${styles.skeleton} ${styles.image}`}></div>
              </div>
            </div>
          </div>

          {/* Desktop skeleton */}
          <div className={styles.desktopGallery}>
            <div className={styles.heroMain}>
              <div className={`${styles.skeleton} ${styles.image}`}></div>
            </div>
            <div className={styles.heroSide}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.heroThumb}>
                  <div
                    className={`${styles.skeleton} ${styles.thumbnail}`}
                  ></div>
                </div>
              ))}
            </div>
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

        {/* Care Provide New Wrapper Skeleton */}
        <div className={styles.careProvideNewWrapper}>
          <div>
            {/* First Section Header Skeleton */}
            <div className={styles.sectionHeaderSkeleton}>
              <div
                className={`${styles.skeleton} ${styles.title}`}
                style={{ width: "200px" }}
              ></div>
              <div
                className={`${styles.skeleton} ${styles.subtitle}`}
                style={{ width: "150px" }}
              ></div>
            </div>

            {/* First Horizontal Scroller Skeleton */}
            <div className={styles.horizontalScrollerSkeleton}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={styles.serviceCardSkeleton}>
                  <div
                    className={`${styles.skeleton} ${styles.cardImage}`}
                  ></div>
                  <div
                    className={`${styles.skeleton} ${styles.cardTitle}`}
                    style={{ width: "80%" }}
                  ></div>
                  <div
                    className={`${styles.skeleton} ${styles.cardDescription}`}
                    style={{ width: "90%" }}
                  ></div>
                  <div className={styles.cardPointsSkeleton}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${styles.skeleton} ${styles.cardPoint}`}
                        style={{ width: "70%" }}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Second Section Header Skeleton */}
            <div className={styles.sectionHeaderSkeleton}>
              <div
                className={`${styles.skeleton} ${styles.subtitle}`}
                style={{ width: "180px" }}
              ></div>
            </div>

            {/* Second Horizontal Scroller Skeleton */}
            <div className={styles.horizontalScrollerSkeleton}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`second-${index}`}
                  className={styles.serviceCardSkeleton}
                >
                  <div
                    className={`${styles.skeleton} ${styles.cardImage}`}
                  ></div>
                  <div
                    className={`${styles.skeleton} ${styles.cardTitle}`}
                    style={{ width: "70%" }}
                  ></div>
                  <div
                    className={`${styles.skeleton} ${styles.cardDescription}`}
                    style={{ width: "85%" }}
                  ></div>
                  <div className={styles.cardPointsSkeleton}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${styles.skeleton} ${styles.cardPoint}`}
                        style={{ width: "60%" }}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Length Of Stay Wrapper Skeleton */}
        <div className={styles.lengthOfStayWrapper}>
          <div className={styles.header}>
            <div
              className={`${styles.skeleton} ${styles.title}`}
              style={{ width: "200px", margin: "0 auto" }}
            ></div>
          </div>

          <div className={styles.content}>
            {/* LEFT - This will appear second on mobile */}
            <div className={styles.left}>
              <div className={styles.card}>
                <div
                  className={`${styles.skeleton} ${styles.subtitle}`}
                  style={{ width: "150px", marginBottom: "1rem" }}
                ></div>
                <div
                  className={`${styles.skeleton} ${styles.line}`}
                  style={{ width: "100%" }}
                ></div>
                <div
                  className={`${styles.skeleton} ${styles.line}`}
                  style={{ width: "95%" }}
                ></div>
                <div
                  className={`${styles.skeleton} ${styles.line}`}
                  style={{ width: "90%" }}
                ></div>
              </div>

              <div className={styles.card}>
                <div
                  className={`${styles.skeleton} ${styles.subtitle}`}
                  style={{ width: "120px", marginBottom: "1rem" }}
                ></div>
                <div
                  className={`${styles.skeleton} ${styles.line}`}
                  style={{ width: "100%" }}
                ></div>
                <div
                  className={`${styles.skeleton} ${styles.line}`}
                  style={{ width: "92%" }}
                ></div>
                <div
                  className={`${styles.skeleton} ${styles.line}`}
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>

            {/* RIGHT IMAGE - This will appear first on mobile due to column-reverse */}
            <div className={styles.imageWrapper}>
              <div
                className={`${styles.skeleton} ${styles.image}`}
                style={{ height: "100%", width: "100%" }}
              ></div>
            </div>
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
      <div className={styles.heroGallery}>
        {images.length === 0 && (
          <div className={styles.noImageContainer}>
            <div className={styles.noImagePlaceholder}>
              <span>No images available</span>
            </div>
          </div>
        )}

        {images.length > 0 && (
          <>
            <div className={styles.mobileSlider}>
              {(() => {
                // Take up to 3 images
                const slides = images.slice(0, 3).map((img) => ({
                  img,
                  placeholder: false,
                }));

                return (
                  <div
                    className={styles.sliderTrack}
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                  >
                    {slides.map(({ img }, idx) => (
                      <div key={`slide-${img.id}`} className={styles.slide}>
                        <div className={styles.mobileImageContainer}>
                          <Image
                            src={resolveImageUrl(img.src)}
                            alt={img.alt || "Property image"}
                            fill
                            className={styles.heroImage}
                            sizes="100vw"
                            priority={idx === 0}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            {images.length > 1 && (
              <div className={styles.mobileIndicator}>
                {images.slice(0, 3).map((_, i) => (
                  <button
                    key={`ind-${i}`}
                    className={
                      i === currentImageIndex
                        ? styles.indicatorActive
                        : styles.indicatorDot
                    }
                    onClick={() => setCurrentImageIndex(i)}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* DESKTOP LAYOUT */}
        {images.length > 0 && (
          <div className={styles.desktopGallery}>
            <div className={styles.heroMain}>
              <Image
                src={resolveImageUrl(images[currentImageIndex].src)}
                alt={images[currentImageIndex].alt}
                fill
                className={styles.heroImage}
                priority
              />
            </div>

            {images.length > 1 && (
              <div className={styles.heroSide}>
                {(() => {
                  const target = 3;
                  const base = images
                    .map((img, idx) => ({ img, idx, placeholder: false }))
                    .filter(({ idx }) => idx !== currentImageIndex)
                    .slice(0, target);
                  const pad = Math.max(0, target - base.length);
                  const filler = images[currentImageIndex];
                  const fillers = Array.from({ length: pad }).map((_, i) => ({
                    img: filler ?? { id: i, src: "", alt: "" },
                    idx: currentImageIndex,
                    placeholder: true,
                  }));
                  const side = [...base, ...fillers];
                  return side.map(({ img, idx, placeholder }, i) => (
                    <button
                      key={`${img.id}-${i}`}
                      className={`${styles.heroThumb} ${
                        placeholder ? styles.placeholder : ""
                      }`}
                      onClick={() => !placeholder && handleThumbnailClick(idx)}
                    >
                      <Image
                        src={resolveImageUrl(img.src)}
                        alt={img.alt}
                        fill
                        className={styles.heroThumbImage}
                      />
                    </button>
                  ));
                })()}
              </div>
            )}
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
                <PhoneIcon className={styles.phoneIcon} />
                <span>Send an email</span>
              </span>
            </a>
            <a
              href={`mailto:${careHome.email || ""}?subject=Request a Tour - ${
                careHome.name
              }`}
            >
              <span>
                <PhoneIcon className={styles.phoneIcon} />
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
      {/* <div className={styles.CaresProvidedWrapper}>
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
      </div> */}
      <div className={styles.careProvideNewWrapper}>
        <div>
          <SectionHeader
            title="Cares provided"
            subtitle="Primary care categories"
            overlayVariant="pink"
            icon={
              <span>
                <CaringHandIcon />
              </span>
            }
          />

          {/* FIRST SCROLLER */}
          <HorizontalScroller>
            <ServiceCard
              image="/care-provided-one.webp"
              imageAlt="Older people care"
              title="Older People Care"
              description="Care and support for older adults who need help with daily activities due to age-related health conditions, reduced mobility, or frailty."
              points={[
                "Personal care and daily living support",
                "Emotional and wellbeing support",
                "Help with mobility and fall prevention",
                "Safe and supportive living environment",
                "Support with routines and daily tasks",
                "Social and recreational activities",
              ]}
            />

            <ServiceCard
              image="/care-provided-two.webp"
              imageAlt="Dementia care"
              title="People Living with Dementia"
              description="Specialist care for individuals at different stages of dementia who need a structured, safe, and understanding environment."
              points={[
                "Dementia-trained staff support",
                "Safe and secure living spaces",
                "Structured daily routines",
                "Emotional reassurance and companionship",
                "Memory and cognitive stimulation activities",
                "Support tailored to each stage of dementia",
                "Personal care and meal support",
              ]}
            />

            <ServiceCard
              image="/care-provided-elderly-three.webp"
              imageAlt="Dementia care"
              title="Older People Care"
              description="Care and support for older adults who need help with daily activities due to age-related health conditions, reduced mobility, or frailty."
              points={[
                "Memory care routines",
                "Cognitive engagement",
                "Safe and secure environment",
                "Behavioural support",
              ]}
            />

            <ServiceCard
              image="/care-provided-hearing-impairment-four.webp"
              // image="/care-provided-two.webp"
              imageAlt="hearing Impairment"
              title="Visual or hearing impairment"
              description="Support for individuals with reduced sight or hearing, with care adapted to help them live safely and independently."
              points={[
                "Memory care routines",
                "Cognitive engagement",
                "Safe and secure environment",
                "Behavioural support",
              ]}
            />
          </HorizontalScroller>

          {/* SECOND HEADER */}
          <SectionHeader
            title=""
            subtitle="Care Types provided"
            overlayVariant="yellow"
            icon={
              <span>
                <AdultFirstAidIcon />
              </span>
            }
          />

          {/* SECOND SCROLLER */}
          <HorizontalScroller>
            <ServiceCard
              image="/care-type-provided-one.webp"
              imageAlt="Residential care"
              title="Residential care"
              description="Support for people who need help with everyday activities such as washing, dressing, and meals, but who do not require regular medical treatment. Residents receive 24-hour support in a safe and comfortable living environment."
              points={[
                "24-hour supervision",
                "Meals and activities",
                "Medical monitoring",
                "Safe accommodation",
              ]}
            />

            <ServiceCard
              image="/care-type-provided-two.webp"
              imageAlt="Nursing care"
              title="Nursing Care"
              description="Care for individuals with medical needs that require regular monitoring and treatment by qualified nurses. This includes support with medication, ongoing health conditions, and recovery after illness or surgery."
              points={[
                "Medication administration",
                "Health monitoring",
                "Wound care",
                "Rehabilitation support",
              ]}
            />

            <ServiceCard
              image="/care-type-provided-one.webp"
              imageAlt="Dementia care"
              title="People Living with Dementia"
              description="Specialised care designed to support individuals living with dementia."
              points={[
                "Memory care routines",
                "Cognitive engagement",
                "Safe and secure environment",
                "Behavioural support",
              ]}
            />

            <ServiceCard
              image="/care-type-provided-two.webp"
              imageAlt="Dementia care"
              title="People Living with Dementia"
              description="Specialised care designed to support individuals living with dementia."
              points={[
                "Memory care routines",
                "Cognitive engagement",
                "Safe and secure environment",
                "Behavioural support",
              ]}
            />
          </HorizontalScroller>
        </div>
      </div>

      <div className={styles.lengthOfStayWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.icon}>
              <LengthStayIcon />
            </span>
            Length Of Stay
          </h2>
        </div>

        <div className={styles.content}>
          {/* LEFT */}
          <div className={styles.left}>
            <div className={styles.card}>
              <h3>Permanent stay</h3>
              <p>
                Long-term accommodation and ongoing support for individuals who
                are no longer able to live independently. This option provides a
                stable living environment with continuous care tailored to
                personal needs.
              </p>
            </div>

            <div className={styles.card}>
              <h3>Respite Stay</h3>
              <p>
                Short-term care designed to support recovery after illness or
                hospital discharge, or to give family carers temporary relief.
                This option offers flexible stays while ensuring individuals
                receive the care and attention they need.
              </p>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className={styles.imageWrapper}>
            <Image
              src="/elderly-care-image.webp"
              alt="Length of stay care"
              fill
              className={styles.image}
            />
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

      <div className={styles.aboutCareHome}>
        <div className={styles.mobile}>
          <Image
            src="/elderly-man.webp"
            alt="Elderly man"
            fill
            sizes="(max-width: 500px) 100vw, 50vw"
            className={styles.coverImage}
            priority={false}
          />
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
            <div className={styles.buildingDetails}>
              <p>
                year built: <span>2016</span>
              </p>
              <p>
                Number of floors: <span>2</span>
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
          <div className={styles.info}>
            <h5>Parking</h5>
            <p>Free parking</p>
          </div>
          <div className={styles.info}>
            <h5>Room info</h5>
            <div className={styles.roomDetails}>
              <p>
                Single rooms <span>(80)</span>
              </p>
              <p>
                Couples rooms <span>(14)</span>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.ownersSectionImage}>
          <Image
            src="/elderly-man.webp"
            alt="Elderly man"
            fill
            sizes="(max-width: 500px) 100vw, 50vw"
            priority={false}
            className={styles.coverImage}
          />
        </div>
      </div>

      {/* Image Gallery Section */}
      {/* {careHome.images && careHome.images.length > 1 && (
        <div className={styles.imageGallerySection}>
          <h3>Image Gallery</h3>
          <div className={styles.imageGallery}>
            {careHome.images.map((image) => (
              <div key={image.id} className={styles.galleryImage}>
                <Image
                  src={resolveImageUrl(image.url)}
                  alt={image.alt || careHome.name}
                  width={800}
                  height={600}
                  className={styles.galleryImageImg}
                  sizes="(max-width: 768px) 50vw, (max-width: 500px) 100vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      )} */}
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
