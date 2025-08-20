import styles from "./styles.module.scss";
import Image from "next/image";
import rating from "@/../public/starRating.png";
export default function RatingsAndReview() {
  return (
    <div className={styles.ratingsAndReviewWrapper}>
      <div className={styles.header}>
        <h2>Rating and reviews</h2>
        <button>Leave a review</button>
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
                updated. The activities are engaging, from art therapy to music
                afternoons, and she has made wonderful friends here. I’m
                reassured knowing she is safe, well cared for, and genuinely
                happy.
              </div>
            </div>
            <div className={styles.likes}>👍7 people found helpful</div>
          </div>
        </div>
      </div>
    </div>
  );
}
