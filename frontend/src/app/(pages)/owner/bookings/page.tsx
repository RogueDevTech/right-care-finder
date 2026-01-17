"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/button";
import { useUserActions, Booking } from "@/actions-client/user";
import styles from "./bookings.module.scss";

export default function OwnerBookingsPage() {
  const { getMyBookings, updateBookingStatus } = useUserActions();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "confirmed" | "cancelled" | "completed"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock data for demonstration - remove when backend is ready
  const mockBookings: Booking[] = [
    {
      id: "1",
      residentName: "John Smith",
      contactName: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+44 20 1234 5678",
      checkInDate: "2024-03-01",
      checkOutDate: undefined,
      status: "pending",
      roomType: "Single Room",
      specialRequirements: "Wheelchair accessible room required",
      createdAt: "2024-01-15T10:30:00Z",
      careHomeName: "Sunshine Care Home",
    },
    {
      id: "2",
      residentName: "Mary Johnson",
      contactName: "Robert Johnson",
      email: "robert.j@example.com",
      phone: "+44 20 9876 5432",
      checkInDate: "2024-02-15",
      status: "confirmed",
      roomType: "Double Room",
      createdAt: "2024-01-10T14:20:00Z",
      careHomeName: "Sunshine Care Home",
    },
    {
      id: "3",
      residentName: "David Brown",
      contactName: "Sarah Brown",
      email: "sarah.brown@example.com",
      phone: "+44 20 5555 1234",
      checkInDate: "2024-01-20",
      checkOutDate: "2024-02-20",
      status: "completed",
      roomType: "Single Room",
      createdAt: "2023-12-20T09:15:00Z",
      careHomeName: "Sunshine Care Home",
    },
  ];

  useEffect(() => {
    fetchBookings();
  }, [filterStatus, searchTerm]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const result = await getMyBookings({
        status: filterStatus === "all" ? undefined : filterStatus,
        search: searchTerm || undefined,
      });

      if (result.success && result.data) {
        // Use mock data for now since backend endpoint is not ready
        // Replace with result.data when API is implemented
        setBookings(result.data.length > 0 ? result.data : mockBookings);
      } else {
        // Use mock data as fallback
        setBookings(mockBookings);
        if (result.error) {
          console.warn("Using mock data:", result.error);
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Use mock data as fallback
      setBookings(mockBookings);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;
    const matchesSearch =
      !searchTerm ||
      booking.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return styles.statusPending;
      case "confirmed":
        return styles.statusConfirmed;
      case "cancelled":
        return styles.statusCancelled;
      case "completed":
        return styles.statusCompleted;
      default:
        return "";
    }
  };

  const getStatusLabel = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "cancelled":
        return "Cancelled";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    setIsUpdating(true);
    try {
      const result = await updateBookingStatus(bookingId, "confirmed");
      if (result.success) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "confirmed" as const }
              : booking
          )
        );
        toast.success("Booking confirmed successfully!");
      } else {
        toast.error(result.error || "Failed to confirm booking");
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error("Failed to confirm booking");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to reject this booking?")) {
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateBookingStatus(bookingId, "cancelled");
      if (result.success) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "cancelled" as const }
              : booking
          )
        );
        toast.success("Booking rejected");
      } else {
        toast.error(result.error || "Failed to reject booking");
      }
    } catch (error) {
      console.error("Error rejecting booking:", error);
      toast.error("Failed to reject booking");
    } finally {
      setIsUpdating(false);
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Bookings Management</h1>
          <p>Manage reservations and booking requests for your care home</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Total Bookings</h3>
            <p className={styles.statNumber}>{stats.total}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Pending</h3>
            <p className={styles.statNumber}>{stats.pending}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Confirmed</h3>
            <p className={styles.statNumber}>{stats.confirmed}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Completed</h3>
            <p className={styles.statNumber}>{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${
              filterStatus === "all" ? styles.active : ""
            }`}
            onClick={() => setFilterStatus("all")}
          >
            All ({stats.total})
          </button>
          <button
            className={`${styles.filterTab} ${
              filterStatus === "pending" ? styles.active : ""
            }`}
            onClick={() => setFilterStatus("pending")}
          >
            Pending ({stats.pending})
          </button>
          <button
            className={`${styles.filterTab} ${
              filterStatus === "confirmed" ? styles.active : ""
            }`}
            onClick={() => setFilterStatus("confirmed")}
          >
            Confirmed ({stats.confirmed})
          </button>
          <button
            className={`${styles.filterTab} ${
              filterStatus === "completed" ? styles.active : ""
            }`}
            onClick={() => setFilterStatus("completed")}
          >
            Completed ({stats.completed})
          </button>
          <button
            className={`${styles.filterTab} ${
              filterStatus === "cancelled" ? styles.active : ""
            }`}
            onClick={() => setFilterStatus("cancelled")}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📅</div>
          <h3>No bookings found</h3>
          <p>
            {searchTerm || filterStatus !== "all"
              ? "No bookings match your search criteria."
              : "You don't have any bookings yet. Bookings will appear here when customers make reservations."}
          </p>
        </div>
      ) : (
        <div className={styles.bookingsList}>
          {filteredBookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <div className={styles.bookingTitle}>
                  <h3>{booking.residentName}</h3>
                  <span
                    className={`${styles.statusBadge} ${getStatusBadgeClass(
                      booking.status
                    )}`}
                  >
                    {getStatusLabel(booking.status)}
                  </span>
                </div>
                <div className={styles.bookingDate}>
                  <span className={styles.dateLabel}>Requested:</span>
                  <span>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className={styles.bookingDetails}>
                <div className={styles.detailRow}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Contact Person</span>
                    <span className={styles.detailValue}>
                      {booking.contactName}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Email</span>
                    <span className={styles.detailValue}>{booking.email}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Phone</span>
                    <span className={styles.detailValue}>{booking.phone}</span>
                  </div>
                </div>

                <div className={styles.detailRow}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Check-in Date</span>
                    <span className={styles.detailValue}>
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </span>
                  </div>
                  {booking.checkOutDate && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Check-out Date</span>
                      <span className={styles.detailValue}>
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Room Type</span>
                    <span className={styles.detailValue}>
                      {booking.roomType}
                    </span>
                  </div>
                </div>

                {booking.specialRequirements && (
                  <div className={styles.specialRequirements}>
                    <span className={styles.detailLabel}>
                      Special Requirements
                    </span>
                    <p>{booking.specialRequirements}</p>
                  </div>
                )}
              </div>

              {booking.status === "pending" && (
                <div className={styles.bookingActions}>
                  <Button
                    variant="secondary"
                    onClick={() => handleRejectBooking(booking.id)}
                    disabled={isUpdating}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleAcceptBooking(booking.id)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Processing..." : "Accept & Confirm"}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
