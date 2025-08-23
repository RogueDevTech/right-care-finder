"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import AdminLayout from "@/components/layout/admin-layout";
import { useAdminActions } from "@/actions-client/admin";
import styles from "./config.module.scss";

interface CareType {
  id: number;
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
}

interface Specialization {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

interface Facility {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
}

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState("care-types");
  const [isLoading, setIsLoading] = useState(true);
  const [careTypes, setCareTypes] = useState<CareType[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  // Form states
  const [showCareTypeForm, setShowCareTypeForm] = useState(false);
  const [showSpecializationForm, setShowSpecializationForm] = useState(false);
  const [showFacilityForm, setShowFacilityForm] = useState(false);

  // Form data
  const [careTypeForm, setCareTypeForm] = useState({
    name: "",
    description: "",
    icon: "",
    isActive: true,
  });

  const [specializationForm, setSpecializationForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const [facilityForm, setFacilityForm] = useState({
    name: "",
    description: "",
    icon: "",
    isActive: true,
  });

  // Edit states
  const [editingCareType, setEditingCareType] = useState<CareType | null>(null);
  const [editingSpecialization, setEditingSpecialization] =
    useState<Specialization | null>(null);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

  // Loading states
  const [isSubmittingCareType, setIsSubmittingCareType] = useState(false);
  const [isSubmittingSpecialization, setIsSubmittingSpecialization] =
    useState(false);
  const [isSubmittingFacility, setIsSubmittingFacility] = useState(false);
  const [isDeletingCareType, setIsDeletingCareType] = useState<number | null>(
    null
  );
  const [isDeletingSpecialization, setIsDeletingSpecialization] = useState<
    number | null
  >(null);
  const [isDeletingFacility, setIsDeletingFacility] = useState<string | null>(
    null
  );

  const {
    getCareTypes,
    createCareType,
    updateCareType,
    deleteCareType,
    getSpecializations,
    createSpecialization,
    updateSpecialization,
    deleteSpecialization,
    getFacilities,
    createFacility,
    updateFacility,
    deleteFacility,
  } = useAdminActions();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load care types
      const careTypesResult = await getCareTypes();
      if (careTypesResult.success && careTypesResult.data) {
        setCareTypes(careTypesResult.data);
      }

      // Load specializations
      const specializationsResult = await getSpecializations();
      if (specializationsResult.success && specializationsResult.data) {
        setSpecializations(specializationsResult.data);
      }

      // Load facilities
      const facilitiesResult = await getFacilities();
      if (facilitiesResult.success && facilitiesResult.data) {
        setFacilities(facilitiesResult.data);
      }
    } catch (error) {
      console.error("Error loading config data:", error);
      toast.error("Failed to load configuration data");
    } finally {
      setIsLoading(false);
    }
  };

  // Care Type CRUD
  const handleCareTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCareType(true);

    try {
      if (editingCareType) {
        const result = await updateCareType(editingCareType.id, careTypeForm);
        if (result.success) {
          toast.success("Care type updated successfully");
          if (result.data) {
            setCareTypes(
              careTypes.map((ct) =>
                ct.id === editingCareType.id ? result.data : ct
              )
            );
          }
        } else {
          toast.error(result.error || "Failed to update care type");
        }
      } else {
        const result = await createCareType({
          name: careTypeForm.name,
          description: careTypeForm.description,
          icon: careTypeForm.icon,
          isActive: careTypeForm.isActive,
        });
        if (result.success && result.data) {
          toast.success("Care type created successfully");
          setCareTypes([...careTypes, result.data]);
        } else {
          toast.error(result.error || "Failed to create care type");
        }
      }

      resetCareTypeForm();
    } catch (error) {
      console.error("Error saving care type:", error);
      toast.error("Failed to save care type");
    } finally {
      setIsSubmittingCareType(false);
    }
  };

  const handleEditCareType = (careType: CareType) => {
    setEditingCareType(careType);
    setCareTypeForm({
      name: careType.name,
      description: careType.description,
      icon: careType.icon || "",
      isActive: careType.isActive,
    });
    setShowCareTypeForm(true);
  };

  const handleDeleteCareType = async (id: number) => {
    if (!confirm("Are you sure you want to delete this care type?")) return;

    setIsDeletingCareType(id);
    try {
      const result = await deleteCareType(id);
      if (result.success) {
        toast.success("Care type deleted successfully");
        setCareTypes(careTypes.filter((ct) => ct.id !== id));
      } else {
        toast.error(result.error || "Failed to delete care type");
      }
    } catch (error) {
      console.error("Error deleting care type:", error);
      toast.error("Failed to delete care type");
    } finally {
      setIsDeletingCareType(null);
    }
  };

  const resetCareTypeForm = () => {
    setCareTypeForm({
      name: "",
      description: "",
      icon: "",
      isActive: true,
    });
    setEditingCareType(null);
    setShowCareTypeForm(false);
  };

  // Specialization CRUD
  const handleSpecializationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSpecialization(true);

    try {
      if (editingSpecialization) {
        const result = await updateSpecialization(
          editingSpecialization.id,
          specializationForm
        );
        if (result.success) {
          toast.success("Specialization updated successfully");
          if (result.data) {
            setSpecializations(
              specializations.map((s) =>
                s.id === editingSpecialization.id ? result.data! : s
              )
            );
          }
        } else {
          toast.error(result.error || "Failed to update specialization");
        }
      } else {
        const result = await createSpecialization(specializationForm);
        if (result.success && result.data) {
          toast.success("Specialization created successfully");
          setSpecializations([...specializations, result.data]);
        } else {
          toast.error(result.error || "Failed to create specialization");
        }
      }

      resetSpecializationForm();
    } catch (error) {
      console.error("Error saving specialization:", error);
      toast.error("Failed to save specialization");
    } finally {
      setIsSubmittingSpecialization(false);
    }
  };

  const handleEditSpecialization = (specialization: Specialization) => {
    setEditingSpecialization(specialization);
    setSpecializationForm({
      name: specialization.name,
      description: specialization.description || "",
      isActive: specialization.isActive,
    });
    setShowSpecializationForm(true);
  };

  const handleDeleteSpecialization = async (id: number) => {
    if (!confirm("Are you sure you want to delete this specialization?"))
      return;

    setIsDeletingSpecialization(id);
    try {
      const result = await deleteSpecialization(id);
      if (result.success) {
        toast.success("Specialization deleted successfully");
        setSpecializations(specializations.filter((s) => s.id !== id));
      } else {
        toast.error(result.error || "Failed to delete specialization");
      }
    } catch (error) {
      console.error("Error deleting specialization:", error);
      toast.error("Failed to delete specialization");
    } finally {
      setIsDeletingSpecialization(null);
    }
  };

  const resetSpecializationForm = () => {
    setSpecializationForm({
      name: "",
      description: "",
      isActive: true,
    });
    setEditingSpecialization(null);
    setShowSpecializationForm(false);
  };

  // Facility CRUD
  const handleFacilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFacility(true);

    try {
      if (editingFacility) {
        const result = await updateFacility(editingFacility.id, facilityForm);
        if (result.success) {
          toast.success("Facility updated successfully");
          if (result.data) {
            setFacilities(
              facilities.map((f) =>
                f.id === editingFacility.id ? result.data! : f
              )
            );
          }
        } else {
          toast.error(result.error || "Failed to update facility");
        }
      } else {
        const result = await createFacility(facilityForm);
        if (result.success && result.data) {
          toast.success("Facility created successfully");
          setFacilities([...facilities, result.data]);
        } else {
          toast.error(result.error || "Failed to create facility");
        }
      }

      resetFacilityForm();
    } catch (error) {
      console.error("Error saving facility:", error);
      toast.error("Failed to save facility");
    } finally {
      setIsSubmittingFacility(false);
    }
  };

  const handleEditFacility = (facility: Facility) => {
    setEditingFacility(facility);
    setFacilityForm({
      name: facility.name,
      description: facility.description || "",
      icon: facility.icon || "",
      isActive: facility.isActive,
    });
    setShowFacilityForm(true);
  };

  const handleDeleteFacility = async (id: string) => {
    if (!confirm("Are you sure you want to delete this facility?")) return;

    setIsDeletingFacility(id);
    try {
      const result = await deleteFacility(id);
      if (result.success) {
        toast.success("Facility deleted successfully");
        setFacilities(facilities.filter((f) => f.id !== id));
      } else {
        toast.error(result.error || "Failed to delete facility");
      }
    } catch (error) {
      console.error("Error deleting facility:", error);
      toast.error("Failed to delete facility");
    } finally {
      setIsDeletingFacility(null);
    }
  };

  const resetFacilityForm = () => {
    setFacilityForm({
      name: "",
      description: "",
      icon: "",
      isActive: true,
    });
    setEditingFacility(null);
    setShowFacilityForm(false);
  };

  const tabs = [
    { id: "care-types", label: "Care Types", count: careTypes.length },
    {
      id: "specializations",
      label: "Specializations",
      count: specializations.length,
    },
    { id: "facilities", label: "Facilities", count: facilities.length },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className={styles.configContainer}>
          <div className={styles.loading}>Loading configuration...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.configContainer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/admin" className={styles.backButton}>
              ← Back to Admin
            </Link>
            <h1>Configuration Management</h1>
          </div>
        </div>

        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.active : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className={styles.count}>({tab.count})</span>
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {/* Care Types Tab */}
          {activeTab === "care-types" && (
            <div className={styles.tabContent}>
              <div className={styles.sectionHeader}>
                <h2>Care Types</h2>
                <button
                  className={styles.addButton}
                  onClick={() => setShowCareTypeForm(true)}
                >
                  + Add Care Type
                </button>
              </div>

              {showCareTypeForm && (
                <div className={styles.formOverlay}>
                  <div className={styles.form}>
                    <div className={styles.formHeader}>
                      <h3>
                        {editingCareType ? "Edit Care Type" : "Add Care Type"}
                      </h3>
                      <button
                        className={styles.closeButton}
                        onClick={resetCareTypeForm}
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={handleCareTypeSubmit}>
                      <div className={styles.formGroup}>
                        <label htmlFor="careTypeName">
                          Name <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="careTypeName"
                          value={careTypeForm.name}
                          onChange={(e) =>
                            setCareTypeForm({
                              ...careTypeForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter care type name"
                          required
                          disabled={isSubmittingCareType}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="careTypeDescription">
                          Description{" "}
                          <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <textarea
                          id="careTypeDescription"
                          value={careTypeForm.description}
                          onChange={(e) =>
                            setCareTypeForm({
                              ...careTypeForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe the care type and its features"
                          required
                          disabled={isSubmittingCareType}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="careTypeIcon">Icon (Optional)</label>
                        <input
                          type="text"
                          id="careTypeIcon"
                          value={careTypeForm.icon}
                          onChange={(e) =>
                            setCareTypeForm({
                              ...careTypeForm,
                              icon: e.target.value,
                            })
                          }
                          placeholder="e.g., fas fa-home, or icon URL"
                          disabled={isSubmittingCareType}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={careTypeForm.isActive}
                            onChange={(e) =>
                              setCareTypeForm({
                                ...careTypeForm,
                                isActive: e.target.checked,
                              })
                            }
                            disabled={isSubmittingCareType}
                          />
                          <span style={{ marginLeft: "0.5rem" }}>Active</span>
                        </label>
                      </div>
                      <div className={styles.formActions}>
                        <button
                          type="button"
                          onClick={resetCareTypeForm}
                          className={styles.cancelButton}
                          disabled={isSubmittingCareType}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`${styles.saveButton} ${
                            isSubmittingCareType ? styles.loading : ""
                          }`}
                          disabled={isSubmittingCareType}
                        >
                          {isSubmittingCareType
                            ? "Creating..."
                            : editingCareType
                            ? "Update"
                            : "Create"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className={styles.table}>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {careTypes.map((careType) => (
                      <tr key={careType.id}>
                        <td>{careType.name}</td>
                        <td>{careType.description}</td>
                        <td>
                          <span
                            className={`${styles.status} ${
                              careType.isActive
                                ? styles.active
                                : styles.inactive
                            }`}
                          >
                            {careType.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.editButton}
                              onClick={() => handleEditCareType(careType)}
                              disabled={isDeletingCareType === careType.id}
                            >
                              Edit
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDeleteCareType(careType.id)}
                              disabled={isDeletingCareType === careType.id}
                            >
                              {isDeletingCareType === careType.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Specializations Tab */}
          {activeTab === "specializations" && (
            <div className={styles.tabContent}>
              <div className={styles.sectionHeader}>
                <h2>Specializations</h2>
                <button
                  className={styles.addButton}
                  onClick={() => setShowSpecializationForm(true)}
                >
                  + Add Specialization
                </button>
              </div>

              {showSpecializationForm && (
                <div className={styles.formOverlay}>
                  <div className={styles.form}>
                    <div className={styles.formHeader}>
                      <h3>
                        {editingSpecialization
                          ? "Edit Specialization"
                          : "Add Specialization"}
                      </h3>
                      <button
                        className={styles.closeButton}
                        onClick={resetSpecializationForm}
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={handleSpecializationSubmit}>
                      <div className={styles.formGroup}>
                        <label htmlFor="specializationName">
                          Name <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="specializationName"
                          value={specializationForm.name}
                          onChange={(e) =>
                            setSpecializationForm({
                              ...specializationForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter specialization name"
                          required
                          disabled={isSubmittingSpecialization}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="specializationDescription">
                          Description (Optional)
                        </label>
                        <textarea
                          id="specializationDescription"
                          value={specializationForm.description}
                          onChange={(e) =>
                            setSpecializationForm({
                              ...specializationForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe the specialization and its benefits"
                          disabled={isSubmittingSpecialization}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={specializationForm.isActive}
                            onChange={(e) =>
                              setSpecializationForm({
                                ...specializationForm,
                                isActive: e.target.checked,
                              })
                            }
                            disabled={isSubmittingSpecialization}
                          />
                          <span style={{ marginLeft: "0.5rem" }}>Active</span>
                        </label>
                      </div>
                      <div className={styles.formActions}>
                        <button
                          type="button"
                          onClick={resetSpecializationForm}
                          className={styles.cancelButton}
                          disabled={isSubmittingSpecialization}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`${styles.saveButton} ${
                            isSubmittingSpecialization ? styles.loading : ""
                          }`}
                          disabled={isSubmittingSpecialization}
                        >
                          {isSubmittingSpecialization
                            ? "Creating..."
                            : editingSpecialization
                            ? "Update"
                            : "Create"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className={styles.table}>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specializations.map((specialization) => (
                      <tr key={specialization.id}>
                        <td>{specialization.name}</td>
                        <td>{specialization.description}</td>
                        <td>
                          <span
                            className={`${styles.status} ${
                              specialization.isActive
                                ? styles.active
                                : styles.inactive
                            }`}
                          >
                            {specialization.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.editButton}
                              onClick={() =>
                                handleEditSpecialization(specialization)
                              }
                              disabled={
                                isDeletingSpecialization === specialization.id
                              }
                            >
                              Edit
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() =>
                                handleDeleteSpecialization(specialization.id)
                              }
                              disabled={
                                isDeletingSpecialization === specialization.id
                              }
                            >
                              {isDeletingSpecialization === specialization.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Facilities Tab */}
          {activeTab === "facilities" && (
            <div className={styles.tabContent}>
              <div className={styles.sectionHeader}>
                <h2>Facilities</h2>
                <button
                  className={styles.addButton}
                  onClick={() => setShowFacilityForm(true)}
                >
                  + Add Facility
                </button>
              </div>

              {showFacilityForm && (
                <div className={styles.formOverlay}>
                  <div className={styles.form}>
                    <div className={styles.formHeader}>
                      <h3>
                        {editingFacility ? "Edit Facility" : "Add Facility"}
                      </h3>
                      <button
                        className={styles.closeButton}
                        onClick={resetFacilityForm}
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={handleFacilitySubmit}>
                      <div className={styles.formGroup}>
                        <label htmlFor="facilityName">
                          Name <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="facilityName"
                          value={facilityForm.name}
                          onChange={(e) =>
                            setFacilityForm({
                              ...facilityForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter facility name"
                          required
                          disabled={isSubmittingFacility}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="facilityDescription">
                          Description (Optional)
                        </label>
                        <textarea
                          id="facilityDescription"
                          value={facilityForm.description}
                          onChange={(e) =>
                            setFacilityForm({
                              ...facilityForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe the facility and its features"
                          disabled={isSubmittingFacility}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="facilityIcon">Icon (Optional)</label>
                        <input
                          type="text"
                          id="facilityIcon"
                          value={facilityForm.icon}
                          onChange={(e) =>
                            setFacilityForm({
                              ...facilityForm,
                              icon: e.target.value,
                            })
                          }
                          placeholder="e.g., fas fa-tree, or icon URL"
                          disabled={isSubmittingFacility}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={facilityForm.isActive}
                            onChange={(e) =>
                              setFacilityForm({
                                ...facilityForm,
                                isActive: e.target.checked,
                              })
                            }
                            disabled={isSubmittingFacility}
                          />
                          <span style={{ marginLeft: "0.5rem" }}>Active</span>
                        </label>
                      </div>
                      <div className={styles.formActions}>
                        <button
                          type="button"
                          onClick={resetFacilityForm}
                          className={styles.cancelButton}
                          disabled={isSubmittingFacility}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`${styles.saveButton} ${
                            isSubmittingFacility ? styles.loading : ""
                          }`}
                          disabled={isSubmittingFacility}
                        >
                          {isSubmittingFacility
                            ? "Creating..."
                            : editingFacility
                            ? "Update"
                            : "Create"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className={styles.table}>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilities.map((facility) => (
                      <tr key={facility.id}>
                        <td>{facility.name}</td>
                        <td>{facility.description}</td>
                        <td>
                          <span
                            className={`${styles.status} ${
                              facility.isActive
                                ? styles.active
                                : styles.inactive
                            }`}
                          >
                            {facility.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.editButton}
                              onClick={() => handleEditFacility(facility)}
                              disabled={isDeletingFacility === facility.id}
                            >
                              Edit
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDeleteFacility(facility.id)}
                              disabled={isDeletingFacility === facility.id}
                            >
                              {isDeletingFacility === facility.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
