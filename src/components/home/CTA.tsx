
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/animated-section";

const CTA = () => {
  return (
    <section className="py-20 md:py-28 overflow-hidden relative">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 z-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-white" style={{ 
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)',
        opacity: 0.1 
      }}></div>
      <div className="absolute bottom-0 right-0 w-full h-24 bg-white" style={{ 
        clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)',
        opacity: 0.1 
      }}></div>
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute w-${2 + Math.floor(i % 4)} h-${2 + Math.floor(i % 4)} rounded-full bg-white/10`}
          initial={{ 
            x: `${20 + (i * 10)}%`, 
            y: `${15 + ((i * 7) % 50)}%`,
            opacity: 0.1 + (i * 0.02)
          }}
          animate={{ 
            y: [`${15 + ((i * 7) % 50)}%`, `${10 + ((i * 9) % 40)}%`, `${15 + ((i * 7) % 50)}%`],
            opacity: [0.1 + (i * 0.02), 0.2 + (i * 0.03), 0.1 + (i * 0.02)],
          }}
          transition={{ 
            duration: 3 + (i % 3), 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.2
          }}
        />
      ))}
      
      <div className="container-custom relative z-10">
        <AnimatedSection className="max-w-3xl mx-auto text-center" type="scale">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Váš průvodce světem práce v Německu
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl mb-10 text-white/90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Objevte výhody našeho komplexního nástroje pro české pendlery. 
            Usnadníme vám komunikaci, orientaci v zákonech a pomohou vám ušetřit čas i peníze.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="secondary" 
                size="lg" 
                className="font-semibold text-base px-8 py-6 rounded-xl bg-white text-primary-700 hover:bg-white/90"
              >
                Vyzkoušet zdarma
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                size="lg" 
                className="font-semibold text-base px-8 py-6 rounded-xl border-white text-white hover:bg-white/10 transition-all"
              >
                Zobrazit funkce
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    repeatDelay: 2
                  }}
                >
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </AnimatedSection>
      </div>
      
      {/* Shapes */}
      <motion.div 
        className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div 
        className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full"
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.18, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", delay: 1 }}
      />
      <motion.div 
        className="absolute top-1/3 right-10 w-16 h-16 bg-white/10 rounded-full"
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div 
        className="absolute bottom-1/3 left-10 w-24 h-24 bg-white/10 rounded-full"
        animate={{ 
          y: [0, 15, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
      />
    </section>
  );
};

export default CTA;
