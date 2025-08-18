type CardProp = {
  title: string;
  description: string;
};
import styles from "./styles.module.scss";
import Image from "next/image";
import rating from "@/../public/rating.png";
const CardHomeCare: React.FC<CardProp> = ({ title, description }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <Image src={rating} alt="ratings" />
      </div>
      <div className={styles.description}>
        <h5>{title}</h5>
        <p>{description}</p>
      </div>
    </div>
  );
};
export default CardHomeCare;
