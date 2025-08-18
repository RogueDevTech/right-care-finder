"use client";
import CardHomeCare from "../care-home-cards";
import styles from "./styles.module.scss";
import { useState } from "react";
import React from "react";
import Image from "next/image";
import toggle from "@/../public/toggle.png";
const cards = [
  { title: "South East England", description: "1,210 Care Homes" },
  { title: "Greater London", description: "1,210 Care Homes" },
  { title: "East of England", description: "1,210 Care Homes" },
  { title: "West Midlands", description: "1,210 Care Homes" },
  { title: "East Midlands ", description: "1,210 Care Homes" },
  { title: "North West England", description: "1,210 Care Homes" },
  { title: "North East England", description: "1,210 Care Homes" },
  { title: "Yorkshire ", description: "1,210 Care Homes" },
  { title: "Scottish Highlands", description: "1,210 Care Homes" },
  { title: "Scottish Lowlands", description: "1,210 Care Homes" },
  { title: "Wales", description: "1,210 Care Homes" },
  { title: "North West England", description: "1,210 Care Homes" },
  { title: "Midlands", description: "1,210 Care Homes" },
  { title: "Wiltshire", description: "1,210 Care Homes" },
  { title: "Dorset", description: "1,210 Care Homes" },
];
const FindBestCare: React.FC = () => {
  const [selected, setSelected] = useState("Highest rated");
  const options = ["Highest rated", "Newest", "Oldest", "Most popular"];
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.intro}>
          <h1>Find the Best Care Homes Near You</h1>
          <p>
            Finding the right care home for your loved one is easier when you
            can compare locations, services, and real resident feedback. Our
            ratings are based on recent reviews, care quality, staff
            friendliness, and overall resident satisfaction — giving you a
            reliable guide for making informed decisions.
          </p>
        </div>
        <div className={styles.filter}>
          <div className={styles.sortCard}>
            <span className={styles.label}>Sort by:</span>
            <div className={styles.dropdown}>
              <button className={styles.dropdownBtn}>{selected} ▼</button>
              <div className={styles.dropdownContent}>
                {options.map((option, i) => (
                  <div
                    key={i}
                    className={styles.dropdownItem}
                    onClick={() => setSelected(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.toggle}>
            <Image src={toggle} alt="toggle" />
          </div>
        </div>
      </div>
      <div className={styles.cardWrapper}>
        {cards.map((card, index) => (
          <CardHomeCare
            key={index}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
};
export default FindBestCare;
