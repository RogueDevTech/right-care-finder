"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.scss";
// import careHomeHero from "@/../public/careHomeHero.png";

type ImageType = {
  id: number;
  src: string;
  alt: string;
};

const initialImages: ImageType[] = [
  {
    id: 1,
    src: "/careHomeHero.png",
    alt: "Elderly couple in living room",
  },
  {
    id: 2,
    src: "/img2.png",
    alt: "Smiling elderly woman outdoors",
  },
  { id: 3, src: "/img3.png", alt: "Apartment building" },
  { id: 4, src: "/img4.png", alt: "Man reading in garden" },
];

export default function Gallery() {
  const [images, setImages] = useState(initialImages);

  const handleThumbnailClick = (index: number) => {
    const newImages = [...images];
    [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
    setImages(newImages);
  };

  return (
    <div className={styles.gallery}>
      {/* Left Side - Enlarged Image */}
      <div className={styles.preview}>
        <Image
          src={images[0].src}
          alt={images[0].alt}
          width={800}
          height={600}
          className={styles.mainImage}
        />
      </div>

      {/* Right Side - Thumbnails */}
      <div className={styles.thumbnails}>
        {images.slice(1).map((img, index) => (
          <div
            key={img.id}
            className={styles.thumb}
            onClick={() => handleThumbnailClick(index + 1)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className={styles.thumbImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
