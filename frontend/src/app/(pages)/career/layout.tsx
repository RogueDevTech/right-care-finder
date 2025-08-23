import "./globals.css";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}
