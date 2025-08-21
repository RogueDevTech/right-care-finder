import styles from "./styles.module.scss";
import Image from "next/image";
import absoluteGradient from "@/../public/abstract-wave-gradient.jpg";
import {
  FurnitureIcon,
  PetIcon,
  ShopIcon,
  TransportIcon,
} from "@/components/icon";
export default function Facilities() {
  return (
    <div className={styles.facilitiesContainer}>
      <h3>Facilities</h3>
      <div className={styles.facilitiesCardContainer}>
        <div className={styles.facilitiesCard}>
          <div className={styles.absoluteGradient}>
            <Image src={absoluteGradient} alt="absolute gradient" />
          </div>
          <div className="">
            <span>
              <FurnitureIcon />
            </span>
            <p>Own Furniture if required</p>
          </div>
          <div className="">
            <PetIcon />
            <p>Pet Friendly (or by arrangement)</p>
          </div>
          <div className="">
            <ShopIcon />
            <p>Close to Local shops</p>
          </div>
          <div className="">
            <TransportIcon />
            <p>Near Public Transport</p>
          </div>
        </div>
        <div className={styles.facilitiesCard}>
          <div className={styles.absoluteGradient}>
            <Image src={absoluteGradient} alt="absolute gradient" />
          </div>
          <div className="">
            <span>
              <FurnitureIcon />
            </span>
            <p>Minibus or other transport</p>
          </div>
          <div className="">
            <PetIcon />
            <p>Lift</p>
          </div>
          <div className="">
            <ShopIcon />
            <p>Wheelchair Access</p>
          </div>
          <div className="">
            <TransportIcon />
            <p>Gardens</p>
          </div>
        </div>
        <div className={styles.facilitiesCard}>
          <div className={styles.absoluteGradient}>
            <Image src={absoluteGradient} alt="absolute gradient" />
          </div>
          <div className="">
            <span>
              <FurnitureIcon />
            </span>
            <p>Residents Kitchenette</p>
          </div>
          <div className="">
            <PetIcon />
            <p>Phone Point in own room</p>
          </div>
          <div className="">
            <ShopIcon />
            <p>Television point in own rooms</p>
          </div>
          <div className="">
            <TransportIcon />
            <p>Residents Internet Access</p>
          </div>
        </div>
      </div>
    </div>
  );
}
