import styles from "./styles.module.scss";
import Image from "next/image";
import ownersSectionImage from "@/../public/ownersSectionImage.png";
export default function AboutCareHome() {
  return (
    <div className={styles.aboutCareHome}>
      <div className={styles.mobile}>
        <Image src={ownersSectionImage} alt="owners section image" />
      </div>
      <div className={styles.careHomeDetail}>
        <div className={styles.info}>
          <h5>Owner</h5>
          <p>MOP Healthcare Ltd</p>
        </div>
        <div className={styles.info}>
          <h5>Person in charge</h5>
          <p>Dania Meadows</p>
        </div>
        <div className={styles.info}>
          <h5>Admission criteria</h5>
          <p>Resident aged 45 years and over</p>
        </div>
        <div className={styles.info}>
          <h5>Care home building</h5>
          <div className="">
            <p>
              year: <span>2016</span>
            </p>
            <p>
              Number of floors:<span>2</span>
            </p>
            <p>
              Last refurbishment: <span>2014</span>
            </p>
          </div>
        </div>
        <div className={styles.info}>
          <h5>Visiting</h5>
          <p>No restrictions to visiting hours</p>
        </div>
        <div className="">
          <h5>Parking</h5>
          <p>Free parking</p>
        </div>
        <div className="">
          <h5>Room info</h5>
          <div className="">
            <p>
              single room <span>(80)</span>
            </p>
            <p>
              Double room:<span>40</span>
            </p>
            <p>
              Last refurbishment: <span>2014</span>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.ownersSectionImage}>
        <Image src={ownersSectionImage} alt="owners section image" />
      </div>
    </div>
  );
}
