
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Benefits from "@/components/home/Benefits";
import AppShowcase from "@/components/home/AppShowcase";
import CTA from "@/components/home/CTA";

const Index = () => {
  return (
    <div className="flex flex-col">
      <main className="flex-grow">
        <Hero />
        <Features />
        <Benefits />
        <AppShowcase />
        <CTA />
      </main>
    </div>
  );
};

export default Index;
