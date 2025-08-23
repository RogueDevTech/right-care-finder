import { LocationIcon, PhoneIcon } from "@/components/icon";
import styles from "./style.module.scss";
import starRating from "@/../public/starRating.png";
import Image from "next/image";
export default function EnquiryDetails() {
  return (
    <div className={styles.details}>
      <div className={styles.nameAndReview}>
        <div className={styles.nameSection}>
          <h3>Thistle View Care</h3>
          <p>
            <span>
              <LocationIcon />
            </span>
            Manchester, England
          </p>
        </div>
        <div className={styles.review}>
          <div className={styles.stars}>
            <Image src={starRating} alt="rating" />
          </div>
          <p>49 reviews</p>
        </div>
      </div>
      <div className={styles.getInTouch}>
        <div className={styles.contactUs}>
          <button>
            <span>
              <PhoneIcon />
              <span>081012345678</span>
            </span>
          </button>
          <button>
            <span>
              <PhoneIcon />
              <span>Send an email</span>
            </span>
          </button>
          <button>
            <span>
              <PhoneIcon />
              <span>Request a tour</span>
            </span>
          </button>
          <button>
            <span>
              <PhoneIcon />
              <span>Make an enquiry</span>
            </span>
          </button>
        </div>
        <div className={styles.price}>$3000</div>
      </div>
    </div>
  );
}
