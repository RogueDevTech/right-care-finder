"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./admin-layout.module.scss";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          sidebarCollapsed ? styles.collapsed : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Right Care</span>
            <span className={styles.logoSubtext}>Finder</span>
          </div>
          <button className={styles.sidebarToggle} onClick={toggleSidebar}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 3h14v2H1V3zm0 4h14v2H1V7zm0 4h14v2H1v-2z" />
            </svg>
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>
            <h3 className={styles.navTitle}>Main</h3>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link
                  href="/admin"
                  className={`${styles.navLink} ${
                    isActiveLink("/admin") ? styles.active : ""
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
                  <span className={styles.navText}>Go Back Home</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <h3 className={styles.navTitle}>Management</h3>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link
                  href="/admin/users"
                  className={`${styles.navLink} ${
                    isActiveLink("/admin/users") ? styles.active : ""
                  }`}
                >
                  <svg
                    className={styles.navIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26V15h-1.5v-3.5l-1.7-2.26A2.5 2.5 0 0 0 8.54 8H7.46c-.8 0-1.54.37-2.01 1L2.96 16.5H5.5V22h2v-6h1.5v6h2V16h1.5v6h2V16H16v6h2z" />
                  </svg>
                  <span className={styles.navText}>Users</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/admin/care-homes"
                  className={`${styles.navLink} ${
                    isActiveLink("/admin/care-homes") ? styles.active : ""
                  }`}
                >
                  <svg
                    className={styles.navIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                  <span className={styles.navText}>Care Homes</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/admin/reviews"
                  className={`${styles.navLink} ${
                    isActiveLink("/admin/reviews") ? styles.active : ""
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
              <li className={styles.navItem}>
                <Link
                  href="/admin/analytics"
                  className={`${styles.navLink} ${
                    isActiveLink("/admin/analytics") ? styles.active : ""
                  }`}
                >
                  <svg
                    className={styles.navIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                  </svg>
                  <span className={styles.navText}>Analytics</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <h3 className={styles.navTitle}>Settings</h3>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link
                  href="/admin/settings"
                  className={`${styles.navLink} ${
                    isActiveLink("/admin/settings") ? styles.active : ""
                  }`}
                >
                  <svg
                    className={styles.navIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
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
                {pathname === "/admin" && "Dashboard"}
                {pathname === "/admin/users" && "User Management"}
                {pathname === "/admin/care-homes" && "Care Home Management"}
                {pathname === "/admin/reviews" && "Reviews & Ratings"}
                {pathname === "/admin/analytics" && "Analytics & Reports"}
                {pathname === "/admin/settings" && "Settings"}
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
                    <span>AD</span>
                  </div>
                  <span className={styles.userName}>Admin User</span>
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
