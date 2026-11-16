import Starfield from '@/components/Starfield';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SmartDemo from '@/components/SmartDemo';
import GallerySection from '@/components/GallerySection';
import HowItWorks from '@/components/HowItWorks';
import RuleEngine from '@/components/RuleEngine';
import Analytics from '@/components/Analytics';
import Features from '@/components/Features';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-transparent overflow-x-hidden">
      <Starfield />
      
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        
        <section id="demo">
          <SmartDemo />
        </section>

        <section id="about">
          <GallerySection />
        </section>
        
        <section id="how-it-works">
          <HowItWorks />
        </section>
        
        <RuleEngine />
        
        <section id="analytics">
          <Analytics />
        </section>
        
        <section id="features">
          <Features />
        </section>
        
        <FinalCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
