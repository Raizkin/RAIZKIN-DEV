import Navbar from "../components/layout/Navbar";
import Hero from "../sections/Hero";
import Categories from "../sections/Categories";
import Product from "../pages/Product";
import Advantages from "../sections/Advantages";
import NewProducts from "../sections/NewProducts";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function Home() {
  return (
  <>
  <Navbar />
  <Hero />
  <Categories />
  <Product />
  <Advantages />
  <NewProducts />
  <Footer />
  <ScrollToTop />
</>
  );
}