
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 pb-16 md:pt-28 md:pb-24">
      <div className="container-custom mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                Vaše podpora v Německu
              </span>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Průvodce pro české <span className="text-primary-600">pendlery</span> v Německu
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Komplexní pomůcka pro každodenní život a práci českých pendlerů v Německu. 
                Od jazykové podpory přes právní pomoc až po plánování dopravy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="font-medium text-base px-8 py-6 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30">
                  Začít používat
                </Button>
                <Button size="lg" variant="outline" className="font-medium text-base px-8 py-6 rounded-xl">
                  <span>Zjistit více</span>
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start mt-10 text-gray-600">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-medium">{i}</span>
                    </div>
                  ))}
                </div>
                <div className="ml-3">
                  <p className="text-sm"><span className="font-semibold">1000+</span> spokojených uživatelů</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative aspect-video">
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://source.unsplash.com/random/600x400/?commute,travel,work" 
                  alt="Commuters on the way to work" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Stats card */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg p-4 w-40">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
                  </div>
                </div>
                <p className="text-center text-gray-800 font-medium">Správa směn</p>
                <div className="mt-1 flex justify-center">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Naplánováno</span>
                </div>
              </div>
              
              {/* Language card */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 w-44">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Němčina</p>
                    <p className="text-xs text-gray-500">Pokrok výuky</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">65% dokončeno</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative shapes */}
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary-100 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-48 h-48 bg-secondary-100 rounded-full opacity-40 blur-3xl"></div>
    </div>
  );
};

export default Hero;
