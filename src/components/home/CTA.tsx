
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 md:py-28 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-white" style={{ 
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)',
        opacity: 0.1 
      }}></div>
      <div className="absolute bottom-0 right-0 w-full h-24 bg-white" style={{ 
        clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)',
        opacity: 0.1 
      }}></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Váš průvodce světem práce v Německu
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/90">
            Objevte výhody našeho komplexního nástroje pro české pendlery. 
            Usnadníme vám komunikaci, orientaci v zákonech a pomohou vám ušetřit čas i peníze.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="font-semibold text-base px-8 py-6 rounded-xl bg-white text-primary-700 hover:bg-white/90"
            >
              Vyzkoušet zdarma
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="font-semibold text-base px-8 py-6 rounded-xl border-white text-white hover:bg-white/10 transition-all"
            >
              Zobrazit funkce <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Shapes */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full"></div>
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-1/3 left-10 w-24 h-24 bg-white/10 rounded-full"></div>
    </section>
  );
};

export default CTA;
