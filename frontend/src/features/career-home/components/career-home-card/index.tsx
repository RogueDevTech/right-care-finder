import { LocationIcon, PhoneIcon } from "@/components/icon";
import styles from "./styles.module.scss";
import Image from "next/image";
import CareHomeCardImage from "@/../public/care-home-card-img.jpg";
const CareerHomeCard: React.FC = () => {
  return (
    <div className={styles.careHomeCard}>
      <div className={styles.cardImage}>
        <Image src={CareHomeCardImage} alt="care home card image" />
        <div className={styles.phoneTag}>
          <PhoneIcon />
          03447639489
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.header}>
          <h2 className={styles.homeName}>Willow Glen care</h2>
          <div className={styles.price}>$3000</div>
        </div>

        <div className={styles.location}>
          <LocationIcon />
          Manchester, England
        </div>

        <p className={styles.description}>
          A modern 45-bed home offering 24/7 residential and dementia care in a
          warm, family-like environment. Spacious gardens, daily activities, and
          chef-prepared meals.
        </p>

        <p className={styles.tagline}>
          &ldquo;Where comfort meets care in the heart of Manchester.&ldquo;
        </p>

        <button className={styles.viewButton}>View home</button>
      </div>
    </div>
  );
};
export default CareerHomeCard;
