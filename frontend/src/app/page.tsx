import React from "react";
import Homepage from "@/features/homepage";
import Footer from "@/components/footer";
import NavBar from "@/components/navbar";
import { getSession } from "@/actions-server";
const Home: React.FC = async () => {
  const session = await getSession();
  return (
    <div className="">
      <NavBar session={session} />
      <Homepage />
      <Footer />
    </div>
  );
};

export default Home;
