
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Připraveni začít vaši cestu?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Připojte se k tisícům uživatelů, kteří již využívají Pendlerův Pomocník 
            pro efektivnější práci v zahraničí.
          </p>
          
          {/* Stats row */}
          <motion.div
            className="flex justify-center items-center space-x-8 mb-10 flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center text-sm">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-semibold">4.8/5</span>
              <span className="text-muted-foreground ml-1">hodnocení</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-semibold">1200+</span>
              <span className="text-muted-foreground ml-1">uživatelů</span>
            </div>
            <div className="flex items-center text-sm">
              <Zap className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-semibold">99.9%</span>
              <span className="text-muted-foreground ml-1">dostupnost</span>
            </div>
          </motion.div>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="px-8 py-3 text-lg group">
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
              <Button asChild variant="outline" size="lg" className="px-8 py-3 text-lg backdrop-blur-sm bg-background/50">
                <Link to="/premium">
                  Zobrazit Premium
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.p
            className="text-sm text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Žádné poplatky za aktivaci • Zrušení kdykoli • Bezpečné platby
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
