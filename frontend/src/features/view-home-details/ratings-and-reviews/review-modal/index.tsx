"use client";

import { useState } from "react";
import styles from "./styles.module.scss";
import { CloseIcon, Star1Icon } from "@/components/icon";

interface ReviewModalProps {
  onClose: () => void;
}

export default function ReviewModal({ onClose }: ReviewModalProps) {
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

  return (
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <h2>Leave a review</h2>
        <button onClick={onClose} className={styles.close}>
          <CloseIcon />
        </button>
      </div>

      <div className={styles.section}>
        <label>Rate overall experience</label>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={num <= overall ? styles.active : styles.star}
              onClick={() => setOverall(num)}
            >
              <Star1Icon />
            </span>
          ))}
        </div>
      </div>

      <div className={styles.name}>
        <label>Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.message}>
        <label>Leave your review</label>
        <textarea
          rows={5}
          placeholder="Enter your message"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className={styles.textarea}
        />
      </div>

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
                <Star1Icon />
              </span>
            ))}
          </div>
        </div>
      ))}
      <div className={styles.submit}>Post review</div>
    </div>
  );
}
