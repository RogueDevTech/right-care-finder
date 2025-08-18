import styles from "../navbar/styles.module.scss";
import Image from "next/image";
import AppLogo from "@/../public/right-care-logo.png";
import Link from "next/link";
export default function NavBar() {
  return (
    <div className={styles.container}>
      <div className={styles.leftNav}>
        <Link href="/">
          <div className={styles.logo}>
            <Image src={AppLogo} alt="Right care logo" />
          </div>
        </Link>
        <div className={styles.nav}>
          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Care type ▼</button>
            <div className={styles.dropdownContent}>
              <a href="#">Profile</a>
              <a href="#">Settings</a>
              <a href="#">Logout</a>
            </div>
          </div>
          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Region ▼</button>
            <div className={styles.dropdownContent}>
              <a href="#">Profile</a>
              <a href="#">Settings</a>
              <a href="#">Logout</a>
            </div>
          </div>
          <Link href="career">
            <div className="">Care homes</div>
          </Link>
          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Services offered ▼</button>
            <div className={styles.dropdownContent}>
              <a href="#">Profile</a>
              <a href="#">Settings</a>
              <a href="#">Logout</a>
            </div>
          </div>
        </div>
      </div>
      <div className="">Contact Us</div>
    </div>
  );
}
