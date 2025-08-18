import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import BlurBackground from "@/../public/how-it-works-blur.png";
import { CompareIcon, ContactIcon, SearchIcon } from "@/components/icon";
// import { FaSearch, FaSlidersH, FaPhoneAlt } from "react-icons/fa";

export default function HowItWorks() {
  return (
    <div className={styles.container}>
      <div className={styles.blurBackground}>
        <Image src={BlurBackground} alt="blur background" />
      </div>
      <main className={styles.main}>
        <h1 className={styles.title}>How it works</h1>
        <div className={styles.cardsContainer}>
          <div className={`${styles.card} ${styles.card1}`}>
            <div className={styles.iconContainer}>
              <span className={styles.icon}>
                <SearchIcon />
              </span>
            </div>
            <h2>01</h2>
            <h3>Search for a care home</h3>
            <p>
              Quickly find trusted care homes near you with our easy search
              tool.
            </p>
          </div>
          <div className={`${styles.card} ${styles.card2}`}>
            <div className={styles.iconContainer}>
              <span className={styles.icon}>
                <CompareIcon />
              </span>
            </div>
            <h2>02</h2>
            <h3>Compare care types</h3>
            <p>
              See detailed ratings, facilities, and care options side-by-side.
            </p>
          </div>
          <div className={`${styles.card} ${styles.card3}`}>
            <div className={styles.iconContainer}>
              <span className={styles.icon}>
                <ContactIcon />
              </span>
            </div>
            <h2>03</h2>
            <h3>Contact providers directly</h3>
            <p>
              Reach out instantly to arrange visits or request more information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
