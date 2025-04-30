
import Navbar from "@/components/layouts/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Benefits from "@/components/home/Benefits";
import AppShowcase from "@/components/home/AppShowcase";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layouts/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Benefits />
        <AppShowcase />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
