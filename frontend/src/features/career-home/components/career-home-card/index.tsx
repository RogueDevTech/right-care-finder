import { LocationIcon, PhoneIcon } from "@/components/icon";
import styles from "./styles.module.scss";
import { careHomes } from "@/components/data";
import Image from "next/image";
import Link from "next/link";
const CareerHomeCard: React.FC = () => {
  return (
    <>
      {careHomes.map((careHome) => (
        <div className={styles.careHomeCard} key={careHome.id}>
          <div className={styles.cardImage}>
            <Image src={careHome.image} alt="care home card image" />
            <div className={styles.phoneTag}>
              <PhoneIcon />
              {careHome.phone}
            </div>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.header}>
              <h2 className={styles.homeName}>{careHome.name}</h2>
              <div className={styles.price}>{careHome.price}</div>
            </div>

            <div className={styles.location}>
              <LocationIcon />
              {careHome.location}
            </div>

            <p className={styles.description}>{careHome.description}</p>

            <p className={styles.tagline}>{careHome.tagline}</p>
            <Link href={`/career/${careHome.id}`}>
              <button className={styles.viewButton}>View home</button>
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};
export default CareerHomeCard;
