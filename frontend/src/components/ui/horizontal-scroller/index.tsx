import React from "react";
import styles from "./styles.module.scss";

type HorizontalScrollerProps = {
  children: React.ReactNode;
};

export default function HorizontalScroller({
  children,
}: HorizontalScrollerProps) {
  return <div className={styles.scroller}>{children}</div>;
}
