import Image, { StaticImageData } from "next/image";
import styles from "./styles.module.scss";
import React, { useState } from "react";

type ServiceCardProps = {
  image: string | StaticImageData;
  imageAlt: string;
  title: string;
  description: string;
  points: string[];
  ctaText?: string;
  onViewServices?: () => void;
  className?: string;
};

export default function ServiceCard({
  image,
  imageAlt,
  title,
  description,
  points,
  ctaText = "View services →",
  onViewServices,
  className,
}: ServiceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const handleClick = () => {
    setExpanded((prev) => !prev);
    if (onViewServices) {
      onViewServices();
    }
  };
  return (
    <div className={`${styles.card} ${className || ""}`}>
      <div className={styles.imageWrap}>
        <Image src={image} alt={imageAlt} className={styles.image} />
      </div>
      <div className={styles.content}>
        <div className={styles.titleChip}>{title}</div>
        <div className={styles.descBox}>
          <p className={styles.description}>{description}</p>
        </div>
        {expanded && (
          <ul className={styles.list}>
            {points.map((p, i) => (
              <li key={i} className={styles.listItem}>
                <span className={styles.bullet}>★</span>
                {p}
              </li>
            ))}
          </ul>
        )}
        <div className={styles.ctaRow}>
          <button
            className={styles.cta}
            onClick={handleClick}
            aria-expanded={expanded}
            aria-label={expanded ? "Hide services" : ctaText}
          >
            {expanded ? "Hide services" : ctaText}
          </button>
        </div>
      </div>
    </div>
  );
}
