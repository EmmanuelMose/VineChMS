import Navbar from "../components/navbar/Navbar";
import Hero from "../components/hero/Hero";
import About from "../components/about/About";
import InfoFeatures from "../components/infofeatures/InfoFeatures";
import Services from "../components/services/Services";
import CTA from "../components/cta/CTA";
import Footer from "../components/footer/Footer";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <InfoFeatures />
      <CTA />
      <Footer />
    </div>
  );
}