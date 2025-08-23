import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import { getSession } from "@/actions-server/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <div>
      <NavBar session={session} />
      {children}
      <Footer />
    </div>
  );
}
