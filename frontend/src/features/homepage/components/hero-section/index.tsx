import SearchBar from "@/features/career-home/components/input";
import styles from "./styles.module.scss";
import Image from "next/image";
import HeroImage from "@/../public/hero-image.png";
export default function HeroSection() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Find the Right Care Home for Your Loved One – Fast and Easy</h1>
          <p>
            Browse hundreds of care homes across the UK by location, care type,
            reviews, and more.
          </p>
        </div>
        <div className={styles.input}>
          <SearchBar />
        </div>
      </div>
      <div className={styles.heroImage}>
        <Image src={HeroImage} alt="hero image" />
      </div>
    </div>
  );
}
