import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import ProgramsSection from '@/components/home/ProgramsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TransformationsSection from '@/components/home/TransformationsSection';
import PricingSection from '@/components/home/PricingSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ConsultationCTA from '@/components/home/ConsultationCTA';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-brand-black text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Programs Section */}
        <ProgramsSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Transformations */}
        <TransformationsSection />

        {/* Pricing */}
        <PricingSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Consultation CTA */}
        <ConsultationCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
