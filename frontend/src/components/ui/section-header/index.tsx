import React, { useMemo } from "react";
import styles from "./styles.module.scss";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  overlayVariant?: "pink" | "yellow";
};

const OVERLAY_COLORS = {
  pink: "rgba(255, 235, 221, 0.9)", // Changed from 1 to 0.45
  yellow: "rgba(255, 250, 208, 0.9)", // Changed from 1 to 0.45
} as const;

export default function SectionHeader({
  title,
  subtitle,
  icon,
  overlayVariant = "pink",
}: SectionHeaderProps) {
  const styleVars = useMemo(
    () =>
      ({
        "--overlay-color": OVERLAY_COLORS[overlayVariant],
      }) as React.CSSProperties,
    [overlayVariant],
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && (
        <div className={styles.subtitleRow} style={styleVars}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={styles.subtitle}>{subtitle}</span>
        </div>
      )}
    </div>
  );
}
