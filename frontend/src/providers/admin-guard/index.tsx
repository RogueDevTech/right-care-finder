import { ISession } from "@/interfaces";
import React, { ReactNode } from "react";
import { getSession } from "@/actions-server";
import { redirect } from "next/navigation";

const AdminGuard = async ({ children }: { children: ReactNode }) => {
  const session: ISession = await getSession();
  if (!session.isLoggedIn || !["admin"].includes(session.user?.role || "")) {
    redirect("/");
  }
  return <>{children}</>;
};

export default AdminGuard;
