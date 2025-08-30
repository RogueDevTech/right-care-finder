"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./owner-layout.module.scss";

interface OwnerLayoutProps {
  children: React.ReactNode;
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  return (
    <div className={styles.ownerLayout}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          sidebarCollapsed ? styles.collapsed : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Care Home</span>
            <span className={styles.logoSubtext}>Owner Dashboard</span>
          </div>
          <button className={styles.sidebarToggle} onClick={toggleSidebar}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 3h14v2H1V3zm0 4h14v2H1V7zm0 4h14v2H1v-2z" />
            </svg>
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>
            <h3 className={styles.navTitle}>Overview</h3>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link
                  href="/owner"
                  className={`${styles.navLink} ${
                    isActiveLink("/owner") ? styles.active : ""
                  }`}
                >
                  <svg
                    className={styles.navIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                  </svg>
                  <span className={styles.navText}>Dashboard</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/" className={styles.navLink}>
                  <svg
                    className={styles.navIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                  <span className={styles.navText}>View Public Site</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <h3 className={styles.navTitle}>Care Home Management</h3>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link
                  href="/owner/profile"
                  className={`${styles.navLink} ${
                    isActiveLink("/owner/profile") ? styles.active : ""
                  }`}
                >
                  <svg
                    className={styles.navIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span className={styles.navText}>Profile</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/owner/bookings"
                  className={`${styles.navLink} ${
                    isActiveLink("/owner/bookings") ? styles.active : ""
                  }`}
                >
                  <svg
                    className={styles.navIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                  </svg>
                  <span className={styles.navText}>Bookings</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/owner/enquiries"
                  className={`${styles.navLink} ${
                    isActiveLink("/owner/enquiries") ? styles.active : ""
                  }`}
                >
                  <svg
                    className={styles.navIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                  <span className={styles.navText}>Enquiries</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/owner/reviews"
                  className={`${styles.navLink} ${
                    isActiveLink("/owner/reviews") ? styles.active : ""
                  }`}
                >
                  <svg
                    className={styles.navIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className={styles.navText}>Reviews</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <h3 className={styles.navTitle}>Settings</h3>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link
                  href="/owner/settings"
                  className={`${styles.navLink} ${
                    isActiveLink("/owner/settings") ? styles.active : ""
                  }`}
                >
                  <svg
                    className={styles.navIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                  </svg>
                  <span className={styles.navText}>Settings</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <button
                  className={`${styles.navLink} ${styles.logoutNavLink}`}
                  onClick={() => {
                    // TODO: Implement logout logic
                    console.log("Logout clicked");
                    router.push("/");
                  }}
                >
                  <svg
                    className={styles.navIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </svg>
                  <span className={styles.navText}>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Navbar */}
        <header className={styles.topNavbar}>
          <div className={styles.navbarLeft}>
            <button className={styles.menuToggle} onClick={toggleSidebar}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              </svg>
            </button>
            <div className={styles.breadcrumb}>
              <span className={styles.breadcrumbText}>
                {pathname === "/owner" && "Dashboard"}
                {pathname === "/owner/profile" && "Care Home Profile"}
                {pathname === "/owner/bookings" && "Bookings Management"}
                {pathname === "/owner/enquiries" && "Enquiries"}
                {pathname === "/owner/reviews" && "Reviews & Ratings"}
                {pathname === "/owner/settings" && "Settings"}
              </span>
            </div>
          </div>

          <div className={styles.navbarRight}>
            <div className={styles.navbarActions}>
              <button className={styles.actionButton}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              </button>
              <div className={styles.userMenu}>
                <button className={styles.userButton}>
                  <div className={styles.userAvatar}>
                    <span>CO</span>
                  </div>
                  <span className={styles.userName}>Care Home Owner</span>
                  <svg
                    className={styles.dropdownIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
}
