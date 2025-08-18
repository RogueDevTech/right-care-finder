"use client";
import styles from "./styles.module.scss";
import { useState } from "react";
const DropDown: React.FC = () => {
  const [region, setRegion] = useState("Region");
  const regions = ["Highest rated", "Newest", "Oldest", "Most popular"];
  const [careType, setCareType] = useState("Care Type");
  const careTypes = ["Highest rated", "Newest", "Oldest", "Most popular"];
  const [price, setPrice] = useState("Price Range");
  const pricingRange = ["Highest rated", "Newest", "Oldest", "Most popular"];
  return (
    <div className={styles.container}>
      <div className={styles.sortCard}>
        <div className={styles.dropdown}>
          <button className={styles.dropdownBtn}>{region} ▼</button>
          <div className={styles.dropdownContent}>
            {regions.map((option, i) => (
              <div
                key={i}
                className={styles.dropdownItem}
                onClick={() => setRegion(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.sortCard}>
        <div className={styles.dropdown}>
          <button className={styles.dropdownBtn}>{careType} ▼</button>
          <div className={styles.dropdownContent}>
            {careTypes.map((option, i) => (
              <div
                key={i}
                className={styles.dropdownItem}
                onClick={() => setCareType(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.sortCard}>
        <div className={styles.dropdown}>
          <button className={styles.dropdownBtn}>{price} ▼</button>
          <div className={styles.dropdownContent}>
            {pricingRange.map((option, i) => (
              <div
                key={i}
                className={styles.dropdownItem}
                onClick={() => setPrice(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DropDown;
