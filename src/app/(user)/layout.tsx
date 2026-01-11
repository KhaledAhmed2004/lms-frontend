import Footer from "./components/footer/Footer";
import Navbar from "./components/nav/Navbar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main className="pt-16 md:pt-20">{children}</main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
