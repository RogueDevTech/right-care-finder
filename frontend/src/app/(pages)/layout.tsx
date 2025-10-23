import React from "react";
import Footer from "@/components/footer";
import NavBar from "@/components/navbar";
import { getSession } from "@/actions-server";
const Layout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const session = await getSession();
  return (
    <div className="">
      <NavBar session={session} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
