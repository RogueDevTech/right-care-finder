"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AdminLayout from "@/components/layout/admin-layout";
import styles from "./users.module.scss";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // TODO: Replace with actual API call
      const mockUsers: User[] = [
        {
          id: "1",
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          role: "user",
          isEmailVerified: true,
          isActive: true,
          createdAt: "2024-01-15T10:30:00Z",
          lastLoginAt: "2024-01-20T14:20:00Z",
        },
        {
          id: "2",
          email: "jane.smith@example.com",
          firstName: "Jane",
          lastName: "Smith",
          role: "provider",
          isEmailVerified: true,
          isActive: true,
          createdAt: "2024-01-14T09:15:00Z",
          lastLoginAt: "2024-01-19T16:45:00Z",
        },
        {
          id: "3",
          email: "admin@rightcarefinder.com",
          firstName: "Admin",
          lastName: "User",
          role: "admin",
          isEmailVerified: true,
          isActive: true,
          createdAt: "2024-01-10T08:00:00Z",
          lastLoginAt: "2024-01-20T10:30:00Z",
        },
      ];

      setUsers(mockUsers);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      // TODO: Replace with actual API call
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );
      toast.success(
        `User ${currentStatus ? "deactivated" : "activated"} successfully`
      );
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // TODO: Replace with actual API call
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.usersContainer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/admin" className={styles.backButton}>
              ← Back to Dashboard
            </Link>
            <h1>User Management</h1>
          </div>
          <button className={styles.addButton}>+ Add New User</button>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.roleFilter}>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="provider">Providers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className={styles.usersTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Name</div>
            <div className={styles.headerCell}>Email</div>
            <div className={styles.headerCell}>Role</div>
            <div className={styles.headerCell}>Status</div>
            <div className={styles.headerCell}>Verified</div>
            <div className={styles.headerCell}>Last Login</div>
            <div className={styles.headerCell}>Actions</div>
          </div>

          {filteredUsers.map((user) => (
            <div key={user.id} className={styles.tableRow}>
              <div className={styles.cell}>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </div>
                  <div>
                    <div className={styles.userName}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className={styles.userId}>ID: {user.id}</div>
                  </div>
                </div>
              </div>

              <div className={styles.cell}>
                <div className={styles.email}>{user.email}</div>
              </div>

              <div className={styles.cell}>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className={styles.roleSelect}
                >
                  <option value="user">User</option>
                  <option value="provider">Provider</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className={styles.cell}>
                <span
                  className={`${styles.status} ${
                    user.isActive ? styles.active : styles.inactive
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className={styles.cell}>
                <span
                  className={`${styles.verified} ${
                    user.isEmailVerified ? styles.verified : styles.unverified
                  }`}
                >
                  {user.isEmailVerified ? "✓ Verified" : "✗ Unverified"}
                </span>
              </div>

              <div className={styles.cell}>
                <div className={styles.lastLogin}>
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleDateString()
                    : "Never"}
                </div>
              </div>

              <div className={styles.cell}>
                <div className={styles.actions}>
                  <button
                    onClick={() => handleStatusToggle(user.id, user.isActive)}
                    className={`${styles.actionButton} ${
                      user.isActive ? styles.deactivate : styles.activate
                    }`}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button className={styles.actionButton}>Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className={styles.emptyState}>
            <p>No users found matching your criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
