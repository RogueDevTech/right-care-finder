import styles from "./styles.module.scss";
import Image from "next/image";
import primaryCare from "@/../public/primaryCategory.png";
import careProvided from "@/../public/careProvided.png";
import lengthOfStarting from "@/../public/lenghtOfStating.png";
import demantiaCare from "@/../public/demantiaCare.png";
import dementia from "@/../public/dementia.png";
import { StarIcon } from "@/components/icon";
export default function CaresProvided() {
  return (
    <div className={styles.CaresProvidedWrapper}>
      <h2>Cares Provided</h2>
      <div className={styles.serviceProvided}>
        <div className={styles.careCard}>
          <div className={styles.image}>
            <Image src={primaryCare} alt="primary care" />
          </div>
          <div className={styles.CareContent}>
            <h3 className={styles.h3}>
              <span>
                <StarIcon />
              </span>
              Primary care categories
            </h3>
            <ul>
              <li>Older person care</li>
              <li>Dementia</li>
              <li>mental health condition</li>
              <li>Visual / hearing impairment</li>
              <li>Younger adults</li>
            </ul>
          </div>
        </div>
        <div className={styles.careCard}>
          <div className={styles.image}>
            <Image src={careProvided} alt="primary care" />
          </div>
          <div className={styles.CareContent}>
            <h3 className={styles.h3}>
              <span>
                <StarIcon />
              </span>
              Care types provided
            </h3>
            <ul>
              <li>Residential care</li>
              <li>Nursing care</li>
              <li>Dementia residential care</li>
              <li>Dementia nursing care</li>
              <li>For a maximum of 74 service users</li>
            </ul>
          </div>
        </div>
        <div className={styles.careCard}>
          <div className={styles.image}>
            <Image src={lengthOfStarting} alt="primary care" />
          </div>
          <div className={styles.CareContent}>
            <h3 className={styles.h3}>
              <span>
                <StarIcon />
              </span>
              Length of staying
            </h3>
            <ul>
              <li>Permanent</li>
              <li>Respite care</li>
            </ul>
          </div>
        </div>
        <div className={styles.careCard}>
          <div className={styles.image}>
            <Image src={demantiaCare} alt="primary care" />
          </div>
          <div className={styles.CareContent}>
            <h3 className={styles.h3}>
              <span>
                <StarIcon />
              </span>
              Dementia care types
            </h3>
            <ul>
              <li>Mild dementia</li>
              <li>Moderate dementia</li>
              <li>Advanced / complex dememtia</li>
              <li>Visual / hearing impairment</li>
              <li>Younger adults</li>
            </ul>
          </div>
        </div>
        <div className={styles.careCard}>
          <div className={styles.image}>
            <Image src={dementia} alt="primary care" />
          </div>
          <div className={styles.CareContent}>
            <h3 className={styles.h3}>
              <span>
                <StarIcon />
              </span>
              Dementia care types
            </h3>
            <ul>
              <li>Mild dementia</li>
              <li>Moderate dementia</li>
              <li>Advanced / complex dememtia</li>
              <li>Visual / hearing impairment</li>
              <li>Younger adults</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
