"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/button";
import { useUserActions, Enquiry } from "@/actions-client/user";
import styles from "./enquiries.module.scss";

export default function OwnerEnquiriesPage() {
  const { getMyEnquiries, updateEnquiryStatus, replyToEnquiry } =
    useUserActions();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "new" | "read" | "replied" | "archived"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Mock data for demonstration - remove when backend is ready
  const mockEnquiries: Enquiry[] = [
    {
      id: "1",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      phone: "+44 20 1234 5678",
      subject: "Inquiry about dementia care services",
      message:
        "Hi, I'm looking for a care home for my father who has dementia. He requires specialized care and I'd like to know more about your services and availability.",
      status: "new",
      careHomeName: "Sunshine Care Home",
      createdAt: "2024-01-20T10:30:00Z",
      readAt: undefined,
      repliedAt: undefined,
    },
    {
      id: "2",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+44 20 9876 5432",
      subject: "Tour request for next week",
      message:
        "I would like to schedule a tour of your facility for my mother. She needs assisted living services. Please let me know your availability.",
      status: "read",
      careHomeName: "Sunshine Care Home",
      createdAt: "2024-01-18T14:20:00Z",
      readAt: "2024-01-19T09:15:00Z",
      repliedAt: undefined,
    },
    {
      id: "3",
      name: "Emma Johnson",
      email: "emma.j@example.com",
      phone: "+44 20 5555 1234",
      subject: "Pricing information",
      message:
        "Could you please provide detailed pricing information for your care services? I'm interested in both short-term and long-term options.",
      status: "replied",
      careHomeName: "Sunshine Care Home",
      createdAt: "2024-01-15T09:00:00Z",
      readAt: "2024-01-15T10:00:00Z",
      repliedAt: "2024-01-16T11:30:00Z",
    },
    {
      id: "4",
      name: "David Miller",
      email: "david.m@example.com",
      phone: "+44 20 4444 5678",
      subject: "Emergency placement needed",
      message:
        "We need urgent placement for my grandmother. She was recently discharged from hospital and requires 24/7 care. Please contact me as soon as possible.",
      status: "new",
      careHomeName: "Sunshine Care Home",
      createdAt: "2024-01-21T08:00:00Z",
      readAt: undefined,
      repliedAt: undefined,
    },
  ];

  useEffect(() => {
    fetchEnquiries();
  }, [filterStatus, searchTerm]);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const result = await getMyEnquiries({
        status: filterStatus === "all" ? undefined : filterStatus,
        search: searchTerm || undefined,
      });

      if (result.success && result.data) {
        // Use mock data for now since backend endpoint is not ready
        // Replace with result.data when API is implemented
        setEnquiries(result.data.length > 0 ? result.data : mockEnquiries);
      } else {
        // Use mock data as fallback
        setEnquiries(mockEnquiries);
        if (result.error) {
          console.warn("Using mock data:", result.error);
        }
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      // Use mock data as fallback
      setEnquiries(mockEnquiries);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesStatus =
      filterStatus === "all" || enquiry.status === filterStatus;
    const matchesSearch =
      !searchTerm ||
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status: Enquiry["status"]) => {
    switch (status) {
      case "new":
        return styles.statusNew;
      case "read":
        return styles.statusRead;
      case "replied":
        return styles.statusReplied;
      case "archived":
        return styles.statusArchived;
      default:
        return "";
    }
  };

  const getStatusLabel = (status: Enquiry["status"]) => {
    switch (status) {
      case "new":
        return "New";
      case "read":
        return "Read";
      case "replied":
        return "Replied";
      case "archived":
        return "Archived";
      default:
        return status;
    }
  };

  const handleMarkAsRead = async (enquiryId: string) => {
    setIsUpdating(true);
    try {
      const result = await updateEnquiryStatus(enquiryId, "read");
      if (result.success) {
        setEnquiries((prev) =>
          prev.map((enquiry) =>
            enquiry.id === enquiryId
              ? {
                  ...enquiry,
                  status: "read" as const,
                  readAt: new Date().toISOString(),
                }
              : enquiry
          )
        );
        toast.success("Enquiry marked as read");
      } else {
        toast.error(result.error || "Failed to update enquiry");
      }
    } catch (error) {
      console.error("Error marking enquiry as read:", error);
      toast.error("Failed to update enquiry");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleArchive = async (enquiryId: string) => {
    setIsUpdating(true);
    try {
      const result = await updateEnquiryStatus(enquiryId, "archived");
      if (result.success) {
        setEnquiries((prev) =>
          prev.map((enquiry) =>
            enquiry.id === enquiryId
              ? { ...enquiry, status: "archived" as const }
              : enquiry
          )
        );
        toast.success("Enquiry archived");
      } else {
        toast.error(result.error || "Failed to archive enquiry");
      }
    } catch (error) {
      console.error("Error archiving enquiry:", error);
      toast.error("Failed to archive enquiry");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReply = async (enquiryId: string) => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setIsUpdating(true);
    try {
      const result = await replyToEnquiry(enquiryId, replyMessage);
      if (result.success) {
        setEnquiries((prev) =>
          prev.map((enquiry) =>
            enquiry.id === enquiryId
              ? {
                  ...enquiry,
                  status: "replied" as const,
                  repliedAt: new Date().toISOString(),
                }
              : enquiry
          )
        );
        setReplyingTo(null);
        setReplyMessage("");
        toast.success("Reply sent successfully!");
      } else {
        toast.error(result.error || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setIsUpdating(false);
    }
  };

  const stats = {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    read: enquiries.filter((e) => e.status === "read").length,
    replied: enquiries.filter((e) => e.status === "replied").length,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Enquiries Management</h1>
          <p>Manage and respond to customer inquiries about your care home</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Total Enquiries</h3>
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
            <h3>New</h3>
            <p className={styles.statNumber}>{stats.new}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Read</h3>
            <p className={styles.statNumber}>{stats.read}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Replied</h3>
            <p className={styles.statNumber}>{stats.replied}</p>
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
            placeholder="Search by name, email, or subject..."
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
              filterStatus === "new" ? styles.active : ""
            }`}
            onClick={() => setFilterStatus("new")}
          >
            New ({stats.new})
          </button>
          <button
            className={`${styles.filterTab} ${
              filterStatus === "read" ? styles.active : ""
            }`}
            onClick={() => setFilterStatus("read")}
          >
            Read ({stats.read})
          </button>
          <button
            className={`${styles.filterTab} ${
              filterStatus === "replied" ? styles.active : ""
            }`}
            onClick={() => setFilterStatus("replied")}
          >
            Replied ({stats.replied})
          </button>
          <button
            className={`${styles.filterTab} ${
              filterStatus === "archived" ? styles.active : ""
            }`}
            onClick={() => setFilterStatus("archived")}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Enquiries List */}
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading enquiries...</p>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📧</div>
          <h3>No enquiries found</h3>
          <p>
            {searchTerm || filterStatus !== "all"
              ? "No enquiries match your search criteria."
              : "You don't have any enquiries yet. Enquiries will appear here when customers contact you."}
          </p>
        </div>
      ) : (
        <div className={styles.enquiriesList}>
          {filteredEnquiries.map((enquiry) => (
            <div key={enquiry.id} className={styles.enquiryCard}>
              <div className={styles.enquiryHeader}>
                <div className={styles.enquiryTitle}>
                  <h3>{enquiry.subject}</h3>
                  <span
                    className={`${styles.statusBadge} ${getStatusBadgeClass(
                      enquiry.status
                    )}`}
                  >
                    {getStatusLabel(enquiry.status)}
                  </span>
                </div>
                <div className={styles.enquiryDate}>
                  <span className={styles.dateLabel}>Received:</span>
                  <span>
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className={styles.enquiryDetails}>
                <div className={styles.detailRow}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>From</span>
                    <span className={styles.detailValue}>{enquiry.name}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Email</span>
                    <a
                      href={`mailto:${enquiry.email}`}
                      className={styles.detailValue}
                    >
                      {enquiry.email}
                    </a>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Phone</span>
                    <a
                      href={`tel:${enquiry.phone}`}
                      className={styles.detailValue}
                    >
                      {enquiry.phone}
                    </a>
                  </div>
                </div>

                <div className={styles.messageSection}>
                  <span className={styles.detailLabel}>Message</span>
                  <div className={styles.messageContent}>
                    <p>{enquiry.message}</p>
                  </div>
                </div>

                {enquiry.repliedAt && (
                  <div className={styles.replyInfo}>
                    <span className={styles.detailLabel}>Replied on:</span>
                    <span>{new Date(enquiry.repliedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {replyingTo === enquiry.id ? (
                <div className={styles.replySection}>
                  <textarea
                    className={styles.replyTextarea}
                    placeholder="Type your reply here..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={4}
                  />
                  <div className={styles.replyActions}>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyMessage("");
                      }}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleReply(enquiry.id)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Sending..." : "Send Reply"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={styles.enquiryActions}>
                  {enquiry.status === "new" && (
                    <Button
                      variant="secondary"
                      onClick={() => handleMarkAsRead(enquiry.id)}
                      disabled={isUpdating}
                    >
                      Mark as Read
                    </Button>
                  )}
                  {enquiry.status !== "replied" && (
                    <Button
                      variant="primary"
                      onClick={() => setReplyingTo(enquiry.id)}
                      disabled={isUpdating}
                    >
                      Reply
                    </Button>
                  )}
                  {enquiry.status !== "archived" && (
                    <Button
                      variant="secondary"
                      onClick={() => handleArchive(enquiry.id)}
                      disabled={isUpdating}
                    >
                      Archive
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
