"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import AdminLayout from "@/components/layout/admin-layout";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import styles from "./settings.module.scss";

interface SettingsForm {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportPhone: string;
    maintenanceMode: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    newUserAlerts: boolean;
    careHomeApprovalAlerts: boolean;
    reviewModerationAlerts: boolean;
    systemAlerts: boolean;
  };
  security: {
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
    enableTwoFactor: boolean;
  };
  system: {
    maxFileSize: number;
    allowedFileTypes: string;
    autoBackup: boolean;
    backupFrequency: string;
    enableAnalytics: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsForm>({
    general: {
      siteName: "Right Care Finder",
      siteDescription: "Find the perfect care home for your loved ones",
      contactEmail: "admin@rightcarefinder.com",
      supportPhone: "+44 20 1234 5678",
      maintenanceMode: false,
    },
    notifications: {
      emailNotifications: true,
      newUserAlerts: true,
      careHomeApprovalAlerts: true,
      reviewModerationAlerts: true,
      systemAlerts: true,
    },
    security: {
      requireEmailVerification: true,
      requirePhoneVerification: false,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      enableTwoFactor: false,
    },
    system: {
      maxFileSize: 5,
      allowedFileTypes: "jpg,jpeg,png,pdf,doc,docx",
      autoBackup: true,
      backupFrequency: "daily",
      enableAnalytics: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleInputChange = (
    section: keyof SettingsForm,
    field: string,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async (section: keyof SettingsForm) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`${section} settings saved successfully!`);
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("All settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: "⚙️" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "system", label: "System", icon: "🖥️" },
  ];

  return (
    <AdminLayout>
      <div className={styles.settingsContainer}>
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${
                  activeTab === tab.id ? styles.active : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.content}>
          {activeTab === "general" && (
            <Card title="General Settings" className={styles.settingsCard}>
              <div className={styles.formGroup}>
                <label htmlFor="siteName" className={styles.formLabel}>
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  value={settings.general.siteName}
                  onChange={(e) =>
                    handleInputChange("general", "siteName", e.target.value)
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="siteDescription" className={styles.formLabel}>
                  Site Description
                </label>
                <textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) =>
                    handleInputChange(
                      "general",
                      "siteDescription",
                      e.target.value
                    )
                  }
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="contactEmail" className={styles.formLabel}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={settings.general.contactEmail}
                    onChange={(e) =>
                      handleInputChange(
                        "general",
                        "contactEmail",
                        e.target.value
                      )
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="supportPhone" className={styles.formLabel}>
                    Support Phone
                  </label>
                  <input
                    type="tel"
                    id="supportPhone"
                    value={settings.general.supportPhone}
                    onChange={(e) =>
                      handleInputChange(
                        "general",
                        "supportPhone",
                        e.target.value
                      )
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.general.maintenanceMode}
                    onChange={(e) =>
                      handleInputChange(
                        "general",
                        "maintenanceMode",
                        e.target.checked
                      )
                    }
                    className={styles.checkbox}
                  />
                  <span>Enable Maintenance Mode</span>
                </label>
                <p className={styles.helpText}>
                  When enabled, the site will show a maintenance page to
                  visitors
                </p>
              </div>

              <div className={styles.actions}>
                <Button
                  variant="primary"
                  onClick={() => handleSave("general")}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save General Settings"}
                </Button>
              </div>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card title="Notification Settings" className={styles.settingsCard}>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) =>
                      handleInputChange(
                        "notifications",
                        "emailNotifications",
                        e.target.checked
                      )
                    }
                    className={styles.checkbox}
                  />
                  <span>Enable Email Notifications</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.notifications.newUserAlerts}
                    onChange={(e) =>
                      handleInputChange(
                        "notifications",
                        "newUserAlerts",
                        e.target.checked
                      )
                    }
                    className={styles.checkbox}
                  />
                  <span>New User Registration Alerts</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.notifications.careHomeApprovalAlerts}
                    onChange={(e) =>
                      handleInputChange(
                        "notifications",
                        "careHomeApprovalAlerts",
                        e.target.checked
                      )
                    }
                    className={styles.checkbox}
                  />
                  <span>Care Home Approval Requests</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.notifications.reviewModerationAlerts}
                    onChange={(e) =>
                      handleInputChange(
                        "notifications",
                        "reviewModerationAlerts",
                        e.target.checked
                      )
                    }
                    className={styles.checkbox}
                  />
                  <span>Review Moderation Alerts</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.notifications.systemAlerts}
                    onChange={(e) =>
                      handleInputChange(
                        "notifications",
                        "systemAlerts",
                        e.target.checked
                      )
                    }
                    className={styles.checkbox}
                  />
                  <span>System Error Alerts</span>
                </label>
              </div>

              <div className={styles.actions}>
                <Button
                  variant="primary"
                  onClick={() => handleSave("notifications")}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Notification Settings"}
                </Button>
              </div>
            </Card>
          )}

          {activeTab === "security" && (
            <Card title="Security Settings" className={styles.settingsCard}>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.security.requireEmailVerification}
                    onChange={(e) =>
                      handleInputChange(
                        "security",
                        "requireEmailVerification",
                        e.target.checked
                      )
                    }
                    className={styles.checkbox}
                  />
                  <span>Require Email Verification</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.security.requirePhoneVerification}
                    onChange={(e) =>
                      handleInputChange(
                        "security",
                        "requirePhoneVerification",
                        e.target.checked
                      )
                    }
                    className={styles.checkbox}
                  />
                  <span>Require Phone Verification</span>
                </label>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label
                    htmlFor="maxLoginAttempts"
                    className={styles.formLabel}
                  >
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    id="maxLoginAttempts"
                    min="1"
                    max="10"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) =>
                      handleInputChange(
                        "security",
                        "maxLoginAttempts",
                        parseInt(e.target.value)
                      )
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="sessionTimeout" className={styles.formLabel}>
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    id="sessionTimeout"
                    min="5"
                    max="480"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      handleInputChange(
                        "security",
                        "sessionTimeout",
                        parseInt(e.target.value)
                      )
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.security.enableTwoFactor}
                    onChange={(e) =>
                      handleInputChange(
                        "security",
                        "enableTwoFactor",
                        e.target.checked
                      )
                    }
                    className={styles.checkbox}
                  />
                  <span>Enable Two-Factor Authentication</span>
                </label>
                <p className={styles.helpText}>
                  Requires users to use 2FA for enhanced security
                </p>
              </div>

              <div className={styles.actions}>
                <Button
                  variant="primary"
                  onClick={() => handleSave("security")}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Security Settings"}
                </Button>
              </div>
            </Card>
          )}

          {activeTab === "system" && (
            <Card title="System Settings" className={styles.settingsCard}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="maxFileSize" className={styles.formLabel}>
                    Max File Size (MB)
                  </label>
                  <input
                    type="number"
                    id="maxFileSize"
                    min="1"
                    max="50"
                    value={settings.system.maxFileSize}
                    onChange={(e) =>
                      handleInputChange(
                        "system",
                        "maxFileSize",
                        parseInt(e.target.value)
                      )
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="backupFrequency" className={styles.formLabel}>
                    Backup Frequency
                  </label>
                  <select
                    id="backupFrequency"
                    value={settings.system.backupFrequency}
                    onChange={(e) =>
                      handleInputChange(
                        "system",
                        "backupFrequency",
                        e.target.value
                      )
                    }
                    className={styles.select}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="allowedFileTypes" className={styles.formLabel}>
                  Allowed File Types
                </label>
                <input
                  type="text"
                  id="allowedFileTypes"
                  value={settings.system.allowedFileTypes}
                  onChange={(e) =>
                    handleInputChange(
                      "system",
                      "allowedFileTypes",
                      e.target.value
                    )
                  }
                  className={styles.input}
                  placeholder="jpg,jpeg,png,pdf,doc,docx"
                />
                <p className={styles.helpText}>
                  Comma-separated list of allowed file extensions
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.system.autoBackup}
                    onChange={(e) =>
                      handleInputChange(
                        "system",
                        "autoBackup",
                        e.target.checked
                      )
                    }
                    className={styles.checkbox}
                  />
                  <span>Enable Automatic Backups</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.system.enableAnalytics}
                    onChange={(e) =>
                      handleInputChange(
                        "system",
                        "enableAnalytics",
                        e.target.checked
                      )
                    }
                    className={styles.checkbox}
                  />
                  <span>Enable Analytics Tracking</span>
                </label>
                <p className={styles.helpText}>
                  Collect usage analytics to improve the platform
                </p>
              </div>

              <div className={styles.actions}>
                <Button
                  variant="primary"
                  onClick={() => handleSave("system")}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save System Settings"}
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className={styles.globalActions}>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSaveAll}
            disabled={isLoading}
          >
            {isLoading ? "Saving All Settings..." : "Save All Settings"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
