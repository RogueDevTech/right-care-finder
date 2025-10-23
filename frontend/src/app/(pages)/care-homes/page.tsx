import CareerPage from "@/features/career-home";
import React, { Suspense } from "react";

export default function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading care homes...</div>}>
        <CareerPage />
      </Suspense>
    </div>
  );
}
