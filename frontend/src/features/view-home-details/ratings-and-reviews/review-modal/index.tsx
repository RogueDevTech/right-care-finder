"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useHealthcareHomesActions } from "@/actions-client/healthcare-homes";
import styles from "./styles.module.scss";
import { CloseIcon } from "@/components/icon";

interface ReviewModalProps {
  onClose: () => void;
  careHomeId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewModal({ onClose, careHomeId, onReviewSubmitted }: ReviewModalProps) {
  const [overall, setOverall] = useState(0);
  const [ratings, setRatings] = useState({
    facilities: 0,
    care: 0,
    cleanliness: 0,
    food: 0,
    staff: 0,
    activities: 0,
    safety: 0,
    rooms: 0,
  });
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createReview } = useHealthcareHomesActions();

  const categories = [
    "facilities",
    "care",
    "cleanliness",
    "food",
    "staff",
    "activities",
    "safety",
    "rooms",
  ];

  const handleRating = (category: string, value: number) => {
    setRatings({ ...ratings, [category]: value });
  };

  const handleSubmit = async () => {
    // Validation
    if (overall === 0) {
      toast.error("Please provide an overall rating");
      return;
    }

    if (!review.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (review.trim().length < 10) {
      toast.error("Review must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createReview(careHomeId, {
        rating: overall,
        comment: review.trim(),
        isAnonymous: false,
        reviewData: ratings,
      });

      if (result.success) {
        toast.success("Review submitted successfully! It will be visible after verification.");
        onClose();
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        toast.error(result.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting your review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <h2>Leave a Review</h2>
        <button onClick={onClose} className={styles.close}>
          <CloseIcon />
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.section}>
          <label>How was your overall experience?</label>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={num <= overall ? styles.active : styles.star}
                onClick={() => setOverall(num)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className={styles.name}>
          <label>Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.message}>
          <label>Your Review</label>
          <textarea
            rows={5}
            placeholder="Share your experience with this care home..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <div className={styles.categoriesSection}>
          <h3>Rate Specific Areas (Optional)</h3>
          {categories.map((cat) => (
            <div className={styles.category} key={cat}>
              <span className={styles.label}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    className={
                      num <= ratings[cat as keyof typeof ratings]
                        ? styles.active
                        : styles.star
                    }
                    onClick={() => handleRating(cat, num)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.modalFooter}>
        <button
          className={styles.submit}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Post Review"}
        </button>
      </div>
    </div>
  );
}
