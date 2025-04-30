
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 py-16 md:py-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-dark-600 leading-tight mb-4 animate-fade-in">
              Průvodce pro české <span className="text-primary-600">pendlery</span> v Německu
            </h1>
            <p className="text-lg md:text-xl text-dark-500 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in" style={{animationDelay: "0.2s"}}>
              Komplexní pomůcka pro každodenní život a práci českých pendlerů v Německu. 
              Od jazykové podpory přes právní pomoc až po plánování dopravy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{animationDelay: "0.3s"}}>
              <Button size="lg" className="font-semibold">
                Začít používat
              </Button>
              <Button size="lg" variant="outline" className="font-semibold">
                Zjistit více
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0 animate-fade-in" style={{animationDelay: "0.4s"}}>
            <div className="relative aspect-video">
              <div className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://source.unsplash.com/random/600x400/?commute,travel,work" 
                  alt="Commuters on the way to work" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative shapes */}
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary-100 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-48 h-48 bg-secondary-100 rounded-full opacity-40 blur-3xl"></div>
    </div>
  );
};

export default Hero;
