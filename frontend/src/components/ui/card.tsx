import React from "react";
import styles from "./card.module.scss";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export default function Card({
  children,
  className = "",
  header,
  title,
  subtitle,
  footer,
  noPadding = false,
}: CardProps) {
  return (
    <div className={`${styles.card} ${className}`}>
      {(header || title) && (
        <div className={styles.cardHeader}>
          {header || (
            <>
              {title && <h5 className={styles.cardTitle}>{title}</h5>}
              {subtitle && <h6 className={styles.cardSubtitle}>{subtitle}</h6>}
            </>
          )}
        </div>
      )}
      <div
        className={`${styles.cardBody} ${noPadding ? styles.noPadding : ""}`}
      >
        {children}
      </div>
      {footer && <div className={styles.cardFooter}>{footer}</div>}
    </div>
  );
}
