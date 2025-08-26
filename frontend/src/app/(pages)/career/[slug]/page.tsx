"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  useHealthcareHomesActions,
  CareHome,
} from "@/actions-client/healthcare-homes";

export default function CareerSlugPage() {
  const [careHome, setCareHome] = useState<CareHome | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const careHomeId = params.slug as string;
  const { getCareHomeById } = useHealthcareHomesActions();

  useEffect(() => {
    const fetchCareHome = async () => {
      if (!careHomeId) return;

      setIsLoading(true);
      try {
        const response = await getCareHomeById(careHomeId);

        if (!response.success) {
          toast.error("Failed to load care home details");
          router.push("/career");
        } else {
          setCareHome(response.data || null);
        }
      } catch (error) {
        console.error("Error fetching care home:", error);
        toast.error("Failed to load care home details");
        router.push("/career");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCareHome();
  }, [careHomeId, getCareHomeById, router]);

  if (isLoading) {
    return (
      <div>
        <NavBar />
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Loading...
          </div>
          <p>Loading care home details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!careHome) {
    return (
      <div>
        <NavBar />
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Care Home Not Found</h2>
          <p>
            The care home you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/career")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0891b2",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            Back to Care Homes
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <NavBar />

      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            {careHome.name}
          </h1>
          <p style={{ color: "#666", marginBottom: "1rem" }}>
            {careHome.addressLine1}, {careHome.city}, {careHome.region}{" "}
            {careHome.postcode}
          </p>
          {careHome.careType && (
            <p style={{ color: "#0891b2", fontWeight: "500" }}>
              {careHome.careType.name}
            </p>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "2rem",
          }}
        >
          <div>
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                About this care home
              </h2>
              <p>
                {careHome.description && careHome.description.length > 0
                  ? careHome.description[0]
                  : "A modern care home offering comprehensive care services in a warm, family-like environment."}
              </p>
            </section>

            {careHome.specializations &&
              careHome.specializations.length > 0 && (
                <section style={{ marginBottom: "2rem" }}>
                  <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                    Specializations
                  </h2>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {careHome.specializations.map((spec, index) => (
                      <span
                        key={index}
                        style={{
                          padding: "0.25rem 0.75rem",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "1rem",
                          fontSize: "0.875rem",
                        }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </section>
              )}

            {careHome.facilities && careHome.facilities.length > 0 && (
              <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                  Facilities
                </h2>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {careHome.facilities.map((facility) => (
                    <div
                      key={facility.id}
                      style={{
                        padding: "1rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <h4 style={{ marginBottom: "0.5rem" }}>
                        {facility.name}
                      </h4>
                      <p style={{ color: "#666" }}>{facility.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside>
            <div
              style={{
                padding: "1.5rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ marginBottom: "1rem" }}>Contact Information</h3>
              <div>
                <p>
                  <strong>Phone:</strong> {careHome.phone}
                </p>
                <p>
                  <strong>Email:</strong> {careHome.email}
                </p>
                {careHome.website && (
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href={careHome.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#0891b2" }}
                    >
                      Visit website
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div
              style={{
                padding: "1.5rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
            >
              <h3 style={{ marginBottom: "1rem" }}>General Information</h3>
              <div>
                <p>
                  <strong>Total Beds:</strong> {careHome.totalBeds}
                </p>
                <p>
                  <strong>Available Beds:</strong> {careHome.availableBeds}
                </p>
                {careHome.weeklyPrice && (
                  <p>
                    <strong>Weekly Price:</strong> £
                    {careHome.weeklyPrice.toLocaleString()}
                  </p>
                )}
                {careHome.averageRating && (
                  <p>
                    <strong>Average Rating:</strong>{" "}
                    {careHome.averageRating.toFixed(1)}/5
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
