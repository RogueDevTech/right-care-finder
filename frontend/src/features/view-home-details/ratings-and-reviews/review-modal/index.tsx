"use client";
import { useState } from "react";
import styles from "./styles.module.scss";

interface ReviewData {
  name: string;
  review: string;
  overallRating: number;
  facilities: number;
  care: number;
  cleanliness: number;
  foodAndDrink: number;
  staff: number;
  activities: number;
  safety: number;
  rooms: number;
}

type RatingKeys = Exclude<keyof ReviewData, "name" | "review">;

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewData) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ReviewData>({
    name: "",
    review: "",
    overallRating: 0,
    facilities: 0,
    care: 0,
    cleanliness: 0,
    foodAndDrink: 0,
    staff: 0,
    activities: 0,
    safety: 0,
    rooms: 0,
  });

  const categories: Array<{ key: RatingKeys; label: string }> = [
    { key: "facilities", label: "Facilities" },
    { key: "care", label: "Care" },
    { key: "cleanliness", label: "Cleanliness" },
    { key: "foodAndDrink", label: "Food and drink" },
    { key: "staff", label: "Staff" },
    { key: "activities", label: "Activities" },
    { key: "safety", label: "Safety" },
    { key: "rooms", label: "Rooms" },
  ];

  const handleRatingChange = (category: RatingKeys, rating: number) => {
    setFormData((prev) => ({
      ...prev,
      [category]: rating,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      review: "",
      overallRating: 0,
      facilities: 0,
      care: 0,
      cleanliness: 0,
      foodAndDrink: 0,
      staff: 0,
      activities: 0,
      safety: 0,
      rooms: 0,
    });
  };

  interface StarRatingProps {
    rating: number;
    onRatingChange: (category: RatingKeys, rating: number) => void;
    category: RatingKeys;
  }

  const StarRating: React.FC<StarRatingProps> = ({
    rating,
    onRatingChange,
    category,
  }) => {
    return (
      <div className={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${styles.star} ${star <= rating ? styles.filled : ""}`}
            onClick={() => onRatingChange(category, star)}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Leave a review</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <label className={styles.label}>Rate overall experience</label>
            <StarRating
              rating={formData.overallRating}
              onRatingChange={handleRatingChange}
              category="overallRating"
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label} htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className={styles.input}
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label} htmlFor="review">
              Leave your review
            </label>
            <textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              placeholder="Enter your message"
              className={styles.textarea}
              rows={4}
            />
          </div>

          <div className={styles.categoriesSection}>
            {categories.map((category) => (
              <div key={category.key} className={styles.categoryRow}>
                <span className={styles.categoryLabel}>{category.label}</span>
                <StarRating
                  rating={formData[category.key]}
                  onRatingChange={handleRatingChange}
                  category={category.key}
                />
              </div>
            ))}
          </div>

          <button type="submit" className={styles.submitButton}>
            Post review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
