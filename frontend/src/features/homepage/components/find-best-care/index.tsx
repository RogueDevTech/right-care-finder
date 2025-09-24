"use client";
import { GridIcon, LocationIcon } from "@/components/icon";
import CardHomeCare from "../care-home-cards";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./styles.module.scss";
import { useState } from "react";
import React from "react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// import Image from "next/image";
// import toggle from "@/../public/toggle.png";
const cards = [
  { title: "South East England", description: "1,210 Care Homes" },
  { title: "Greater London", description: "1,210 Care Homes" },
  { title: "East of England", description: "1,210 Care Homes" },
  { title: "West Midlands", description: "1,210 Care Homes" },
  { title: "East Midlands ", description: "1,210 Care Homes" },
  { title: "North West England", description: "1,210 Care Homes" },
  { title: "North East England", description: "1,210 Care Homes" },
  { title: "Yorkshire ", description: "1,210 Care Homes" },
  { title: "Scottish Highlands", description: "1,210 Care Homes" },
  { title: "Scottish Lowlands", description: "1,210 Care Homes" },
  { title: "Wales", description: "1,210 Care Homes" },
  { title: "North West England", description: "1,210 Care Homes" },
  { title: "Midlands", description: "1,210 Care Homes" },
  { title: "Wiltshire", description: "1,210 Care Homes" },
  { title: "Dorset", description: "1,210 Care Homes" },
];
const FindBestCare: React.FC = () => {
  const [selected, setSelected] = useState("Highest rated");
  const [toggle, setToggle] = useState("grid");
  const options = ["Highest rated", "Newest", "Oldest", "Most popular"];
  const locations: { id: number; name: string; coords: LatLngExpression }[] = [
    { id: 1, name: "London", coords: [51.505, -0.09] },
    { id: 2, name: "Manchester", coords: [53.48, -2.24] },
    { id: 3, name: "Birmingham", coords: [52.48, -1.89] },
    { id: 4, name: "Liverpool", coords: [53.41, -2.99] },
  ];

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
          cards.map((card, index) => (
            <CardHomeCare
              key={index}
              title={card.title}
              description={card.description}
            />
          ))
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
