"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useUserActions } from "@/actions-client/user";
import { CareHome } from "@/actions-client/healthcare-homes";
import { Star1Icon } from "@/components/icon";
import styles from "./styles.module.scss";

export default function OwnerReviewsPage() {
  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "rating">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { getMyCareHomes } = useUserActions();

  useEffect(() => {
    fetchCareHome();
  }, []);

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

  const reviews = careHome?.reviews || [];

  // Calculate rating breakdown
  const ratingBreakdown = useMemo(() => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      breakdown[review.rating as keyof typeof breakdown]++;
    });
    return breakdown;
  }, [reviews]);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    // Apply rating filter
    if (filterRating !== "all") {
      filtered = filtered.filter((review) => review.rating === filterRating);
    }

    // Sort reviews
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else {
        return sortOrder === "desc"
          ? b.rating - a.rating
          : a.rating - b.rating;
      }
    });

    return sorted;
  }, [reviews, filterRating, sortBy, sortOrder]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={num <= rating ? styles.starFilled : styles.starEmpty}
          >
            <Star1Icon />
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Reviews</h1>
          <p>View and manage customer reviews for your care home</p>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading reviews...</p>
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
        <div className={styles.reviewsContent}>
          {/* Statistics Section */}
          <div className={styles.statsSection}>
            <div className={styles.overallRating}>
              <div className={styles.ratingNumber}>
                {careHome.averageRating
                  ? careHome.averageRating.toFixed(1)
                  : "N/A"}
              </div>
              <div className={styles.starsLarge}>
                {renderStars(Math.round(careHome.averageRating || 0))}
              </div>
              <div className={styles.totalReviews}>
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </div>
            </div>

            <div className={styles.ratingBreakdown}>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingBreakdown[rating as keyof typeof ratingBreakdown];
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={rating} className={styles.breakdownRow}>
                    <span className={styles.ratingLabel}>{rating}</span>
                    <Star1Icon />
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={styles.ratingCount}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className={styles.controls}>
            <div className={styles.filterGroup}>
              <label>Filter by rating:</label>
              <select
                value={filterRating}
                onChange={(e) =>
                  setFilterRating(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
                className={styles.select}
              >
                <option value="all">All ratings</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "rating")}
                className={styles.select}
              >
                <option value="date">Date</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Order:</label>
              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value as "asc" | "desc")
                }
                className={styles.select}
              >
                <option value="desc">
                  {sortBy === "date" ? "Newest first" : "Highest first"}
                </option>
                <option value="asc">
                  {sortBy === "date" ? "Oldest first" : "Lowest first"}
                </option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          {filteredAndSortedReviews.length === 0 ? (
            <div className={styles.noReviews}>
              <div className={styles.noReviewsIcon}>⭐</div>
              <h3>
                {filterRating !== "all"
                  ? `No ${filterRating}-star reviews yet`
                  : "No reviews yet"}
              </h3>
              <p>
                {filterRating !== "all"
                  ? "Try adjusting your filter to see more reviews."
                  : "Reviews from customers will appear here."}
              </p>
            </div>
          ) : (
            <div className={styles.reviewsList}>
              {filteredAndSortedReviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewUser}>
                      <div className={styles.userAvatar}>
                        {review.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.userInfo}>
                        <h4>{review.user.name}</h4>
                        <span className={styles.reviewDate}>
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.reviewRating}>
                      {renderStars(review.rating)}
                      <span className={styles.ratingValue}>
                        {review.rating}.0
                      </span>
                    </div>
                  </div>
                  <div className={styles.reviewContent}>
                    <p>{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
