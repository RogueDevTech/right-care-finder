"use client";

import styles from "../navbar/styles.module.scss";
import Image from "next/image";
import AppLogo from "@/../public/logo.svg";
import Link from "next/link";
import { CloseBtn, DropIcon, MenuIcon } from "../icon";
import { ISession } from "@/interfaces";
import { useState, useEffect } from "react";
import {
  useHealthcareHomesActions,
  CareType,
  Specialization,
  RegionStatistics,
} from "@/actions-client/healthcare-homes";
import { logout } from "@/actions-server";
import { useAuthStore } from "@/store/auth.store";

export default function NavBar({ session }: { session?: ISession }) {
  const { clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      // Clear auth store
      clearAuth();
      // Call server logout action (which will destroy session and redirect)
      await logout();
    } catch {
      window.location.href = "/";
    }
  };
  const [careTypeOpen, setCareTypeOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [servicesOfferedOpen, setServicesOfferedOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [careTypes, setCareTypes] = useState<CareType[]>([]);
  const [isLoadingCareTypes, setIsLoadingCareTypes] = useState(true);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [isLoadingSpecializations, setIsLoadingSpecializations] =
    useState(true);
  const [regionStats, setRegionStats] = useState<RegionStatistics[]>([]);
  const [isLoadingRegionStats, setIsLoadingRegionStats] = useState(true);

  const { getCareTypes, getSpecializations, getRegionStatistics } =
    useHealthcareHomesActions();

  useEffect(() => {
    const fetchCareTypes = async () => {
      try {
        setIsLoadingCareTypes(true);
        const result = await getCareTypes();

        if (result.success && result.data) {
          setCareTypes(result.data);
        } else {
          console.error("Failed to fetch care types:", result.error);
        }
      } catch (error) {
        console.error("Error fetching care types:", error);
      } finally {
        setIsLoadingCareTypes(false);
      }
    };

    const fetchSpecializations = async () => {
      try {
        setIsLoadingSpecializations(true);
        const result = await getSpecializations();
        if (result.success && result.data) {
          setSpecializations(result.data);
        } else {
          console.error("Failed to fetch specializations:", result.error);
        }
      } catch (error) {
        console.error("Error fetching specializations:", error);
      } finally {
        setIsLoadingSpecializations(false);
      }
    };

    const fetchRegionStats = async () => {
      try {
        setIsLoadingRegionStats(true);
        const result = await getRegionStatistics();
        if (result.success && result.data) {
          setRegionStats(result.data);
        } else {
          console.error("Failed to fetch region statistics:", result.error);
        }
      } catch (error) {
        console.error("Error fetching region statistics:", error);
      } finally {
        setIsLoadingRegionStats(false);
      }
    };

    fetchCareTypes();
    fetchSpecializations();
    fetchRegionStats();
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.leftNav}>
          <Link href="/">
            <div className={styles.logo}>
              <Image src={AppLogo} alt="Right care logo" />
            </div>
          </Link>
          <div className={styles.nav}>
            <div className={styles.dropdown}>
              <button className={styles.dropbtn}>
                Care type <DropIcon fillColor="#f6f6f6" />
              </button>
              <div className={styles.dropdownContent}>
                {isLoadingCareTypes ? (
                  <div>Loading...</div>
                ) : (
                  careTypes.map((careType) => (
                    <a
                      key={careType.id}
                      href={`/care-homes?careTypeId=${careType.id}`}
                    >
                      {careType.name}
                    </a>
                  ))
                )}
              </div>
            </div>
            <div className={styles.dropdown}>
              <button className={styles.dropbtn}>
                Region <DropIcon fillColor="#f6f6f6" />
              </button>
              <div className={styles.dropdownContent}>
                {isLoadingRegionStats ? (
                  <div>Loading...</div>
                ) : (
                  regionStats.map((region) => (
                    <a
                      key={region.region}
                      href={`/care-homes?region=${encodeURIComponent(
                        region.region
                      )}`}
                    >
                      {region.region} ({region.count})
                    </a>
                  ))
                )}
              </div>
            </div>
            <Link href="/care-homes">
              <div className="">Care homes</div>
            </Link>
            <div className={styles.dropdown}>
              <button className={styles.dropbtn}>
                Specialization <DropIcon fillColor="#f6f6f6" />
              </button>
              <div className={styles.dropdownContent}>
                {isLoadingSpecializations ? (
                  <div>Loading...</div>
                ) : (
                  specializations.map((specialization) => (
                    <a
                      key={specialization.id}
                      href={`/care-homes?specializations=${encodeURIComponent(
                        specialization.name
                      )}`}
                    >
                      {specialization.name}
                    </a>
                  ))
                )}
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
                  {session.user?.role === "admin" && (
                    <Link href="/admin" className={styles.profileLink}>
                      Admin
                    </Link>
                  )}
                  {session.user?.role === "owner" && (
                    <Link href="/owner" className={styles.profileLink}>
                      Dashboard
                    </Link>
                  )}
                  {/* Debug: Uncomment to see current role */}
                  {/* {console.log("Current user role:", session.user?.role)} */}
                  <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
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
          <div className={styles.menuButton} onClick={() => setOpenModal(!openModal)}>
            <MenuIcon />
          </div>
          {openModal && (
            <>
              <div className={styles.menuBackdrop} onClick={() => setOpenModal(false)}></div>
              <div className={styles.menuDropdown}>
              <div className={styles.menuHeader}>
                <div className={styles.logo}>
                  <Image src={AppLogo} alt="Right care logo" />
                </div>
                <div className={styles.closeButton} onClick={() => setOpenModal(!openModal)}>
                  <CloseBtn />
                </div>
              </div>
              <div className={styles.menuContainer}>
                <div className={styles.menuContent}>
                  {session?.isLoggedIn && (
                    <div className={styles.mobileProfileSection}>
                      <div className={styles.mobileProfileInfo}>
                        <div className={styles.mobileAvatar}>
                          <span className={styles.avatarText}>
                            {session.user?.firstName?.charAt(0) || "U"}
                            {session.user?.lastName?.charAt(0) || ""}
                          </span>
                        </div>
                        <div className={styles.mobileUserInfo}>
                          <span className={styles.mobileUserName}>
                            {session.user?.firstName} {session.user?.lastName}
                          </span>
                          <span className={styles.mobileUserEmail}>
                            {session.user?.email}
                          </span>
                        </div>
                      </div>
                      <div className={styles.mobileProfileActions}>
                        {session.user?.role === "admin" && (
                          <Link 
                            href="/admin" 
                            className={styles.mobileProfileLink}
                            onClick={() => setOpenModal(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        {session.user?.role === "owner" && (
                          <Link 
                            href="/owner" 
                            className={styles.mobileProfileLink}
                            onClick={() => setOpenModal(false)}
                          >
                            Owner Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleLogout();
                            setOpenModal(false);
                          }}
                          className={styles.mobileLogoutButton}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                  {!session?.isLoggedIn && (
                    <Link 
                      href="/login" 
                      className={styles.mobileLoginLink}
                      onClick={() => setOpenModal(false)}
                    >
                      Login
                    </Link>
                  )}
                  <div className={styles.mobileNav}>
                    <div
                      className={styles.navName}
                      onClick={() => setCareTypeOpen(!careTypeOpen)}
                    >
                      <p>Care type</p>
                      <DropIcon fillColor="#f6f6f6" />
                    </div>
                    {careTypeOpen && (
                      <div className={styles.careTypeDropdown}>
                        {isLoadingCareTypes ? (
                          <div>Loading...</div>
                        ) : (
                          careTypes.map((careType) => (
                            <Link
                              key={careType.id}
                              href={`/search?careTypeId=${careType.id}`}
                              className={styles.profileLink}
                              onClick={() => setOpenModal(false)}
                            >
                              {careType.name}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles.mobileNav}>
                    <div
                      className={styles.navName}
                      onClick={() => setRegionOpen(!regionOpen)}
                    >
                      <p>Region</p>
                      <DropIcon fillColor="#f6f6f6" />
                    </div>
                    {regionOpen && (
                      <div className={styles.careTypeDropdown}>
                        {isLoadingRegionStats ? (
                          <div>Loading...</div>
                        ) : (
                          regionStats.map((region) => (
                            <Link
                              key={region.region}
                              href={`/search?region=${encodeURIComponent(
                                region.region
                              )}`}
                              className={styles.profileLink}
                              onClick={() => setOpenModal(false)}
                            >
                              {region.region} ({region.count})
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <Link 
                    href="/care-homes" 
                    className={styles.profileLink}
                    onClick={() => setOpenModal(false)}
                  >
                    Care homes
                  </Link>
                  <div className={styles.mobileNav}>
                    <div
                      className={styles.navName}
                      onClick={() =>
                        setServicesOfferedOpen(!servicesOfferedOpen)
                      }
                    >
                      <p>Specialization</p>
                      <DropIcon fillColor="#f6f6f6" />
                    </div>
                    {servicesOfferedOpen && (
                      <div className={styles.careTypeDropdown}>
                        {isLoadingSpecializations ? (
                          <div>Loading...</div>
                        ) : (
                          specializations.map((specialization) => (
                            <Link
                              key={specialization.id}
                              href={`/care-homes?specializations=${encodeURIComponent(
                                specialization.name
                              )}`}
                              className={styles.profileLink}
                              onClick={() => setOpenModal(false)}
                            >
                              {specialization.name}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
