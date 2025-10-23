"use client";

import { useEffect } from "react";
import styles from "./confirmation-modal.module.scss";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: "warning" | "danger" | "info";
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  type = "warning",
}: ConfirmationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={`${styles.icon} ${styles[type]}`}>
            {type === "danger" && "⚠️"}
            {type === "warning" && "⚠️"}
            {type === "info" && "ℹ️"}
          </div>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`${styles.confirmButton} ${styles[type]}`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
