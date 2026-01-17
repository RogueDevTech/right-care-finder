"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";
import NavBar from "@/components/navbar";
import { ISession } from "@/interfaces";

interface ConditionalLayoutProps {
  children: React.ReactNode;
  session: ISession | null;
}

export default function ConditionalLayout({
  children,
  session,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Don't show NavBar and Footer on owner pages - they have their own layout
  const isOwnerPage = pathname?.startsWith("/owner");

  if (isOwnerPage) {
    return <>{children}</>;
  }

  return (
    <div className="">
      <NavBar session={session} />
      {children}
      <Footer />
    </div>
  );
}
