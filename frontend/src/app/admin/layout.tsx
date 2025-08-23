// import AdminGuard from "@/providers/admin-guard";

import AdminGuard from "@/providers/admin-guard";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AdminGuard>{children}</AdminGuard>
    </div>
  );
}
