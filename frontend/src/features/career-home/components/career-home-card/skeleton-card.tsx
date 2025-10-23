import styles from "./styles.module.scss";

const SkeletonCard: React.FC = () => {
  return (
    <div className={styles.careHomeCard}>
      <div className={styles.cardContainer}>
        <div className={styles.cardImage}>
          <div className={`${styles.skeletonImage} ${styles.skeleton}`}></div>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.header}>
            <div className={`${styles.skeletonTitle} ${styles.skeleton}`}></div>
            <div className={`${styles.skeletonPrice} ${styles.skeleton}`}></div>
          </div>

          <div className={`${styles.skeletonLocation} ${styles.skeleton}`}></div>

          <div className={styles.skeletonDescription}>
            <div className={`${styles.skeletonLine} ${styles.skeleton}`}></div>
            <div className={`${styles.skeletonLine} ${styles.skeleton}`}></div>
            <div className={`${styles.skeletonLineShort} ${styles.skeleton}`}></div>
          </div>

          <div className={`${styles.skeletonTag} ${styles.skeleton}`}></div>
        </div>

        <div className={styles.skeletonButtonWrapper}>
          <div className={`${styles.skeletonButton} ${styles.skeleton}`}></div>
        </div>
      </div>
    </div>
  );
};

const SkeletonLoader: React.FC = () => {
  return (
    <div className={styles.cardWrapper}>
      {[...Array(8)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
