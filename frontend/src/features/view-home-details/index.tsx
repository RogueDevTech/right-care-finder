"use client";
import AboutCareHome from "./about-care-home";
import CaresProvided from "./cares-provided";
import EnquiryDetails from "./enquiry-details";
import Facilities from "./facilities";
import Gallery from "./hero-section";
import RatingsAndReview from "./ratings-and-reviews";
export default function ViewHomeDetails() {
  return (
    <div className="">
      <Gallery />
      <EnquiryDetails />
      <CaresProvided />
      <Facilities />
      <AboutCareHome />
      <RatingsAndReview />
    </div>
  );
}
