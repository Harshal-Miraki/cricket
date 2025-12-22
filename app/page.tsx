import HeroSection from "@/components/HeroSection";
import RegistrationForm from "@/components/RegistrationForm";
import RulesSection from "@/components/RulesSection";
import OrganizerSection from "@/components/OrganizerSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-blue-600/30 selection:text-blue-900">
      <HeroSection />
      <div id="registration-section">
        <RegistrationForm />
      </div>
      <RulesSection />
      <OrganizerSection />
      <Footer />
    </main>
  );
}
