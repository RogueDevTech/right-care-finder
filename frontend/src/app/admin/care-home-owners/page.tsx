"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AdminLayout from "@/components/layout/admin-layout";
import { useAdminActions, InvitationResponse } from "@/actions-client/admin";
import styles from "./care-home-owners.module.scss";
import InviteModal from "./components/InviteModal";
import ConfirmationModal from "./components/ConfirmationModal";

export default function CareHomeOwnersPage() {
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "accepted" | "expired"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInvitations, setTotalInvitations] = useState(0);
  const [activeTab, setActiveTab] = useState<"pending" | "current">("pending");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [invitationToCancel, setInvitationToCancel] = useState<string | null>(
    null
  );
  const [isCancelling, setIsCancelling] = useState(false);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);
  const [invitationToResend, setInvitationToResend] = useState<string | null>(
    null
  );
  const [isResending, setIsResending] = useState(false);
  const { getInvitations, resendInvitation, cancelInvitation } =
    useAdminActions();

  useEffect(() => {
    fetchInvitations();
  }, [currentPage, searchTerm, statusFilter, activeTab]);

  const fetchInvitations = async () => {
    try {
      setIsLoading(true);

      // Determine status filter based on active tab
      let statusToFilter: string | undefined;
      if (activeTab === "pending") {
        statusToFilter = statusFilter === "all" ? "pending" : statusFilter;
      } else if (activeTab === "current") {
        statusToFilter = "accepted";
      }

      const result = await getInvitations({
        page: currentPage,
        limit: 20,
        status: statusToFilter as "pending" | "accepted" | "expired",
      });

      if (result.success && result.data) {
        setInvitations(result.data.invitations || []);
        setTotalPages(Math.ceil((result.data.pagination?.total || 0) / 20));
        setTotalInvitations(result.data.pagination?.total || 0);
      } else {
        toast.error(result.error || "Failed to load invitations");
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast.error("Failed to load invitations");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, activeTab]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleResendInvitation = (invitationId: string) => {
    setInvitationToResend(invitationId);
    setIsResendModalOpen(true);
  };

  const handleCancelInvitation = (invitationId: string) => {
    setInvitationToCancel(invitationId);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!invitationToCancel) return;

    try {
      setIsCancelling(true);
      const result = await cancelInvitation(invitationToCancel);
      if (result.success) {
        toast.success("Invitation cancelled and removed successfully!");
        fetchInvitations();
        setIsConfirmationModalOpen(false);
        setInvitationToCancel(null);
      } else {
        toast.error(result.error || "Failed to cancel invitation");
      }
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast.error("Failed to cancel invitation");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationModalOpen(false);
    setInvitationToCancel(null);
  };

  const handleConfirmResend = async () => {
    if (!invitationToResend) return;

    try {
      setIsResending(true);
      const result = await resendInvitation(invitationToResend);
      if (result.success) {
        toast.success("Invitation resent successfully!");
        fetchInvitations();
        setIsResendModalOpen(false);
        setInvitationToResend(null);
      } else {
        toast.error(result.error || "Failed to resend invitation");
      }
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast.error("Failed to resend invitation");
    } finally {
      setIsResending(false);
    }
  };

  const handleCloseResendConfirmation = () => {
    setIsResendModalOpen(false);
    setInvitationToResend(null);
  };

  const handleInviteSuccess = () => {
    setIsInviteModalOpen(false);
    fetchInvitations();
  };

  return (
    <AdminLayout>
      <div className={styles.careHomeOwnersContainer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/admin" className={styles.backButton}>
              ← Back to Dashboard
            </Link>
            <h1>Care Home Owners</h1>
          </div>
          <button
            className={styles.addButton}
            onClick={() => setIsInviteModalOpen(true)}
          >
            + Invite Owner
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                activeTab === "pending" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Owners
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "current" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("current")}
            >
              Current Owners
            </button>
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | "pending" | "accepted" | "expired"
                )
              }
              className={styles.filterSelect}
            >
              {activeTab === "pending" ? (
                <>
                  <option value="all">All Pending</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </>
              ) : (
                <>
                  <option value="all">All Current</option>
                  <option value="accepted">Active</option>
                </>
              )}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.tableContainer}>
            <table className={styles.ownersTable}>
              <thead>
                <tr>
                  <th>Owner Name</th>
                  <th>Email</th>
                  <th>Care Home</th>
                  <th>Invited Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i} className={styles.skeletonRow}>
                    <td>
                      <div className={styles.nameCell}>
                        <div className={styles.skeletonName}></div>
                        <div className={styles.skeletonTextSmall}></div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.skeletonText}></div>
                    </td>
                    <td>
                      <div className={styles.skeletonText}></div>
                    </td>
                    <td>
                      <div className={styles.skeletonText}></div>
                    </td>
                    <td>
                      <div className={styles.skeletonStatus}></div>
                    </td>
                    <td>
                      <div className={styles.skeletonActions}>
                        <div className={styles.skeletonButton}></div>
                        <div className={styles.skeletonButton}></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.ownersTable}>
              <thead>
                <tr>
                  <th>Owner Name</th>
                  <th>Email</th>
                  <th>Care Home</th>
                  <th>Invited Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invitations?.length > 0 &&
                  invitations?.map((invitation) => (
                    <tr key={invitation.id} className={styles.clickableRow}>
                      <td>
                        <div className={styles.nameCell}>
                          <strong>
                            {invitation.firstName} {invitation.lastName}
                          </strong>
                        </div>
                      </td>
                      <td>
                        <span>{invitation.email}</span>
                      </td>
                      <td>
                        <span>{invitation.careHomeName || "Not assigned"}</span>
                      </td>
                      <td>
                        <span>
                          {new Date(invitation.invitedAt).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            styles[invitation.status]
                          }`}
                        >
                          {invitation.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionsCell}>
                          {invitation.status === "pending" && (
                            <>
                              <button
                                className={styles.actionButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResendInvitation(invitation.id);
                                }}
                              >
                                Resend
                              </button>
                              <button
                                className={`${styles.actionButton} ${styles.cancelButton}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelInvitation(invitation.id);
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {invitation.status === "accepted" && (
                            <span className={styles.acceptedText}>
                              Owner Active
                            </span>
                          )}
                          {invitation.status === "expired" && (
                            <button
                              className={styles.actionButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResendInvitation(invitation.id);
                              }}
                            >
                              Resend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && invitations.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              {activeTab === "pending" ? "⏳" : "✅"}
            </div>
            <h3>
              {activeTab === "pending"
                ? "No Pending Owners Found"
                : "No Current Owners Found"}
            </h3>
            <p>
              {searchTerm || statusFilter !== "all"
                ? "No owners match your current search criteria. Try adjusting your filters or search terms."
                : activeTab === "pending"
                ? "No pending invitations at the moment. Invite care home owners to get started."
                : "No active care home owners yet. Invite owners and wait for them to accept their invitations."}
            </p>
            <div className={styles.emptyStateActions}>
              {searchTerm || statusFilter !== "all" ? (
                <button
                  className={styles.emptyStateButton}
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear All Filters
                </button>
              ) : (
                <button
                  className={styles.emptyStateButton}
                  onClick={() => setIsInviteModalOpen(true)}
                >
                  {activeTab === "pending"
                    ? "+ Invite Your First Owner"
                    : "+ Invite Care Home Owner"}
                </button>
              )}
            </div>
            {searchTerm || statusFilter !== "all" ? (
              <div className={styles.emptyStateFilters}>
                <span className={styles.filterLabel}>Active filters:</span>
                {searchTerm && (
                  <span className={styles.filterTag}>
                    Search: &quot;{searchTerm}&quot;
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className={styles.filterTag}>
                    Status: {statusFilter}
                  </span>
                )}
              </div>
            ) : (
              <div className={styles.emptyStateStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>0</span>
                  <span className={styles.statLabel}>Total Invitations</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>0</span>
                  <span className={styles.statLabel}>Active Owners</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>0</span>
                  <span className={styles.statLabel}>Pending Invitations</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Showing {(currentPage - 1) * 20 + 1} to{" "}
              {Math.min(currentPage * 20, totalInvitations)} of{" "}
              {totalInvitations} invitations
            </div>
            <div className={styles.paginationControls}>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                title="First Page"
              >
                ««
              </button>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Previous Page"
              >
                ‹
              </button>

              {/* Page Numbers */}
              <div className={styles.pageNumbers}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`${styles.pageNumber} ${
                        currentPage === pageNum ? styles.activePage : ""
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Next Page"
              >
                ›
              </button>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                title="Last Page"
              >
                »»
              </button>
            </div>
          </div>
        )}

        {isInviteModalOpen && (
          <InviteModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            onSuccess={handleInviteSuccess}
          />
        )}

        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={handleCloseConfirmation}
          onConfirm={handleConfirmCancel}
          title="Cancel Invitation"
          message="Are you sure you want to cancel this invitation? This action will permanently delete the invitation and cannot be undone."
          confirmText="Yes, Cancel Invitation"
          cancelText="Keep Invitation"
          isLoading={isCancelling}
          type="info"
        />

        <ConfirmationModal
          isOpen={isResendModalOpen}
          onClose={handleCloseResendConfirmation}
          onConfirm={handleConfirmResend}
          title="Resend Invitation"
          message="Are you sure you want to resend this invitation? A new invitation email will be sent to the care home owner."
          confirmText="Yes, Resend Invitation"
          cancelText="Cancel"
          isLoading={isResending}
          type="info"
        />
      </div>
    </AdminLayout>
  );
}
