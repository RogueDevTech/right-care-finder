"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/button";
import styles from "./billing.module.scss";

interface PricingTier {
  id: string;
  name: string;
  price: string;
  priceMonthly?: number;
  priceAnnual?: number;
  description: string;
  features: string[];
  badge?: string;
  popular?: boolean;
}

interface Subscription {
  tier: string;
  status: "active" | "cancelled" | "expired";
  billingCycle: "monthly" | "annual";
  nextBillingDate: string;
  amount: number;
}

export default function OwnerBillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [isLoading, setIsLoading] = useState(false);

  // Mock subscription data - replace with actual API call
  const [currentSubscription] = useState<Subscription | null>({
    tier: "featured",
    status: "active",
    billingCycle: "monthly",
    nextBillingDate: "2024-02-15",
    amount: 149,
  });

  const pricingTiers: PricingTier[] = [
    {
      id: "free",
      name: "Free Listing",
      price: "Free",
      description: "Basic listing to get started",
      features: [
        "Name, address, phone number",
        "Basic description + link to website",
        "Shows in search (low priority)",
        "Basic search visibility",
      ],
    },
    {
      id: "featured",
      name: "Featured Listing",
      price: "From £149/month",
      priceMonthly: 149,
      priceAnnual: 1490,
      description: "Boost visibility and get more enquiries",
      features: [
        "Everything in Free tier",
        "Photo gallery + video tour",
        "Room types and fees displayed",
        "Featured badge + priority placement",
        "Click-to-call / enquiry form",
        "Instant lead notifications",
      ],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium Listing",
      price: "From £299/month",
      priceMonthly: 299,
      priceAnnual: 2990,
      description: "Maximum visibility with analytics",
      features: [
        "Everything in Featured tier",
        "Lead reporting & analytics",
        "Dedicated profile page",
        "Inspection ratings & reviews",
        "Activity calendar",
        "Unlimited updates",
        "Highlighted in multiple categories",
        "Priority support",
      ],
      badge: "Most Popular",
    },
    {
      id: "pay-per-lead",
      name: "Pay Per Lead",
      price: "£30–£60 per lead",
      description: "Pay only for verified enquiries",
      features: [
        "No monthly subscription",
        "Pay only when you get enquiries",
        "Verified, qualified leads",
        "Lead details & contact info",
        "Flexible pricing based on quality",
        "Perfect for cashflow management",
      ],
    },
  ];

  const handleUpgrade = async (tierId: string) => {
    if (tierId === currentSubscription?.tier) {
      toast.error("You're already on this plan");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(
        `Successfully upgraded to ${
          pricingTiers.find((t) => t.id === tierId)?.name
        }!`
      );
    } catch {
      toast.error("Failed to upgrade. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Subscription cancelled successfully");
    } catch {
      toast.error("Failed to cancel subscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.billingContainer}>
      <div className={styles.header}>
        <div>
          <h1>Billing & Subscription</h1>
          <p>Manage your listing subscription and billing information</p>
        </div>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <div className={styles.currentSubscription}>
          <div className={styles.subscriptionHeader}>
            <div>
              <h2>Current Plan</h2>
              <p className={styles.subscriptionTier}>
                {pricingTiers.find((t) => t.id === currentSubscription.tier)
                  ?.name || "Free Listing"}
              </p>
            </div>
            <div className={styles.subscriptionStatus}>
              <span
                className={`${styles.statusBadge} ${
                  currentSubscription.status === "active"
                    ? styles.active
                    : styles.inactive
                }`}
              >
                {currentSubscription.status === "active"
                  ? "Active"
                  : "Cancelled"}
              </span>
            </div>
          </div>

          <div className={styles.subscriptionDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Billing Cycle</span>
              <span className={styles.detailValue}>
                {currentSubscription.billingCycle === "annual"
                  ? "Annual"
                  : "Monthly"}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Next Billing Date</span>
              <span className={styles.detailValue}>
                {new Date(
                  currentSubscription.nextBillingDate
                ).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Amount</span>
              <span className={styles.detailValue}>
                £{currentSubscription.amount.toLocaleString()}/
                {currentSubscription.billingCycle === "annual"
                  ? "year"
                  : "month"}
              </span>
            </div>
          </div>

          {currentSubscription.status === "active" && (
            <div className={styles.subscriptionActions}>
              <Button
                variant="secondary"
                onClick={handleCancelSubscription}
                disabled={isLoading}
              >
                Cancel Subscription
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Pricing Tiers */}
      <div className={styles.pricingSection}>
        <div className={styles.sectionHeader}>
          <h2>Choose Your Plan</h2>
          <p>Select the plan that best fits your needs</p>
        </div>

        <div className={styles.billingToggle}>
          <button
            className={`${styles.toggleButton} ${
              billingCycle === "monthly" ? styles.active : ""
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={`${styles.toggleButton} ${
              billingCycle === "annual" ? styles.active : ""
            }`}
            onClick={() => setBillingCycle("annual")}
          >
            Annual
            <span className={styles.saveBadge}>Save 17%</span>
          </button>
        </div>

        <div className={styles.pricingGrid}>
          {pricingTiers.map((tier) => {
            const isCurrentTier =
              currentSubscription?.tier === tier.id &&
              currentSubscription?.status === "active";

            return (
              <div
                key={tier.id}
                className={`${styles.pricingCard} ${
                  tier.popular ? styles.popular : ""
                } ${isCurrentTier ? styles.currentPlan : ""}`}
              >
                {tier.badge && <div className={styles.badge}>{tier.badge}</div>}
                {tier.popular && (
                  <div className={styles.popularBadge}>Most Popular</div>
                )}

                <div className={styles.cardHeader}>
                  <h3>{tier.name}</h3>
                  <p className={styles.tierDescription}>{tier.description}</p>
                </div>

                <div className={styles.cardPricing}>
                  {tier.priceMonthly || tier.priceAnnual ? (
                    <>
                      <div className={styles.price}>
                        £
                        {billingCycle === "annual" && tier.priceAnnual
                          ? (tier.priceAnnual / 12).toFixed(0)
                          : tier.priceMonthly}
                        <span className={styles.pricePeriod}>/month</span>
                      </div>
                      {billingCycle === "annual" && tier.priceAnnual && (
                        <p className={styles.annualPrice}>
                          £{tier.priceAnnual}/year
                        </p>
                      )}
                    </>
                  ) : (
                    <div className={styles.price}>{tier.price}</div>
                  )}
                </div>

                <ul className={styles.featuresList}>
                  {tier.features.map((feature, index) => (
                    <li key={index}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M13.5 4L6 11.5L2.5 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className={styles.cardActions}>
                  {isCurrentTier ? (
                    <Button variant="secondary" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant={tier.popular ? "primary" : "secondary"}
                      onClick={() => handleUpgrade(tier.id)}
                      disabled={isLoading}
                    >
                      {currentSubscription?.tier === "free" ||
                      !currentSubscription
                        ? "Get Started"
                        : "Upgrade"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment History */}
      <div className={styles.paymentHistory}>
        <h2>Payment History</h2>
        <div className={styles.historyTable}>
          <div className={styles.tableHeader}>
            <span>Date</span>
            <span>Description</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          <div className={styles.tableRow}>
            <span>Jan 15, 2024</span>
            <span>Featured Listing - Monthly</span>
            <span>£149.00</span>
            <span className={styles.statusPaid}>Paid</span>
          </div>
          <div className={styles.tableRow}>
            <span>Dec 15, 2023</span>
            <span>Featured Listing - Monthly</span>
            <span>£149.00</span>
            <span className={styles.statusPaid}>Paid</span>
          </div>
          <div className={styles.tableRow}>
            <span>Nov 15, 2023</span>
            <span>Featured Listing - Monthly</span>
            <span>£149.00</span>
            <span className={styles.statusPaid}>Paid</span>
          </div>
        </div>
      </div>
    </div>
  );
}
