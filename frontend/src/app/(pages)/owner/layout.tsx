import React from "react";
import OwnerLayout from "@/components/layout/owner-layout";

const OwnerPagesLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // This layout completely replaces the parent layout (no NavBar or Footer)
  return <OwnerLayout>{children}</OwnerLayout>;
};

export default OwnerPagesLayout;
