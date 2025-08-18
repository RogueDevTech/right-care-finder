import CareerHomeCard from "./components/career-home-card";
import styles from "./styles.module.scss";
import Input from "./components/input";
import DropDown from "./components/dropdowns";
export default function CareerPage() {
  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <Input />
        <div className={styles.dropdownWrapper}>
          <DropDown />
        </div>
      </div>
      <div className={styles.cardWrapper}>
        <CareerHomeCard />
        <CareerHomeCard />
        <CareerHomeCard />
        <CareerHomeCard />
        <CareerHomeCard />
      </div>
    </div>
  );
}
