"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCounterStore } from "@/store/useStore";
import { LocationIcon, PhoneIcon } from "@/components/icon";
import starRating from "@/../public/starRating.png";
import primaryCare from "@/../public/primaryCategory.png";
import ownersSectionImage from "@/../public/ownersSectionImage.png";
import careProvided from "@/../public/careProvided.png";
import lengthOfStarting from "@/../public/lenghtOfStating.png";
import demantiaCare from "@/../public/demantiaCare.png";
import dementia from "@/../public/dementia.png";
import rating from "@/../public/starRating.png";
import ReviewModal from "@/features/view-home-details/ratings-and-reviews/review-modal";
import { StarIcon } from "@/components/icon";
import {
  useHealthcareHomesActions,
  CareHome,
} from "@/actions-client/healthcare-homes";
import { toast } from "react-hot-toast";
import styles from "./care-homes-details.module.scss";
import absoluteGradient from "@/../public/abstract-wave-gradient.jpg";
type ImageType = {
  id: number;
  src: string;
  alt: string;
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
// import { careHomes } from "@/components/data";

export default function CareHomesDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { openReviewModal, setOpenReviewModal } = useCounterStore();
  const { getCareHomeById } = useHealthcareHomesActions();

  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [images, setImages] = useState<ImageType[]>([]);

  const handleThumbnailClick = (index: number) => {
    const newImages = [...images];
    [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
    setImages(newImages);
  };

  const careHomeId = params.id as string;

  useEffect(() => {
    const fetchCareHome = async () => {
      if (!careHomeId) return;

      setIsLoading(true);
      try {
        console.log("Fetching care home with ID:", careHomeId);
        const response = await getCareHomeById(careHomeId);
        console.log("API Response:", response);

        if (!response.success) {
          console.error("API Error:", response.error);
          toast.error(`Failed to load care home details: ${response.error}`);
          // Don't redirect immediately, let user see the error
          setCareHome(null);
        } else {
          setCareHome(response.data || null);
          console.log("Care home data loaded:", response.data);
          console.log("Images array:", response.data?.images);
          console.log("Images length:", response.data?.images?.length);

          // Set images from care home data
          if (response.data?.images && response.data.images.length > 0) {
            const careHomeImages = response.data.images.map(
              (
                img: { id: string; url: string; alt?: string },
                index: number
              ) => ({
                id: index + 1,
                src: img.url,
                alt: img.alt || `Care home image ${index + 1}`,
              })
            );
            console.log("Setting care home images:", careHomeImages);
            setImages(careHomeImages);
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
  }, [careHomeId, router]);

  if (isLoading) {
    return (
      <main>
        {/* Gallery Skeleton */}
        <div className={styles.gallery}>
          <div className={styles.preview}>
            <div className={`${styles.skeleton} ${styles.image}`}></div>
          </div>
          <div className={styles.thumbnails}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={styles.thumb}>
                <div className={`${styles.skeleton} ${styles.thumbnail}`}></div>
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
              src={images[0].src}
              alt={images[0].alt}
              className={styles.singleImage}
            />
          </div>
        ) : images.length === 2 ? (
          // Two images - side by side
          <div className={styles.twoImageContainer}>
            <div className={styles.imageHalf}>
              <img
                src={images[0].src}
                alt={images[0].alt}
                className={styles.halfImage}
              />
            </div>
            <div className={styles.imageHalf}>
              <img
                src={images[1].src}
                alt={images[1].alt}
                className={styles.halfImage}
              />
            </div>
          </div>
        ) : (
          // 3 or 4 images - main image + thumbnails
          <>
            {/* Left Side - Enlarged Image */}
            <div className={styles.preview}>
              <img
                src={images[0].src}
                alt={images[0].alt}
                className={styles.mainImage}
              />
            </div>

            {/* Right Side - Thumbnails */}
            <div className={styles.thumbnails}>
              {images.slice(1).map((img, index) => (
                <div
                  key={img.id}
                  className={styles.thumb}
                  onClick={() => handleThumbnailClick(index + 1)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className={styles.thumbImage}
                  />
                </div>
              ))}
            </div>
          </>
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
            <div className={styles.stars}>
              <Image src={starRating} alt="rating" />
            </div>
            <p>{careHome.reviewCount} reviews</p>
          </div>
        </div>
        <div className={styles.getInTouch}>
          <div className={styles.contactUs}>
            <button>
              <span>
                <PhoneIcon />
                <span>{careHome.phone}</span>
              </span>
            </button>
            <button>
              <span>
                <PhoneIcon />
                <span>Send an email</span>
              </span>
            </button>
            <button>
              <span>
                <PhoneIcon />
                <span>Request a tour</span>
              </span>
            </button>
            <button>
              <span>
                <PhoneIcon />
                <span>Make an enquiry</span>
              </span>
            </button>
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
                <li>Residential care</li>
                <li>Nursing care</li>
                <li>Dementia residential care</li>
                <li>Dementia nursing care</li>
                <li>For a maximum of 74 service users</li>
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
      <div className={styles.aboutCareHome}>
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
      </div>
      <div className={styles.ratingsAndReviewWrapper}>
        <div className={styles.header}>
          <h2>Rating and reviews</h2>
          <button onClick={setOpenReviewModal}>Leave a review</button>
          {openReviewModal && (
            <div className={styles.reviewModal} onClick={setOpenReviewModal}>
              <ReviewModal onClose={setOpenReviewModal} />
            </div>
          )}
        </div>
        <div className={styles.reviewsSection}>
          <div className={styles.reviewCard}>
            <div className={styles.rating}>
              <Image src={rating} alt="rating" />
            </div>
            <div className={styles.reviewContent}>
              <div className={styles.reviewer}>
                <p className={styles.name}>James T.</p>
                <div className={styles.review}>
                  The carers are truly compassionate, and my father has received
                  excellent medical and personal care. The only drawback we’ve
                  noticed is that sometimes calls take a little longer to be
                  answered during busy evenings. Other than that, the facilities
                  and support are top-notch.
                </div>
              </div>
              <div className={styles.likes}>👍3 people found helpful</div>
            </div>
          </div>
          <div className={styles.reviewCard}>
            <div className={styles.rating}>
              <Image src={rating} alt="rating" />
            </div>
            <div className={styles.reviewContent}>
              <div className={styles.reviewer}>
                <p className={styles.name}>Emily S.</p>
                <div className={styles.review}>
                  My mother has been living at Rosewood Care Home for the past 8
                  months, and we couldn’t be happier. The staff are incredibly
                  attentive, always taking the time to chat with her and keep us
                  updated. The activities are engaging, from art therapy to
                  music afternoons, and she has made wonderful friends here. I’m
                  reassured knowing she is safe, well cared for, and genuinely
                  happy.
                </div>
              </div>
              <div className={styles.likes}>👍7 people found helpful</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
