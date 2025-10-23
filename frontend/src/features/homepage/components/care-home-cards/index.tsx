type CardProp = {
  title: string;
  description: string;
  rating?: number;
};
import styles from "./styles.module.scss";
import Image from "next/image";
import ratingIcon from "@/../public/rating.png";
const CardHomeCare: React.FC<CardProp> = ({ title, description, rating }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <Image src={ratingIcon} alt="ratings" />
      </div>
      <div className={styles.description}>
        <h5>{title}</h5>
        <p>{description}</p>
        {rating && rating > 0 && (
          <div className={styles.ratingInfo}>
            <span className={styles.ratingStars}>
              {"★".repeat(Math.round(rating))}
              {"☆".repeat(5 - Math.round(rating))}
            </span>
            <span className={styles.ratingText}>
              {rating.toFixed(1)} average rating
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default CardHomeCare;
