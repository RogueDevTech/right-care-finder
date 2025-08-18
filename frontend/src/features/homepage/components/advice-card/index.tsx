import styles from "../advice-card/styles.module.scss";
import Image from "next/image";
import RightCareHome from "@/../public/right-care-home.png";
import React from "react";
type CardProp = {
  title: string;
  content: string;
};
const AdviceCard: React.FC<CardProp> = ({ title, content }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.cardContent}>
        <h5>{title}</h5>
        <p>{content}</p>
        <a href="">Read More</a>
      </div>
      <div className={styles.imageWrapper}>
        <Image src={RightCareHome} alt="right care home" />
      </div>
    </div>
  );
};
export default AdviceCard;
