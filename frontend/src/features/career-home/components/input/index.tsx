"use client";
import { useState } from "react";
import styles from "./styles.module.scss";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search For a care type"
        value={query}
        onChange={handleInputChange}
        className={styles.searchInput}
      />
      <button className={styles.searchButton}>
        {/* You can use an SVG for the magnifying glass icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={styles.searchIcon}
        >
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.632 4.632a.75.75 0 11-1.06 1.06l-4.63-4.632A8.25 8.25 0 012.25 10.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
