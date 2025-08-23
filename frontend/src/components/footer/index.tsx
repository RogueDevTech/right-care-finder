import Image from "next/image";
import RightCareLogo from "@/../public/footer-logo.png";
import styles from "./style.module.scss";
export default function Footer() {
  return (
    <div className={styles.wrapper}>
      <footer className={styles.footer}>
        <div className={styles.mobile}>
          <Image src={RightCareLogo} alt="right care logo" />
        </div>
        <ul>
          <li>Privacy Policy</li>
          <li>Cookies</li>
          <li>Terms and Condition</li>
        </ul>
        <div className="">
          <div className={styles.logo}>
            <Image src={RightCareLogo} alt="right care logo" />
          </div>
          <p>Copyright @2025 Rightcarefounder | all right reserved</p>
        </div>
        <ul>
          <li>Instagram</li>
          <li>Facebook</li>
          <li>Tiktok</li>
        </ul>
        <p className={styles.mobileCopyright}>
          Copyright @2025 Rightcarefounder | all right reserver
        </p>
      </footer>
    </div>
  );
}
