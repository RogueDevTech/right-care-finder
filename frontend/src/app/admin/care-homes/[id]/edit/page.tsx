"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AdminLayout from "@/components/layout/admin-layout";
import {
  CreateCareHomeData,
  useAdminActions,
  CareType,
  Specialization,
  Facility,
} from "@/actions-client/admin";
import styles from "../../add/add-care-home.module.scss";

interface CareHomeFormData {
  name: string;
  description: string[];
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
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
  careTypeId: number;
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
  country: "England",
  countryCode: "GB-ENG",
  latitude: 0,
  longitude: 0,
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
  careTypeId: 0,
  facilityIds: [],
  imageUrls: [],
};

// UK Countries and their regions/states
const ukCountries = [
  { code: "GB-ENG", name: "England" },
  { code: "GB-SCT", name: "Scotland" },
  { code: "GB-WLS", name: "Wales" },
  { code: "GB-NIR", name: "Northern Ireland" },
];

const ukRegions = {
  "GB-ENG": [
    "Bedfordshire",
    "Berkshire",
    "Bristol",
    "Buckinghamshire",
    "Cambridgeshire",
    "Cheshire",
    "City of London",
    "Cornwall",
    "Cumbria",
    "Derbyshire",
    "Devon",
    "Dorset",
    "Durham",
    "East Riding of Yorkshire",
    "East Sussex",
    "Essex",
    "Gloucestershire",
    "Greater London",
    "Greater Manchester",
    "Hampshire",
    "Herefordshire",
    "Hertfordshire",
    "Isle of Wight",
    "Kent",
    "Lancashire",
    "Leicestershire",
    "Lincolnshire",
    "London",
    "Merseyside",
    "Norfolk",
    "North Yorkshire",
    "Northamptonshire",
    "Northumberland",
    "Nottinghamshire",
    "Oxfordshire",
    "Rutland",
    "Shropshire",
    "Somerset",
    "South Yorkshire",
    "Staffordshire",
    "Suffolk",
    "Surrey",
    "Tyne and Wear",
    "Warwickshire",
    "West Midlands",
    "West Sussex",
    "West Yorkshire",
    "Wiltshire",
    "Worcestershire",
  ],
  "GB-SCT": [
    "Aberdeen City",
    "Aberdeenshire",
    "Angus",
    "Argyll and Bute",
    "City of Edinburgh",
    "Clackmannanshire",
    "Dumfries and Galloway",
    "Dundee City",
    "East Ayrshire",
    "East Dunbartonshire",
    "East Lothian",
    "East Renfrewshire",
    "Falkirk",
    "Fife",
    "Glasgow City",
    "Highland",
    "Inverclyde",
    "Midlothian",
    "Moray",
    "Na h-Eileanan Siar",
    "North Ayrshire",
    "North Lanarkshire",
    "Orkney Islands",
    "Perth and Kinross",
    "Renfrewshire",
    "Scottish Borders",
    "Shetland Islands",
    "South Ayrshire",
    "South Lanarkshire",
    "Stirling",
    "West Dunbartonshire",
    "West Lothian",
  ],
  "GB-WLS": [
    "Blaenau Gwent",
    "Bridgend",
    "Caerphilly",
    "Cardiff",
    "Carmarthenshire",
    "Ceredigion",
    "Conwy",
    "Denbighshire",
    "Flintshire",
    "Gwynedd",
    "Isle of Anglesey",
    "Merthyr Tydfil",
    "Monmouthshire",
    "Neath Port Talbot",
    "Newport",
    "Pembrokeshire",
    "Powys",
    "Rhondda Cynon Taf",
    "Swansea",
    "Torfaen",
    "Vale of Glamorgan",
    "Wrexham",
  ],
  "GB-NIR": [
    "Antrim and Newtownabbey",
    "Ards and North Down",
    "Armagh City, Banbridge and Craigavon",
    "Belfast",
    "Causeway Coast and Glens",
    "Derry City and Strabane",
    "Fermanagh and Omagh",
    "Lisburn and Castlereagh",
    "Mid and East Antrim",
    "Mid Ulster",
    "Newry, Mourne and Down",
  ],
};

// Convert time format helper
const formatTimeForDisplay = (time: string): string => {
  if (!time) return "";

  // If it's already in HH:MM format, convert to 12-hour format
  if (time.includes(":")) {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  return time;
};

// Convert 12-hour format to 24-hour format
const convertTo24Hour = (time12: string): string => {
  if (!time12) return "";

  // If already in 24-hour format, return as is
  if (time12.includes(":")) {
    const [hours] = time12.split(":");
    if (hours.length === 2 && parseInt(hours) <= 23) {
      return time12;
    }
  }

  // Convert 12-hour format to 24-hour
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match) {
    const [, hours, minutes, period] = match;
    let hour = parseInt(hours);

    if (period.toUpperCase() === "PM" && hour !== 12) {
      hour += 12;
    } else if (period.toUpperCase() === "AM" && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  }

  return time12;
};

// Time picker component for opening hours
const TimePicker = ({
  value,
  onChange,
  placeholder = "Select time",
}: {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
}) => {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={styles.timeInput}
    />
  );
};

export default function EditCareHomePage() {
  const params = useParams();
  const careHomeId = params?.id as string;
  const [formData, setFormData] = useState<CareHomeFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Configuration data state
  const [careTypes, setCareTypes] = useState<CareType[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const router = useRouter();
  const {
    getCareHomeById,
    updateCareHome,
    getCareTypes,
    getSpecializations,
    getFacilities,
  } = useAdminActions();

  // Fetch care home data and configuration on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!careHomeId) {
        toast.error("Invalid care home ID");
        router.push("/admin/care-homes");
        return;
      }

      setIsLoading(true);
      setIsLoadingConfig(true);

      try {
        // Load care home data
        const careHomeResult = await getCareHomeById(careHomeId);
        if (careHomeResult.success && careHomeResult.data) {
          const careHome = careHomeResult.data;

          // Map the care home data to form data
          setFormData({
            name: careHome.name || "",
            description: Array.isArray(careHome.description)
              ? careHome.description
              : [],
            addressLine1: careHome.addressLine1 || "",
            addressLine2: careHome.addressLine2 || "",
            city: careHome.city || "",
            region: careHome.region || "",
            postcode: careHome.postcode || "",
            country: careHome.country || "England",
            countryCode: careHome.countryCode || "GB-ENG",
            latitude: careHome.latitude || 0,
            longitude: careHome.longitude || 0,
            phone: careHome.phone || "",
            email: careHome.email || "",
            website: careHome.website || "",
            weeklyPrice: careHome.weeklyPrice,
            monthlyPrice: careHome.monthlyPrice,
            totalBeds: careHome.totalBeds,
            availableBeds: careHome.availableBeds,
            isActive: careHome.isActive ?? true,
            specializations: careHome.specializations || [],
            openingHours: careHome.openingHours || initialFormData.openingHours,
            contactInfo: careHome.contactInfo || initialFormData.contactInfo,
            careTypeId: parseInt(careHome.careTypeId) || 0,
            facilityIds: careHome.facilityIds || [],
            imageUrls: careHome.imageUrls || [],
          });
        } else {
          toast.error("Failed to load care home data");
          router.push("/admin/care-homes");
        }

        // Load configuration data
        const [careTypesResult, specializationsResult, facilitiesResult] =
          await Promise.all([
            getCareTypes(),
            getSpecializations(),
            getFacilities(),
          ]);

        if (careTypesResult.success && careTypesResult.data) {
          setCareTypes(careTypesResult.data);
        }

        if (specializationsResult.success && specializationsResult.data) {
          setSpecializations(specializationsResult.data);
        }

        if (facilitiesResult.success && facilitiesResult.data) {
          setFacilities(facilitiesResult.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
        setIsLoadingConfig(false);
      }
    };

    loadData();
  }, [careHomeId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value) || 0,
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

  const handleSpecializationChange = (specialization: string) => {
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter((s) => s !== specialization)
        : [...prev.specializations, specialization],
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

  const handleCountryChange = (countryCode: string) => {
    const selectedCountry = ukCountries.find(
      (country) => country.code === countryCode
    );
    setFormData((prev) => ({
      ...prev,
      countryCode: countryCode,
      country: selectedCountry?.name || "",
      region: "",
      // Only clear city if it's empty, preserve existing city
      city: prev.city || "",
    }));
  };

  const handleRegionChange = (region: string) => {
    setFormData((prev) => ({
      ...prev,
      region: region,
      // Only clear city if it's empty, preserve existing city
      city: prev.city || "",
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
        if (!formData.careTypeId || formData.careTypeId === 0)
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
        if (!formData.countryCode?.trim()) errors.push("Country is required");
        if (!formData.region?.trim()) errors.push("Region/County is required");
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
        (fieldName === "country" && error.toLowerCase().includes("country")) ||
        (fieldName === "region" &&
          error.toLowerCase().includes("region/county")) ||
        (fieldName === "careTypeId" &&
          error.toLowerCase().includes("care type")) ||
        (fieldName === "addressLine1" &&
          error.toLowerCase().includes("address line 1"))
    );
  };

  const getFormGroupClass = (fieldName: string): string => {
    return hasFieldError(fieldName)
      ? `${styles.formGroup} ${styles.error}`
      : styles.formGroup;
  };

  const handleSubmit = async () => {
    if (currentStep !== steps.length - 1) {
      return;
    }

    setIsSubmitting(true);

    try {
      const careHomeData = {
        ...formData,
        description: formData.description.filter((line) => line.trim() !== ""),
        imageUrls: formData.imageUrls.filter((url) => url.trim() !== ""),
        latitude:
          formData.latitude >= -90 && formData.latitude <= 90
            ? formData.latitude
            : undefined,
        longitude:
          formData.longitude >= -180 && formData.longitude <= 180
            ? formData.longitude
            : undefined,
      };

      const result = await updateCareHome(
        careHomeId,
        careHomeData as unknown as CreateCareHomeData
      );

      if (result.success) {
        toast.success("Care home updated successfully!");
        router.push("/admin/care-homes");
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
    { id: "media", label: "Images & Media", description: "Photos and media" },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className={styles.addCareHomeContainer}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading care home data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.addCareHomeContainer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/admin/care-homes" className={styles.backButton}>
              ← Back to Care Homes
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
                  <div className={styles.stepDescription}>
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                    <label htmlFor="description">Description</label>
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

          {/* Location & Contact Step - Similar to add page */}
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

                  <div className={getFormGroupClass("country")}>
                    <label htmlFor="country">
                      Country <span>*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.countryCode}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      required
                    >
                      <option value="">Select country</option>
                      {ukCountries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={getFormGroupClass("region")}>
                    <label htmlFor="region">
                      State <span>*</span>
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      required
                      disabled={!formData.countryCode}
                    >
                      <option value="">Select region/county</option>
                      {formData.countryCode &&
                        ukRegions[
                          formData.countryCode as keyof typeof ukRegions
                        ]?.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                    </select>
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

                  <div className={getFormGroupClass("latitude")}>
                    <label htmlFor="latitude">Latitude (optional)</label>
                    <input
                      type="number"
                      id="latitude"
                      name="latitude"
                      value={formData.latitude || ""}
                      onChange={handleInputChange}
                      step="0.000001"
                      min="-90"
                      max="90"
                      placeholder="57.6869"
                    />
                  </div>

                  <div className={getFormGroupClass("longitude")}>
                    <label htmlFor="longitude">Longitude (optional)</label>
                    <input
                      type="number"
                      id="longitude"
                      name="longitude"
                      value={formData.longitude || ""}
                      onChange={handleInputChange}
                      step="0.000001"
                      min="-180"
                      max="180"
                      placeholder="-2.0054"
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

                  <div className={getFormGroupClass("website")}>
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

                  <div className={getFormGroupClass("manager")}>
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
                  <div className={getFormGroupClass("weeklyPrice")}>
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

                  <div className={getFormGroupClass("monthlyPrice")}>
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
                  <div className={getFormGroupClass("totalBeds")}>
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

                  <div className={getFormGroupClass("availableBeds")}>
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
              <div className={getFormGroupClass("specializations")}>
                <h3>Specializations</h3>
                <div className={styles.checkboxGrid}>
                  {isLoadingConfig ? (
                    <div className={styles.loadingMessage}>
                      Loading specializations...
                    </div>
                  ) : (
                    specializations.map((specialization) => (
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
                    ))
                  )}
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Facilities</h3>
                <div className={styles.checkboxGrid}>
                  {isLoadingConfig ? (
                    <div className={styles.loadingMessage}>
                      Loading facilities...
                    </div>
                  ) : (
                    facilities.map((facility) => (
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
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Opening Hours Step */}
          {currentStep === 4 && (
            <div className={styles.tabContent}>
              <div className={styles.formSection}>
                <h3>Opening Hours</h3>
                <div className={styles.formGrid}>
                  {Object.entries(formData.openingHours).map(([day, hours]) => {
                    const timeMatch = hours.match(
                      /(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i
                    );
                    const openingTime = timeMatch
                      ? convertTo24Hour(timeMatch[1])
                      : "09:00";
                    const closingTime = timeMatch
                      ? convertTo24Hour(timeMatch[2])
                      : "17:00";

                    return (
                      <div key={day} className={styles.formGroup}>
                        <label htmlFor={`${day}-opening`}>{day}</label>
                        <div className={styles.timePickerContainer}>
                          <div className={styles.timePickerGroup}>
                            <label htmlFor={`${day}-opening`}>Opening</label>
                            <TimePicker
                              value={openingTime}
                              onChange={(time) => {
                                const newHours = `${formatTimeForDisplay(
                                  time
                                )} - ${formatTimeForDisplay(closingTime)}`;
                                handleOpeningHoursChange(day, newHours);
                              }}
                              placeholder="Opening time"
                            />
                          </div>
                          <div className={styles.timePickerGroup}>
                            <label htmlFor={`${day}-closing`}>Closing</label>
                            <TimePicker
                              value={closingTime}
                              onChange={(time) => {
                                const newHours = `${formatTimeForDisplay(
                                  openingTime
                                )} - ${formatTimeForDisplay(time)}`;
                                handleOpeningHoursChange(day, newHours);
                              }}
                              placeholder="Closing time"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Images & Media Step */}
          {currentStep === 5 && (
            <div className={styles.tabContent}>
              <div className={styles.formSection}>
                <h3>Images</h3>
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
    </AdminLayout>
  );
}
