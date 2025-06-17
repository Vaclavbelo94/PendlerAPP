
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Calculator, Languages, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const DHLModernHero = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Cestovní kalkulačky',
      description: 'Přesné výpočty nákladů na cestu'
    },
    {
      icon: Calculator,
      title: 'Daňový poradce',
      description: 'Profesionální daňové poradenství'
    },
    {
      icon: Languages,
      title: 'Překladač',
      description: 'Překlad dokumentů a komunikace'
    },
    {
      icon: Clock,
      title: 'Správa směn',
      description: 'Plánování a sledování pracovní doby'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/10">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* DHL Gradient Orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl animate-pulse delay-500" />
        
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-32 left-32 w-4 h-4 bg-primary/40 rounded-full"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 right-32 w-6 h-6 bg-secondary/40 transform rotate-45"
          animate={{
            rotate: [45, 90, 45],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Brand Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full border border-primary/30 mb-8"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-foreground/80">Profesionální řešení pro pendlery</span>
            </motion.div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Pendler
              </span>
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
                App
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Komplexní nástroje pro české pracovníky v zahraničí. 
              Kalkulačky, daňové poradenství, překladač a správa směn na jednom místě.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                asChild 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link to="/register">
                  Začít zdarma
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="border-primary/50 text-foreground hover:bg-primary/10 px-8 py-4 text-lg transition-all duration-300"
              >
                <Link to="/login">
                  Přihlásit se
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="group relative"
              >
                <div className="relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mt-16"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Důvěřují nám tisíce českých pendlerů
            </p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-primary">1000+</div>
              <div className="w-px h-8 bg-border" />
              <div className="text-sm text-muted-foreground">spokojených uživatelů</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DHLModernHero;
