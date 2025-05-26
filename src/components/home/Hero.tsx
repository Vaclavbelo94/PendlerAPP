
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { FloatingIcons } from './FloatingIcons';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <section className={`relative overflow-hidden ${isMobile ? 'mobile-hero-section' : 'min-h-screen flex items-center justify-center'}`}>
      {/* Animated background elements */}
      <AnimatedBackground />
      <FloatingIcons />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm backdrop-blur-sm bg-background/50">
              <Sparkles className="h-3 w-3 mr-2" />
              🚀 Vítejte v Pendlerově Pomocníkovi!
            </Badge>
          </motion.div>
          
          <motion.h1
            className={`font-bold tracking-tight mb-6 ${
              isMobile 
                ? 'text-3xl md:text-4xl' 
                : 'text-5xl md:text-7xl'
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pendlerův Pomocník
            </span>
          </motion.h1>
          
          <motion.p
            className={`text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed mobile-text-optimize ${
              isMobile 
                ? 'text-lg px-4' 
                : 'text-xl md:text-2xl'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Kompletní aplikace pro všechny, kteří pracují v zahraničí. 
            Spravujte směny, vozidlo, učte se jazyky a využívejte nástroje pro efektivní práci.
          </motion.p>
          
          <motion.div
            className={`flex gap-4 justify-center mb-12 ${
              isMobile 
                ? 'flex-col px-4' 
                : 'flex-col sm:flex-row'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className={`px-8 py-3 text-lg group mobile-button-spacing ${isMobile ? 'w-full' : ''}`}>
                <Link to="/register">
                  Začít zdarma
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" size="lg" className={`px-8 py-3 text-lg backdrop-blur-sm bg-background/50 mobile-button-spacing ${isMobile ? 'w-full' : ''}`}>
                <Link to="/login">
                  Přihlásit se
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Interactive feature cards preview */}
          <motion.div
            className={`grid gap-4 max-w-4xl mx-auto ${
              isMobile 
                ? 'grid-cols-2 px-4' 
                : 'grid-cols-2 md:grid-cols-4'
            }`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {[
              { label: "Správa směn", color: "bg-blue-500/10 text-blue-600" },
              { label: "Vozidlo", color: "bg-green-500/10 text-green-600" },
              { label: "Němčina", color: "bg-purple-500/10 text-purple-600" },
              { label: "Překladač", color: "bg-orange-500/10 text-orange-600" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`p-3 rounded-lg ${item.color} text-sm font-medium backdrop-blur-sm mobile-touch-target`}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator - skrýt na mobilních zařízeních */}
      {!isMobile && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border border-muted rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-primary rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;
