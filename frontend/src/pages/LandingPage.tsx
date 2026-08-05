import Hero from '../components/hero/Hero';
import About from '../components/about/About';
import CTA from '../components/cta/CTA';
import Footer from '../components/footer/Footer';
import Navbar from '../components/navbar/Navbar';
import InfoFeatures from '../components/infofeatures/InfoFeatures';

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <InfoFeatures />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;