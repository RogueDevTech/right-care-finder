"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useAdminActions, CareHomeOption } from "@/actions-client/admin";
import styles from "./InviteModal.module.scss";

interface InviteFormData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  careHomeId: string;
  message: string;
}

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InviteModal({
  isOpen,
  onClose,
  onSuccess,
}: InviteModalProps) {
  const [formData, setFormData] = useState<InviteFormData>({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    careHomeId: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [availableCareHomes, setAvailableCareHomes] = useState<
    CareHomeOption[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { inviteCareHomeOwner, getAvailableCareHomes } = useAdminActions();

  useEffect(() => {
    if (isOpen) {
      loadAvailableCareHomes();
    }
  }, [isOpen]);

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

  const loadAvailableCareHomes = async (search?: string) => {
    try {
      setIsSearching(true);
      const result = await getAvailableCareHomes(search, 30);
      if (result.success && result.data) {
        setAvailableCareHomes(result.data);
      } else {
        console.error("Failed to load care homes:", result.error);
        setAvailableCareHomes([]);
      }
    } catch (error) {
      console.error("Error loading care homes:", error);
      setAvailableCareHomes([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchTerm: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          loadAvailableCareHomes(searchTerm);
        }, 300);
      };
    })(),
    []
  );

  // Handle search term changes
  useEffect(() => {
    if (isDropdownOpen) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, isDropdownOpen, debouncedSearch]);

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

  // No need for client-side filtering since we're doing server-side search

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
        toast.success("Care home owner invited successfully!");
        onSuccess();
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

  const handleClose = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      careHomeId: "",
      message: "",
    });
    setSearchTerm("");
    setIsDropdownOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Invite Care Home Owner</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

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
                      {selectedCareHome.name} - {selectedCareHome.addressLine1},{" "}
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
                    {isSearching ? (
                      <div className={styles.loadingResults}>
                        <div className={styles.loadingSpinner}></div>
                        <span>Searching care homes...</span>
                      </div>
                    ) : availableCareHomes.length === 0 ? (
                      <div className={styles.noResults}>
                        {searchTerm
                          ? "No care homes found matching your search"
                          : "No care homes available for assignment"}
                      </div>
                    ) : (
                      availableCareHomes.map((careHome) => (
                        <div
                          key={careHome.id}
                          className={`${styles.option} ${
                            formData.careHomeId === careHome.id
                              ? styles.selected
                              : ""
                          }`}
                          onClick={() => handleCareHomeSelect(careHome.id)}
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
                No care homes available for assignment. All care homes already
                have owners.
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
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
            >
              Cancel
            </button>
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
  );
}
