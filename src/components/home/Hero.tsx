import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/animated-section";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 pt-16 pb-16 md:pt-24 md:pb-24">
      <div className="container-custom mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="lg:w-1/2 text-center lg:text-left">
            <AnimatedSection type="slide" direction="left" duration={0.7}>
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
            </AnimatedSection>

            <AnimatedSection type="fade" delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg" 
                    className="font-medium text-base px-8 py-6 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30"
                  >
                    Začít používat
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(255, 235, 59, 0.1)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="font-medium text-base px-8 py-6 rounded-xl"
                  >
                    <span>Zjistit více</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "loop", 
                        duration: 1.5,
                        repeatDelay: 1
                      }}
                    >
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </motion.span>
                  </Button>
                </motion.div>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start mt-10 text-gray-600">
                <motion.div 
                  className="flex -space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i} 
                      className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + (i * 0.1), duration: 0.3 }}
                      whileHover={{ y: -3, scale: 1.1 }}
                    >
                      <span className="text-xs font-medium">{i}</span>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div 
                  className="ml-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <p className="text-sm"><span className="font-semibold">1000+</span> spokojených uživatelů</p>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
          
          <AnimatedSection type="scale" delay={0.2} className="lg:w-1/2">
            <div className="relative aspect-video">
              <motion.div 
                className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <img 
                  src="https://source.unsplash.com/random/600x400/?commute,travel,work" 
                  alt="Commuters on the way to work" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </motion.div>
              
              {/* Stats card */}
              <motion.div 
                className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg p-4 w-40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                }}
              >
                <div className="flex items-center justify-center mb-2">
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600"
                    animate={{ 
                      rotate: [0, 10, -10, 10, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line><path d="m9 16 2 2 4-4"></path></svg>
                  </motion.div>
                </div>
                <p className="text-center text-gray-800 font-medium">Správa směn</p>
                <div className="mt-1 flex justify-center">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Naplánováno</span>
                </div>
              </motion.div>
              
              {/* Language card */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 w-44"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                }}
              >
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Němčina</p>
                    <p className="text-xs text-gray-500">Pokrok výuky</p>
                  </div>
                </div>
                <motion.div 
                  className="w-full bg-gray-200 rounded-full h-1.5"
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="bg-primary-500 h-1.5 rounded-full" 
                    initial={{ width: "0%" }}
                    animate={{ width: "65%" }}
                    transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
                  ></motion.div>
                </motion.div>
                <p className="text-xs text-gray-500 mt-1">65% dokončeno</p>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* Decorative shapes */}
      <motion.div 
        className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary-100 rounded-full opacity-50 blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      ></motion.div>
      <motion.div 
        className="absolute top-1/2 right-0 transform -translate-y-1/2 w-48 h-48 bg-secondary-100 rounded-full opacity-40 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      ></motion.div>
    </div>
  );
};

export default Hero;
