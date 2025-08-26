"use client";

import styles from "../navbar/styles.module.scss";
import Image from "next/image";
import AppLogo from "@/../public/right-care-logo.png";
import Link from "next/link";
import { DropIcon, MenuIcon } from "../icon";
import { ISession } from "@/interfaces";

export default function NavBar({ session }: { session?: ISession }) {
  const handleLogout = () => {};

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
            <button className={styles.dropbtn}>
              Care type <DropIcon />
            </button>
            <div className={styles.dropdownContent}>
              <a href="#">Residential Care Homes</a>
              <a href="#">Nursing Care Homes</a>
              <a href="#">Dementia Care Homes</a>
              <a href="#">Respite Care</a>
              <a href="#">Palliative / End-of-life Care</a>
              <a href="#">Assisted Living</a>
              <a href="#">Day Care Services</a>
            </div>
          </div>
          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>
              Region <DropIcon />
            </button>
            <div className={styles.dropdownContent}>
              <div className={styles.dropdownRegion}>
                <div className={styles.region}>
                  <h3>England</h3>
                  <div className="">
                    <a href="#">London</a>
                    <a href="#">South East</a>
                    <a href="#">South West</a>
                    <a href="#">East of England</a>
                    <a href="#">West Midlands</a>
                    <a href="#">Yorkshire & Humber</a>
                    <a href="#">North West</a>
                  </div>
                </div>
                <div className={styles.region}>
                  <h3>Scotland</h3>
                  <div className="">
                    <a href="#">Edinburgh</a>
                    <a href="#">Glasgow</a>
                    <a href="#">Aberdeen</a>
                    <a href="#">Highlands & Islands</a>
                  </div>
                </div>
                <div className={styles.region}>
                  <h3>Wales</h3>
                  <div className="">
                    <a href="#">Cardiff</a>
                    <a href="#">Swansea</a>
                    <a href="#">North Wales</a>
                    <a href="#">South Wales</a>
                  </div>
                </div>
                <div className={styles.region}>
                  <h3>Northern Ireland</h3>
                  <div className="">
                    <a href="#">Belfast</a>
                    <a href="#">Derry / Londonderry</a>
                    <a href="#">Antrim</a>
                    <a href="#">Armagh</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link href="career">
            <div className="">Care homes</div>
          </Link>
          <div className={styles.dropdown}>
            <button className={styles.dropbtn}>
              Services offered <DropIcon />
            </button>
            <div className={styles.dropdownContent}>
              <a href="#">24/7 Nursing Support</a>
              <a href="#">Personal Care Assistance</a>
              <a href="#">Dementia & Alzheimer’s Support</a>
              <a href="#">Palliative Care Services</a>
              <a href="#">Meals & Nutrition Plans</a>
              <a href="#">Physiotherapy & Rehabilitation</a>
              <a href="#">Social & Recreational Activities</a>
              <a href="#">Housekeeping & Laundry Services</a>
              <a href="#">Transportation & Mobility Support</a>
              <a href="#">Visiting Doctors / Medical Professionals</a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.rightNav}>
        {session?.isLoggedIn ? (
          <div className={styles.profileSection}>
            <div className={styles.profileAvatar}>
              <span className={styles.avatarText}>
                {session.user?.firstName?.charAt(0) || "U"}
                {session.user?.lastName?.charAt(0) || ""}
              </span>
            </div>
            <div className={styles.profileDropdown}>
              <div className={styles.profileInfo}>
                <span className={styles.userName}>
                  {session.user?.firstName} {session.user?.lastName}
                </span>
              </div>
              <div className={styles.profileActions}>
                <Link href="/" className={styles.profileLink}>
                  Profile
                </Link>
                {session.user?.role === "admin" && (
                  <Link href="/admin" className={styles.profileLink}>
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link href="/login">
            <div className={styles.contactUs}>Login</div>
          </Link>
        )}
      </div>
      <div className={styles.menuIcon}>
        <MenuIcon />
      </div>
    </div>
  );
}
