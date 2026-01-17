import React from "react";
import { getSession } from "@/actions-server";
import ConditionalLayout from "@/components/layout/conditional-layout";

const Layout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const session = await getSession();

  return <ConditionalLayout session={session}>{children}</ConditionalLayout>;
};

export default Layout;
