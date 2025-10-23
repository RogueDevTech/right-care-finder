"use client";
import { GridIcon, LocationIcon } from "@/components/icon";
import CardHomeCare from "../care-home-cards";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import React from "react";
import dynamic from "next/dynamic";
import {
  useHealthcareHomesActions,
  RegionStatistics,
} from "@/actions-client/healthcare-homes";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const FindBestCare: React.FC = () => {
  const [selected, setSelected] = useState("Highest rated");
  const [toggle, setToggle] = useState("grid");
  const [regionStats, setRegionStats] = useState<RegionStatistics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const options = ["Highest rated", "Newest", "Oldest", "Most popular"];
  const { getRegionStatistics } = useHealthcareHomesActions();

  const locations: { id: number; name: string; coords: LatLngExpression }[] = [
    { id: 1, name: "London", coords: [51.505, -0.09] },
    { id: 2, name: "Manchester", coords: [53.48, -2.24] },
    { id: 3, name: "Birmingham", coords: [52.48, -1.89] },
    { id: 4, name: "Liverpool", coords: [53.41, -2.99] },
  ];

  useEffect(() => {
    // Configure Leaflet icons only on client side
    const configureLeaflet = async () => {
      if (typeof window !== "undefined") {
        const L = await import("leaflet");
        const markerIcon2x = await import(
          "leaflet/dist/images/marker-icon-2x.png"
        );
        const markerIcon = await import("leaflet/dist/images/marker-icon.png");
        const markerShadow = await import(
          "leaflet/dist/images/marker-shadow.png"
        );

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: markerIcon2x.default?.src || markerIcon2x,
          iconUrl: markerIcon.default?.src || markerIcon,
          shadowUrl: markerShadow.default?.src || markerShadow,
        });
      }
    };

    configureLeaflet();
  }, []);

  useEffect(() => {
    const fetchRegionStats = async () => {
      try {
        setIsLoading(true);
        const result = await getRegionStatistics();
        if (result.success && result.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setRegionStats((result.data as any).data || []);
        } else {
          console.error("Failed to fetch region statistics:", result.error);
        }
      } catch (error) {
        console.error("Error fetching region statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegionStats();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.intro}>
          <h1>Find the Best Care Homes Near You</h1>
          <p>
            Finding the right care home for your loved one is easier when you
            can compare locations, services, and real resident feedback. Our
            ratings are based on recent reviews, care quality, staff
            friendliness, and overall resident satisfaction — giving you a
            reliable guide for making informed decisions.
          </p>
        </div>
        <div className={styles.filter}>
          <div className={styles.sortCard}>
            <span className={styles.label}>Sort by:</span>
            <div className={styles.dropdown}>
              <button className={styles.dropdownBtn}>{selected} ▼</button>
              <div className={styles.dropdownContent}>
                {options.map((option, i) => (
                  <div
                    key={i}
                    className={styles.dropdownItem}
                    onClick={() => setSelected(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className={`${styles.toggle} ${
              toggle === "map" ? styles.toggleGrid : ""
            }`}
            onClick={() => setToggle(toggle === "grid" ? "map" : "grid")}
          >
            <div className={styles.loc}>
              <LocationIcon />
            </div>
            <div className={styles.gridIcon}>
              <GridIcon />
            </div>
            <div
              className={`${styles.toggleDot} ${
                toggle === "grid" ? styles.grid : styles.map
              }`}
            ></div>
          </div>
          {/* <div className={styles.toggle}>
            <Image src={toggle} alt="toggle" />
          </div> */}
        </div>
      </div>
      <div className={styles.cardWrapper}>
        {toggle === "grid" ? (
          isLoading ? (
            <div className={styles.loadingContainer}>
              <p>Loading region statistics...</p>
            </div>
          ) : (
            <>
              {console.log(
                "Rendering regions:",
                regionStats.length,
                regionStats
              )}
              {regionStats.map((stat, index) => (
                <CardHomeCare
                  key={index}
                  title={stat.region}
                  description={`${stat.count.toLocaleString()} Care Homes`}
                  rating={stat.averageRating}
                />
              ))}
            </>
          )
        ) : (
          <MapContainer
            center={[51.505, -0.09]}
            zoom={6}
            scrollWheelZoom={false}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc) => (
              <Marker key={loc.id} position={loc.coords}>
                <Popup>{loc.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};
export default FindBestCare;
