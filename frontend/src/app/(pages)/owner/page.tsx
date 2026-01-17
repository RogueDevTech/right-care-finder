"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUserActions } from "@/actions-client/user";
import { CareHome } from "@/actions-client/healthcare-homes";
import styles from "./owner.module.scss";
import billingStyles from "./billing/billing.module.scss";

interface DashboardCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

interface LeadStats {
  totalViews: number;
  totalClicks: number;
  totalEnquiries: number;
  thisMonth: {
    views: number;
    clicks: number;
    enquiries: number;
  };
}

interface Subscription {
  tier: string;
  status: "active" | "cancelled" | "expired";
}

export default function OwnerDashboardPage() {
  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getMyCareHomes } = useUserActions();

  // Mock subscription data - replace with actual API call
  const [currentSubscription] = useState<Subscription | null>({
    tier: "featured",
    status: "active",
  });

  // Mock lead stats - replace with actual API call
  const [leadStats] = useState<LeadStats>({
    totalViews: 1247,
    totalClicks: 342,
    totalEnquiries: 28,
    thisMonth: {
      views: 156,
      clicks: 43,
      enquiries: 5,
    },
  });

  useEffect(() => {
    fetchCareHome();
  }, []);

  const fetchCareHome = async () => {
    try {
      setIsLoading(true);
      const result = await getMyCareHomes();
      if (result.success && result.data) {
        const homes = result.data;
        if (homes.length > 0) {
          setCareHome(homes[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching care home:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardCards: DashboardCard[] = [
    {
      title: "My Care Home",
      description: "Manage your care home listing, details, and information",
      href: "/owner/care-home",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
      color: "#1c7c8a",
    },
    {
      title: "Billing",
      description: "View invoices, payments, and billing history",
      href: "/owner/billing",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
        </svg>
      ),
      color: "#059669",
    },
    {
      title: "Bookings",
      description: "Manage reservations and booking requests",
      href: "/owner/bookings",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
        </svg>
      ),
      color: "#2563eb",
    },
    {
      title: "Enquiries",
      description: "View and respond to care home enquiries",
      href: "/owner/enquiries",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
      ),
      color: "#7c3aed",
    },
    {
      title: "Reviews",
      description: "View and manage customer reviews and ratings",
      href: "/owner/reviews",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ),
      color: "#f59e0b",
    },
    {
      title: "Settings",
      description: "Manage your account settings and preferences",
      href: "/owner/settings",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
        </svg>
      ),
      color: "#6b7280",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Dashboard</h1>
          <p>Welcome to your care home management dashboard</p>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <div className={styles.dashboardContent}>
          {/* Lead Analytics */}
          {currentSubscription &&
            currentSubscription.tier !== "free" &&
            currentSubscription.status === "active" && (
              <div className={billingStyles.analyticsCard}>
                <h2>Lead Analytics</h2>
                <p className={billingStyles.analyticsDescription}>
                  Track your listing performance and ROI
                </p>

                <div className={billingStyles.statsGrid}>
                  <div className={billingStyles.statCard}>
                    <div className={billingStyles.statIcon}>👁️</div>
                    <div className={billingStyles.statContent}>
                      <h3>{leadStats.totalViews.toLocaleString()}</h3>
                      <p>Total Views</p>
                      <span className={billingStyles.statChange}>
                        {leadStats.thisMonth.views} this month
                      </span>
                    </div>
                  </div>

                  <div className={billingStyles.statCard}>
                    <div className={billingStyles.statIcon}>👆</div>
                    <div className={billingStyles.statContent}>
                      <h3>{leadStats.totalClicks.toLocaleString()}</h3>
                      <p>Total Clicks</p>
                      <span className={billingStyles.statChange}>
                        {leadStats.thisMonth.clicks} this month
                      </span>
                    </div>
                  </div>

                  <div className={billingStyles.statCard}>
                    <div className={billingStyles.statIcon}>📧</div>
                    <div className={billingStyles.statContent}>
                      <h3>{leadStats.totalEnquiries.toLocaleString()}</h3>
                      <p>Total Enquiries</p>
                      <span className={billingStyles.statChange}>
                        {leadStats.thisMonth.enquiries} this month
                      </span>
                    </div>
                  </div>

                  <div className={billingStyles.statCard}>
                    <div className={billingStyles.statIcon}>💰</div>
                    <div className={billingStyles.statContent}>
                      <h3>
                        £
                        {(
                          leadStats.totalEnquiries *
                          (currentSubscription.tier === "pay-per-lead"
                            ? 45
                            : 35)
                        ).toLocaleString()}
                      </h3>
                      <p>Estimated Value</p>
                      <span className={billingStyles.statChange}>
                        Based on lead quality
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          <div className={styles.dashboardGrid}>
            {dashboardCards.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                className={styles.dashboardCard}
                style={{ "--card-color": card.color } as React.CSSProperties}
              >
                <div className={styles.cardIcon} style={{ color: card.color }}>
                  {card.icon}
                </div>
                <div className={styles.cardContent}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
                <div className={styles.cardArrow}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
