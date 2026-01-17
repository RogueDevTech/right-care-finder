"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useUserActions } from "@/actions-client/user";
import {
  useHealthcareHomesActions,
  CareHome,
  CareType,
  Specialization,
} from "@/actions-client/healthcare-homes";
import { Facility } from "@/actions-client/admin";
import styles from "@/app/admin/care-homes/add/add-care-home.module.scss";

interface CareHomeFormData {
  name: string;
  description: string[];
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  weeklyPrice?: number;
  monthlyPrice?: number;
  totalBeds?: number;
  availableBeds?: number;
  isActive: boolean;
  specializations: string[];
  openingHours: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  contactInfo: {
    emergency: string;
    manager: string;
  };
  careTypeId: string;
  facilityIds: string[];
  imageUrls: string[];
}

const initialFormData: CareHomeFormData = {
  name: "",
  description: [],
  addressLine1: "",
  addressLine2: "",
  city: "",
  region: "",
  postcode: "",
  country: "United Kingdom",
  phone: "",
  email: "",
  website: "",
  weeklyPrice: undefined,
  monthlyPrice: undefined,
  totalBeds: undefined,
  availableBeds: undefined,
  isActive: true,
  specializations: [],
  openingHours: {
    Monday: "9:00 AM - 5:00 PM",
    Tuesday: "9:00 AM - 5:00 PM",
    Wednesday: "9:00 AM - 5:00 PM",
    Thursday: "9:00 AM - 5:00 PM",
    Friday: "9:00 AM - 5:00 PM",
    Saturday: "9:00 AM - 5:00 PM",
    Sunday: "9:00 AM - 5:00 PM",
  },
  contactInfo: {
    emergency: "",
    manager: "",
  },
  careTypeId: "",
  facilityIds: [],
  imageUrls: [],
};

export default function OwnerEditCareHomePage() {
  const [formData, setFormData] = useState<CareHomeFormData>(initialFormData);
  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [careTypes, setCareTypes] = useState<CareType[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const router = useRouter();
  const { getMyCareHomes } = useUserActions();
  const { updateCareHome, getCareTypes, getSpecializations, getFacilities } =
    useHealthcareHomesActions();

  useEffect(() => {
    loadCareHome();
    loadConfigData();
  }, []);

  const loadConfigData = async () => {
    setIsLoadingConfig(true);
    try {
      const [careTypesResult, specializationsResult, facilitiesResult] =
        await Promise.all([
          getCareTypes(),
          getSpecializations(),
          getFacilities(),
        ]);

      if (careTypesResult.success && careTypesResult.data) {
        setCareTypes(careTypesResult.data);
      } else {
        console.error("Failed to load care types:", careTypesResult.error);
        toast.error("Failed to load care types");
      }

      if (specializationsResult.success && specializationsResult.data) {
        setSpecializations(specializationsResult.data);
      } else {
        console.error(
          "Failed to load specializations:",
          specializationsResult.error
        );
        toast.error("Failed to load specializations");
      }

      if (facilitiesResult.success && facilitiesResult.data) {
        // Map facilities to ensure all required fields are present
        const mappedFacilities: Facility[] = facilitiesResult.data.map(
          (facility) => ({
            id: facility.id,
            name: facility.name,
            description: facility.description,
            icon: facility.icon,
            isActive: facility.isActive,
            sortOrder: facility.sortOrder ?? 0,
            createdAt: facility.createdAt ?? new Date().toISOString(),
            updatedAt: facility.updatedAt ?? new Date().toISOString(),
          })
        );
        setFacilities(mappedFacilities);
      } else {
        console.error("Failed to load facilities:", facilitiesResult.error);
        toast.error("Failed to load facilities");
      }
    } catch (error) {
      console.error("Error loading configuration data:", error);
      toast.error("Failed to load configuration data");
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const loadCareHome = async () => {
    setIsLoading(true);
    try {
      const result = await getMyCareHomes();
      if (result.success && result.data) {
        const homes = result.data;
        if (homes.length > 0) {
          const home = homes[0];
          setCareHome(home);

          setFormData({
            name: home.name || "",
            description: Array.isArray(home.description)
              ? home.description
              : [],
            addressLine1: home.addressLine1 || "",
            addressLine2: home.addressLine2 || "",
            city: home.city || "",
            region: home.region || "",
            postcode: home.postcode || "",
            country: home.country || "United Kingdom",
            phone: home.phone || "",
            email: home.email || "",
            website: home.website || "",
            weeklyPrice: home.weeklyPrice,
            monthlyPrice: home.monthlyPrice,
            totalBeds: home.totalBeds,
            availableBeds: home.availableBeds,
            isActive: home.isActive ?? true,
            specializations: home.specializations || [],
            openingHours: home.openingHours || initialFormData.openingHours,
            contactInfo: home.contactInfo || initialFormData.contactInfo,
            careTypeId: home.careType ? String(home.careType.id) : "",
            facilityIds: home.facilities
              ? home.facilities.map((f) => f.id)
              : [],
            imageUrls: home.images ? home.images.map((img) => img.url) : [],
          });
        } else {
          toast.error("No care home found");
          router.push("/owner/care-home");
        }
      } else {
        toast.error("Failed to load care home");
        router.push("/owner/care-home");
      }
    } catch (error) {
      console.error("Error loading care home:", error);
      toast.error("Failed to load care home");
      router.push("/owner/care-home");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : parseFloat(value) || 0,
      }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSpecializationChange = (specializationName: string) => {
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(specializationName)
        ? prev.specializations.filter((s) => s !== specializationName)
        : [...prev.specializations, specializationName],
    }));
  };

  const handleFacilityChange = (facilityId: string) => {
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    setFormData((prev) => ({
      ...prev,
      facilityIds: prev.facilityIds.includes(facilityId)
        ? prev.facilityIds.filter((id) => id !== facilityId)
        : [...prev.facilityIds, facilityId],
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.map((url, i) => (i === index ? value : url)),
    }));
  };

  const addImageUrl = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ""],
    }));
  };

  const removeImageUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleOpeningHoursChange = (day: string, hours: string) => {
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: hours,
      },
    }));
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const handleDescriptionChange = (value: string) => {
    const lines = value.split("\n");
    setFormData((prev) => ({
      ...prev,
      description: lines,
    }));
  };

  const validateCurrentStep = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    switch (currentStep) {
      case 0:
        if (!formData.name?.trim()) errors.push("Care home name is required");
        if (!formData.careTypeId || formData.careTypeId === "")
          errors.push("Care type must be selected");
        const nonEmptyDescriptionLines = formData.description.filter(
          (line) => line.trim() !== ""
        );
        if (nonEmptyDescriptionLines.length === 0) {
          errors.push("Description is required");
        }
        break;
      case 1:
        if (!formData.addressLine1?.trim())
          errors.push("Address line 1 is required");
        if (!formData.city?.trim()) errors.push("City is required");
        if (!formData.postcode?.trim()) errors.push("Postcode is required");
        if (!formData.phone?.trim()) errors.push("Phone number is required");
        if (!formData.email?.trim()) errors.push("Email is required");
        break;
      default:
        break;
    }

    return { isValid: errors.length === 0, errors };
  };

  const hasFieldError = (fieldName: string): boolean => {
    return validationErrors.some(
      (error) =>
        error.toLowerCase().includes(fieldName.toLowerCase()) ||
        error
          .toLowerCase()
          .includes(fieldName.replace(/([A-Z])/g, " $1").toLowerCase()) ||
        (fieldName === "careTypeId" &&
          error.toLowerCase().includes("care type"))
    );
  };

  const getFormGroupClass = (fieldName: string): string => {
    return hasFieldError(fieldName)
      ? `${styles.formGroup} ${styles.error}`
      : styles.formGroup;
  };

  const handleSubmit = async () => {
    if (currentStep !== steps.length - 1 || !careHome) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        ...formData,
        description: formData.description.filter((line) => line.trim() !== ""),
        imageUrls: formData.imageUrls.filter((url) => url.trim() !== ""),
      };

      const result = await updateCareHome(careHome.id, updateData);

      if (result.success) {
        toast.success("Care home updated successfully!");
        router.push("/owner/care-home");
      } else {
        toast.error(result.error || "Failed to update care home");
      }
    } catch (error) {
      console.error("Error updating care home:", error);
      toast.error("Failed to update care home. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      id: "basic",
      label: "Basic Information",
      description: "Care home name and type",
    },
    {
      id: "location",
      label: "Location & Contact",
      description: "Address and contact details",
    },
    {
      id: "pricing",
      label: "Pricing & Capacity",
      description: "Costs and bed availability",
    },
    {
      id: "services",
      label: "Services & Facilities",
      description: "Specializations and amenities",
    },
    {
      id: "hours",
      label: "Opening Hours",
      description: "Daily operating hours",
    },
    {
      id: "media",
      label: "Images & Media",
      description: "Photos and media",
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.addCareHomeContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading care home data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.addCareHomeContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/owner/care-home" className={styles.backButton}>
            ← Back to My Care Home
          </Link>
          <h1>Edit Care Home</h1>
        </div>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className={styles.stepsIndicator}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`${styles.step} ${
                index <= currentStep ? styles.completed : ""
              } ${index === currentStep ? styles.current : ""}`}
            >
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepInfo}>
                <div className={styles.stepLabel}>{step.label}</div>
                <div className={styles.stepDescription}>{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className={styles.errorContainer}>
          <h4>Please fix the following errors:</h4>
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form className={styles.form}>
        {/* Basic Information Step */}
        {currentStep === 0 && (
          <div className={styles.tabContent}>
            <div className={styles.formSection}>
              <h3>Basic Information</h3>
              <div className={styles.formGrid}>
                <div className={getFormGroupClass("name")}>
                  <label htmlFor="name">
                    Care Home Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter care home name"
                  />
                </div>

                <div className={getFormGroupClass("description")}>
                  <label htmlFor="description">
                    Description <span>*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description.join("\n")}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    rows={6}
                    placeholder="Enter care home description..."
                  />
                  <div className={styles.helpText}>
                    Each line will be treated as a separate paragraph.
                  </div>
                </div>

                <div className={getFormGroupClass("careTypeId")}>
                  <label htmlFor="careTypeId">
                    Care Type <span>*</span>
                  </label>
                  <select
                    id="careTypeId"
                    name="careTypeId"
                    value={formData.careTypeId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select care type</option>
                    {isLoadingConfig ? (
                      <option value="">Loading care types...</option>
                    ) : (
                      careTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Status</label>
                  <div className={styles.statusToggle}>
                    <button
                      type="button"
                      className={`${styles.statusTag} ${
                        formData.isActive ? styles.active : styles.inactive
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          isActive: !formData.isActive,
                        })
                      }
                    >
                      {formData.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location & Contact Step */}
        {currentStep === 1 && (
          <div className={styles.tabContent}>
            <div className={styles.formSection}>
              <h3>Address Information</h3>
              <div className={styles.formGrid}>
                <div className={getFormGroupClass("addressLine1")}>
                  <label htmlFor="addressLine1">
                    Address Line 1 <span>*</span>
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    required
                    placeholder="Street address"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="addressLine2">Address Line 2</label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                <div className={getFormGroupClass("city")}>
                  <label htmlFor="city">
                    City <span>*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter city"
                  />
                </div>

                <div className={getFormGroupClass("region")}>
                  <label htmlFor="region">Region/County</label>
                  <input
                    type="text"
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder="Enter region or county"
                  />
                </div>

                <div className={getFormGroupClass("postcode")}>
                  <label htmlFor="postcode">
                    Postcode <span>*</span>
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    required
                    placeholder="Postcode"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="United Kingdom"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Contact Information</h3>
              <div className={styles.formGrid}>
                <div className={getFormGroupClass("phone")}>
                  <label htmlFor="phone">
                    Phone Number <span>*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+44 161 123 4567"
                  />
                </div>

                <div className={getFormGroupClass("email")}>
                  <label htmlFor="email">
                    Email <span>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="info@carehome.co.uk"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.carehome.co.uk"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="emergency">Emergency Contact</label>
                  <input
                    type="tel"
                    id="emergency"
                    value={formData.contactInfo.emergency}
                    onChange={(e) =>
                      handleContactInfoChange("emergency", e.target.value)
                    }
                    placeholder="Emergency phone number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="manager">Manager Name</label>
                  <input
                    type="text"
                    id="manager"
                    value={formData.contactInfo.manager}
                    onChange={(e) =>
                      handleContactInfoChange("manager", e.target.value)
                    }
                    placeholder="Manager's name"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing & Capacity Step */}
        {currentStep === 2 && (
          <div className={styles.tabContent}>
            <div className={styles.formSection}>
              <h3>Pricing Information</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="weeklyPrice">Weekly Price (£)</label>
                  <input
                    type="number"
                    id="weeklyPrice"
                    name="weeklyPrice"
                    value={formData.weeklyPrice || ""}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="1200"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="monthlyPrice">Monthly Price (£)</label>
                  <input
                    type="number"
                    id="monthlyPrice"
                    name="monthlyPrice"
                    value={formData.monthlyPrice || ""}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="4800"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Capacity Information</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="totalBeds">Total Beds</label>
                  <input
                    type="number"
                    id="totalBeds"
                    name="totalBeds"
                    value={formData.totalBeds || ""}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="50"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="availableBeds">Available Beds</label>
                  <input
                    type="number"
                    id="availableBeds"
                    name="availableBeds"
                    value={formData.availableBeds || ""}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="5"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services & Facilities Step */}
        {currentStep === 3 && (
          <div className={styles.tabContent}>
            <div className={styles.formSection}>
              <h3>Specializations</h3>
              <p className={styles.sectionDescription}>
                Select the care specializations your home provides
              </p>
              {isLoadingConfig ? (
                <div className={styles.loadingMessage}>
                  Loading specializations...
                </div>
              ) : (
                <div className={styles.checkboxGrid}>
                  {specializations.map((specialization) => (
                    <div
                      key={specialization.id}
                      className={styles.checkboxItem}
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.specializations.includes(
                            specialization.name
                          )}
                          onChange={() =>
                            handleSpecializationChange(specialization.name)
                          }
                        />
                        {specialization.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.formSection}>
              <h3>Facilities</h3>
              <p className={styles.sectionDescription}>
                Select the facilities available at your care home
              </p>
              {isLoadingConfig ? (
                <div className={styles.loadingMessage}>
                  Loading facilities...
                </div>
              ) : (
                <div className={styles.checkboxGrid}>
                  {facilities.map((facility) => (
                    <div key={facility.id} className={styles.checkboxItem}>
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.facilityIds.includes(facility.id)}
                          onChange={() => handleFacilityChange(facility.id)}
                        />
                        {facility.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Opening Hours Step */}
        {currentStep === 4 && (
          <div className={styles.tabContent}>
            <div className={styles.formSection}>
              <h3>Opening Hours</h3>
              <div className={styles.formGrid}>
                {Object.entries(formData.openingHours).map(([day, hours]) => (
                  <div key={day} className={styles.formGroup}>
                    <label htmlFor={day}>{day}</label>
                    <input
                      type="text"
                      id={day}
                      value={hours}
                      onChange={(e) =>
                        handleOpeningHoursChange(day, e.target.value)
                      }
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Images & Media Step */}
        {currentStep === 5 && (
          <div className={styles.tabContent}>
            <div className={styles.formSection}>
              <h3>Images</h3>
              <p className={styles.sectionDescription}>
                Add image URLs for your care home gallery
              </p>
              <div className={styles.imageUrlsContainer}>
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className={styles.imageUrlItem}>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) =>
                        handleImageUrlChange(index, e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageUrl}
                  className={styles.addButton}
                >
                  + Add Image URL
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={styles.secondaryButton}
          >
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                const validation = validateCurrentStep();
                if (!validation.isValid) {
                  setValidationErrors(validation.errors);
                  return;
                }
                setValidationErrors([]);
                setCurrentStep(currentStep + 1);
              }}
              className={styles.primaryButton}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className={styles.primaryButton}
            >
              {isSubmitting ? "Updating Care Home..." : "Update Care Home"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
