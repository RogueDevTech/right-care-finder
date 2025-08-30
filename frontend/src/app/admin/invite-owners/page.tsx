"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import AdminLayout from "@/components/layout/admin-layout";
import {
  useAdminActions,
  InvitationResponse,
  CareHomeOption,
} from "@/actions-client/admin";
import styles from "./invite-owners.module.scss";

interface InviteFormData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  careHomeId: string;
  message: string;
}

export default function InviteOwnersPage() {
  const [formData, setFormData] = useState<InviteFormData>({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    careHomeId: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [invitedOwners, setInvitedOwners] = useState<InvitationResponse[]>([]);
  const { inviteCareHomeOwner, getAvailableCareHomes } = useAdminActions();
  const [availableCareHomes, setAvailableCareHomes] = useState<
    CareHomeOption[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const loadAvailableCareHomes = async () => {
      const result = await getAvailableCareHomes();
      if (result.success && result.data) {
        setAvailableCareHomes(result.data);
      }
    };
    loadAvailableCareHomes();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(`.${styles.searchableDropdown}`)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredCareHomes = availableCareHomes.filter(
    (careHome) =>
      careHome.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      careHome.addressLine1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      careHome.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCareHomeSelect = (careHomeId: string) => {
    setFormData((prev) => ({
      ...prev,
      careHomeId,
    }));
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const handleClearCareHome = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      careHomeId: "",
    }));
    setSearchTerm("");
  };

  const selectedCareHome = availableCareHomes.find(
    (careHome) => careHome.id === formData.careHomeId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const result = await inviteCareHomeOwner(formData);

      if (result.success) {
        // Check if this was a resend
        const isResend =
          result.data &&
          invitedOwners.some((inv) => inv.email === formData.email);

        if (isResend) {
          toast.success("Invitation resent successfully!");
          // Update the existing invitation in the list
          setInvitedOwners((prev) =>
            prev.map((inv) =>
              inv.email === formData.email
                ? { ...inv, status: "pending" as const }
                : inv
            )
          );
        } else {
          toast.success("Care home owner invited successfully!");
          setInvitedOwners((prev) => [result.data!, ...prev]);
        }

        setFormData({
          email: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          careHomeId: "",
          message: "",
        });
      } else {
        toast.error(result.error || "Failed to invite care home owner");
      }
    } catch (error) {
      console.error("Error inviting care home owner:", error);
      toast.error("Failed to invite care home owner");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className={styles.inviteContainer}>
        <div className={styles.header}>
          <h1>Invite Care Home Owners</h1>
          <p>
            Send invitations to care home owners to join the platform and manage
            their care homes with full administrative access.
          </p>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.inviteForm}>
            <div className={styles.formCard}>
              <h2>Send Invitation</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="careHomeId">Select Care Home</label>
                  <div className={styles.searchableDropdown}>
                    <div
                      className={styles.dropdownTrigger}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      {selectedCareHome ? (
                        <div className={styles.selectedOptionContainer}>
                          <span className={styles.selectedOption}>
                            {selectedCareHome.name} -{" "}
                            {selectedCareHome.addressLine1},{" "}
                            {selectedCareHome.city} {selectedCareHome.postcode}
                          </span>
                          <button
                            type="button"
                            className={styles.clearButton}
                            onClick={handleClearCareHome}
                            title="Clear selection"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M12 4L4 12M4 4L12 12"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <span className={styles.placeholder}>
                          Search and select a care home (optional)
                        </span>
                      )}
                      <svg
                        className={`${styles.dropdownArrow} ${
                          isDropdownOpen ? styles.rotated : ""
                        }`}
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {isDropdownOpen && (
                      <div className={styles.dropdownContent}>
                        <div className={styles.searchInput}>
                          <input
                            type="text"
                            placeholder="Search care homes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className={styles.optionsList}>
                          {filteredCareHomes.length === 0 ? (
                            <div className={styles.noResults}>
                              {searchTerm
                                ? "No care homes found"
                                : "No care homes available"}
                            </div>
                          ) : (
                            filteredCareHomes.map((careHome) => (
                              <div
                                key={careHome.id}
                                className={`${styles.option} ${
                                  formData.careHomeId === careHome.id
                                    ? styles.selected
                                    : ""
                                }`}
                                onClick={() =>
                                  handleCareHomeSelect(careHome.id)
                                }
                              >
                                <div className={styles.optionName}>
                                  {careHome.name}
                                </div>
                                <div className={styles.optionAddress}>
                                  {careHome.addressLine1}, {careHome.city}{" "}
                                  {careHome.postcode}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {availableCareHomes.length === 0 && (
                    <p className={styles.noCareHomes}>
                      No care homes available for assignment. All care homes
                      already have owners.
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Personal Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Add a personal message to the invitation (optional)"
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending Invitation..." : "Send Invitation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
