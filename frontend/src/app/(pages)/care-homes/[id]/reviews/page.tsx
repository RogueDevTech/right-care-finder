"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { errorToString } from "@/utils/error-to-string";
import styles from "../care-homes-details.module.scss";
import {
  useHealthcareHomesActions,
  CareHome,
} from "@/actions-client/healthcare-homes";

export default function CareHomeAllReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const careHomeId = params?.id as string;
  const { getCareHomeById } = useHealthcareHomesActions();

  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const load = async () => {
      if (!careHomeId) return;
      setIsLoading(true);
      const res = await getCareHomeById(careHomeId);
      if (!res.success || !res.data) {
        toast.error(res.error ? errorToString(res.error, "Failed to load reviews") : "Failed to load reviews");
        setCareHome(null);
      } else {
        setCareHome(res.data);
      }
      setIsLoading(false);
    };
    load();
  }, [careHomeId, getCareHomeById]);

  const totalReviews = careHome?.reviews?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalReviews / pageSize));

  const currentReviews = useMemo(() => {
    if (!careHome?.reviews) return [];
    const start = (page - 1) * pageSize;
    return careHome.reviews.slice(start, start + pageSize);
  }, [careHome?.reviews, page]);

  const displayName = (review: {
    isAnonymous?: boolean;
    user?: {
      id: string;
      name: string;
    } | null;
  }) => {
    if (review.isAnonymous) return "Anonymous";
    if (review.user?.name) return review.user.name;
    return "User";
  };

  if (isLoading) {
    return (
      <main>
        <div className={styles.ratingsAndReviewWrapper}>
          <div className={styles.loadingReviews}>
            <p>Loading reviews...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!careHome) {
    return (
      <main>
        <div className={styles.ratingsAndReviewWrapper}>
          <div className={styles.noReviews}>
            <p>Care home not found.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className={styles.ratingsAndReviewWrapper}>
        <div className={styles.headerTitle}>
          <h2>Rating and reviews</h2>
        </div>

        <div className={styles.reviewsSection}>
          {totalReviews === 0 ? (
            <div className={styles.noReviews}>
              <p>No reviews yet.</p>
            </div>
          ) : (
            currentReviews.map((review) => (
              <div key={review.id} className={styles.reviewRow}>
                <div className={styles.reviewHeader}>
                  <p className={styles.reviewerName}>{displayName(review)}</p>
                  <p className={styles.reviewTime}>
                    {new Date(review.createdAt).toLocaleDateString("en-GB", {
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

        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              padding: "16px 0",
            }}
          >
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={styles.addReviewButton}
            >
              Previous
            </button>
            <span style={{ alignSelf: "center" }}>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={styles.addReviewButton}
            >
              Next
            </button>
          </div>
        )}

        <div className={styles.addReviewSection}>
          <button
            onClick={() => router.push(`/care-homes/${careHomeId}`)}
            className={styles.addReviewButton}
          >
            Back to details
          </button>
        </div>
      </div>
    </main>
  );
}
