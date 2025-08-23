"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AdminLayout from "@/components/layout/admin-layout";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import styles from "./admin.module.scss";

interface DashboardStats {
  totalUsers: number;
  totalCareHomes: number;
  activeCareHomes: number;
  verifiedCareHomes: number;
  recentCareHomes: Array<{
    id: string;
    name: string;
    status: string;
    createdAt: string;
  }>;
  activeUsers: number;
  totalReviews: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin

    // TODO: Verify admin role with backend
    fetchDashboardStats();
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      // TODO: Replace with actual API call
      const mockStats: DashboardStats = {
        totalUsers: 1250,
        totalCareHomes: 89,
        activeCareHomes: 76,
        verifiedCareHomes: 65,
        recentCareHomes: [
          {
            id: "1",
            name: "Sunset Care Home",
            status: "Active",
            createdAt: "2024-01-15",
          },
          {
            id: "2",
            name: "Golden Years Residence",
            status: "Pending",
            createdAt: "2024-01-14",
          },
          {
            id: "3",
            name: "Comfort Care Center",
            status: "Active",
            createdAt: "2024-01-13",
          },
        ],
        activeUsers: 890,
        totalReviews: 2340,
      };

      setStats(mockStats);
    } catch (error) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.adminContainer}>
        {stats && (
          <div className={styles.statsGrid}>
            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statInfo}>
                  <h3>{stats.totalUsers.toLocaleString()}</h3>
                  <p>Total Users</p>
                </div>
              </div>
            </Card>

            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIcon}>🏠</div>
                <div className={styles.statInfo}>
                  <h3>{stats.totalCareHomes}</h3>
                  <p>Total Care Homes</p>
                </div>
              </div>
            </Card>

            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statInfo}>
                  <h3>{stats.verifiedCareHomes}</h3>
                  <p>Verified Care Homes</p>
                </div>
              </div>
            </Card>

            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIcon}>⭐</div>
                <div className={styles.statInfo}>
                  <h3>{stats.totalReviews.toLocaleString()}</h3>
                  <p>Total Reviews</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className={styles.sectionsGrid}>
          <Card className={styles.sectionCard}>
            <div className={styles.sectionContent}>
              <h2>User Management</h2>
              <p>Manage user accounts, roles, and permissions</p>
              <Button
                variant="primary"
                onClick={() => router.push("/admin/users")}
              >
                Manage Users
              </Button>
            </div>
          </Card>

          <Card className={styles.sectionCard}>
            <div className={styles.sectionContent}>
              <h2>Care Home Management</h2>
              <p>Review, approve, and manage care home listings</p>
              <Button
                variant="primary"
                onClick={() => router.push("/admin/care-homes")}
              >
                Manage Care Homes
              </Button>
            </div>
          </Card>

          <Card className={styles.sectionCard}>
            <div className={styles.sectionContent}>
              <h2>Reviews & Ratings</h2>
              <p>Monitor and moderate user reviews</p>
              <Button
                variant="primary"
                onClick={() => router.push("/admin/reviews")}
              >
                Manage Reviews
              </Button>
            </div>
          </Card>

          <Card className={styles.sectionCard}>
            <div className={styles.sectionContent}>
              <h2>Analytics & Reports</h2>
              <p>View detailed analytics and generate reports</p>
              <Button
                variant="primary"
                onClick={() => router.push("/admin/analytics")}
              >
                View Analytics
              </Button>
            </div>
          </Card>
        </div>

        {stats?.recentCareHomes && (
          <Card title="Recent Care Homes" className={styles.recentSection}>
            <div className={styles.recentList}>
              {stats.recentCareHomes.map((careHome) => (
                <div key={careHome.id} className={styles.recentItem}>
                  <div className={styles.recentInfo}>
                    <h4>{careHome.name}</h4>
                    <p>Added: {careHome.createdAt}</p>
                  </div>
                  <span
                    className={`${styles.status} ${
                      styles[careHome.status.toLowerCase()]
                    }`}
                  >
                    {careHome.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
