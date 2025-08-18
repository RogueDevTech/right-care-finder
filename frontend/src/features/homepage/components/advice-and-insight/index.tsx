import AdviceCard from "../advice-card";
import styles from "../advice-and-insight/styles.module.scss";
export default function AdviseAndInsight() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Advice & Insights for Choosing the Right Care Home</h1>
        <p>
          Practical tips, expert advice, and real-life stories to help you make
          confident care decisions.
        </p>
      </div>
      <div className={styles.careGuides}>
        <div className={styles.careAdvise}>
          <h2>Care address</h2>
          <div className={styles.adviceCard}>
            <AdviceCard
              title="How to Choose the Right Care Home for Your Loved One"
              content="Selecting a care home is one of the most important decisions you’ll
          make for a family member. From location and staff experience to the
          daily activities and meals, here’s a detailed guide on what to look
          for—and what questions to ask—before making your choice."
            />
            <AdviceCard
              title="How to Choose the Right Care Home for Your Loved One"
              content="Selecting a care home is one of the most important decisions you’ll
          make for a family member. From location and staff experience to the
          daily activities and meals, here’s a detailed guide on what to look
          for—and what questions to ask—before making your choice."
            />
            <AdviceCard
              title="How to Choose the Right Care Home for Your Loved One"
              content="Selecting a care home is one of the most important decisions you’ll
          make for a family member. From location and staff experience to the
          daily activities and meals, here’s a detailed guide on what to look
          for—and what questions to ask—before making your choice."
            />
          </div>
        </div>
        <div className={styles.funding}>
          <h2>Funding</h2>
          <div className={styles.adviceCard}>
            <AdviceCard
              title="How to Choose the Right Care Home for Your Loved One"
              content="Selecting a care home is one of the most important decisions you’ll
          make for a family member. From location and staff experience to the
          daily activities and meals, here’s a detailed guide on what to look
          for—and what questions to ask—before making your choice."
            />
            <AdviceCard
              title="How to Choose the Right Care Home for Your Loved One"
              content="Selecting a care home is one of the most important decisions you’ll
          make for a family member. From location and staff experience to the
          daily activities and meals, here’s a detailed guide on what to look
          for—and what questions to ask—before making your choice."
            />
            <AdviceCard
              title="How to Choose the Right Care Home for Your Loved One"
              content="Selecting a care home is one of the most important decisions you’ll
          make for a family member. From location and staff experience to the
          daily activities and meals, here’s a detailed guide on what to look
          for—and what questions to ask—before making your choice."
            />
          </div>
        </div>
        <div className={styles.wellbeing}>
          <h2>Wellbeing</h2>
          <div className={styles.adviceCard}>
            <AdviceCard
              title="How to Choose the Right Care Home for Your Loved One"
              content="Selecting a care home is one of the most important decisions you’ll
          make for a family member. From location and staff experience to the
          daily activities and meals, here’s a detailed guide on what to look
          for—and what questions to ask—before making your choice."
            />
            <AdviceCard
              title="How to Choose the Right Care Home for Your Loved One"
              content="Selecting a care home is one of the most important decisions you’ll
          make for a family member. From location and staff experience to the
          daily activities and meals, here’s a detailed guide on what to look
          for—and what questions to ask—before making your choice."
            />
            <AdviceCard
              title="How to Choose the Right Care Home for Your Loved One"
              content="Selecting a care home is one of the most important decisions you’ll
          make for a family member. From location and staff experience to the
          daily activities and meals, here’s a detailed guide on what to look
          for—and what questions to ask—before making your choice."
            />
          </div>
        </div>
      </div>
      <p></p>
    </div>
  );
}
