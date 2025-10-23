"use client";

import { useState, useEffect } from "react";
import OwnerLayout from "@/components/layout/owner-layout";
import styles from "./owner-dashboard.module.scss";

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  totalEnquiries: number;
  unreadEnquiries: number;
  averageRating: number;
  totalReviews: number;
  availableBeds: number;
  totalBeds: number;
}

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    totalEnquiries: 0,
    unreadEnquiries: 0,
    averageRating: 0,
    totalReviews: 0,
    availableBeds: 0,
    totalBeds: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch actual dashboard data from API
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setStats({
          totalBookings: 24,
          pendingBookings: 3,
          totalEnquiries: 12,
          unreadEnquiries: 2,
          averageRating: 4.2,
          totalReviews: 18,
          availableBeds: 8,
          totalBeds: 25,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return styles.excellent;
    if (rating >= 4.0) return styles.good;
    if (rating >= 3.0) return styles.average;
    return styles.poor;
  };

  if (isLoading) {
    return (
      <OwnerLayout>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <div className={styles.dashboardContainer}>
        <div className={styles.header}>
          <h1>Welcome to Your Care Home Dashboard</h1>
          <p>
            Manage your care home, bookings, and enquiries all in one place.
          </p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <h3>Total Bookings</h3>
              <p className={styles.statNumber}>{stats.totalBookings}</p>
              <span className={styles.statSubtext}>
                {stats.pendingBookings} pending
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <h3>Enquiries</h3>
              <p className={styles.statNumber}>{stats.totalEnquiries}</p>
              <span className={styles.statSubtext}>
                {stats.unreadEnquiries} unread
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <h3>Average Rating</h3>
              <p
                className={`${styles.statNumber} ${getRatingColor(
                  stats.averageRating
                )}`}
              >
                {stats.averageRating.toFixed(1)}
              </p>
              <span className={styles.statSubtext}>
                {stats.totalReviews} reviews
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <h3>Available Beds</h3>
              <p className={styles.statNumber}>{stats.availableBeds}</p>
              <span className={styles.statSubtext}>
                of {stats.totalBeds} total
              </span>
            </div>
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <div className={styles.section}>
              <h2>Recent Activity</h2>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                    </svg>
                  </div>
                  <div className={styles.activityContent}>
                    <h4>New booking request</h4>
                    <p>
                      John Smith requested a booking for 2 weeks starting March
                      15th
                    </p>
                    <span className={styles.activityTime}>2 hours ago</span>
                  </div>
                </div>

                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                  <div className={styles.activityContent}>
                    <h4>New review received</h4>
                    <p>Sarah Johnson left a 5-star review for your care home</p>
                    <span className={styles.activityTime}>1 day ago</span>
                  </div>
                </div>

                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                    </svg>
                  </div>
                  <div className={styles.activityContent}>
                    <h4>New enquiry</h4>
                    <p>Maria Garcia enquired about dementia care services</p>
                    <span className={styles.activityTime}>2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.section}>
              <h2>Quick Actions</h2>
              <div className={styles.quickActions}>
                <button className={styles.actionButton}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  Add New Booking
                </button>
                <button className={styles.actionButton}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Update Availability
                </button>
                <button className={styles.actionButton}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
                  </svg>
                  View Reports
                </button>
              </div>
            </div>

            <div className={styles.section}>
              <h2>Upcoming Events</h2>
              <div className={styles.eventsList}>
                <div className={styles.eventItem}>
                  <div className={styles.eventDate}>
                    <span className={styles.eventDay}>15</span>
                    <span className={styles.eventMonth}>Mar</span>
                  </div>
                  <div className={styles.eventContent}>
                    <h4>New resident arrival</h4>
                    <p>Margaret Wilson - Room 12</p>
                  </div>
                </div>

                <div className={styles.eventItem}>
                  <div className={styles.eventDate}>
                    <span className={styles.eventDay}>18</span>
                    <span className={styles.eventMonth}>Mar</span>
                  </div>
                  <div className={styles.eventContent}>
                    <h4>Care assessment</h4>
                    <p>Annual review for Room 8</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
