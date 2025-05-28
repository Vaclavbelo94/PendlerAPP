
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, PlayCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export const UnifiedHero = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              Váš průvodce pro práci v zahraničí
            </Badge>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Pendlerův
              </span>
              <br />
              <span className="text-foreground">Pomocník</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Komplexní aplikace pro správu směn, vzdělávání a efektivní dojíždění. 
              Vše co potřebujete pro úspěšnou práci v zahraničí na jednom místě.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {user ? (
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                <Link to="/dashboard">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Přejít na Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                  <Link to="/register">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Začít zdarma
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link to="/login">
                    Přihlásit se
                  </Link>
                </Button>
              </>
            )}
            
            <Button variant="ghost" size="lg" className="text-lg px-8 py-6 group">
              <PlayCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Jak to funguje
            </Button>
          </motion.div>

          {/* Stats preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16"
          >
            {[
              { number: "10K+", label: "Aktivních uživatelů" },
              { number: "500K+", label: "Spravovaných směn" },
              { number: "2K+", label: "Úspěšných přechodů" },
              { number: "24/7", label: "Podpora" }
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
