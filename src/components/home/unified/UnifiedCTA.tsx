
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star } from 'lucide-react';
import { useAuth } from '@/hooks/auth';

export const UnifiedCTA = () => {
  const { user } = useAuth();

  const benefits = [
    "Zdarma pro začátečníky",
    "Bez poplatků za nastavení",
    "24/7 zákaznická podpora",
    "Pravidelné aktualizace"
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-accent text-primary-foreground relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50" />
      
      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex justify-center mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-current text-yellow-400" />
                ))}
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold">
              Připraveni začít svou cestu?
            </h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Připojte se k tisícům spokojených uživatelů, kteří již využívají 
              naše nástroje pro efektivní práci v zahraničí.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-12"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <Check className="h-5 w-5 text-green-300 flex-shrink-0" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {user ? (
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90">
                <Link to="/dashboard">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Pokračovat na Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90">
                  <Link to="/register">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Začít zdarma
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10">
                  <Link to="/pricing">
                    Zobrazit ceník
                  </Link>
                </Button>
              </>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-sm opacity-80"
          >
            Registrace trvá méně než minutu • Žádné skryté poplatky • Kdykoli můžete zrušit
          </motion.p>
        </div>
      </div>
    </section>
  );
};
