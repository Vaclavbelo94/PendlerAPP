
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-16 md:py-24 gradient-bg text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Připraveni zjednodušit si život českého pendlera?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            Získejte přístup ke všem nástrojům, které vám pomohou s plánováním směn, výukou němčiny, 
            správou vozidla a porozuměním německým zákonům.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="font-semibold">
              Začít zdarma
            </Button>
            <Button variant="outline" size="lg" className="font-semibold border-white text-white hover:bg-white hover:text-primary transition-all">
              Zjistit více <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full"></div>
    </section>
  );
};

export default CTA;
