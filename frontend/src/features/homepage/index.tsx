import styles from "../homepage/styles.module.scss";
import AdviseAndInsight from "./components/advice-and-insight";
import FindBestCare from "./components/find-best-care";
import HeroSection from "./components/hero-section";
import HowItWorks from "./components/how-it-works";
export default function Homepage() {
  return (
    <div className={styles.container}>
      <HeroSection />
      <HowItWorks />
      <FindBestCare />
      <AdviseAndInsight />
    </div>
  );
}
