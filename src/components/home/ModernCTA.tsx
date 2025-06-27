
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Check, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { motion } from 'framer-motion';

const ModernCTA = () => {
  const { user } = useAuth();

  const premiumFeatures = [
    'Neomezené směny a události',
    'Pokročilé analytiky a reporty',
    'Offline přístup ke všem funkcím',
    'Prioritní zákaznická podpora',
    'Export dat do PDF a Excel',
    'Bez reklam'
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Připraveni začít svou cestu?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Připojte se k tisícům spokojených pendlerů a začněte efektivněji spravovat svou práci v zahraničí.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - CTA content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Zap className="h-8 w-8 text-primary mr-3" />
                    <h3 className="text-2xl font-bold">Začněte zdarma</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Vyzkoušejte všechny základní funkce bez jakýchkoliv poplatků. 
                    Registrace trvá méně než minutu.
                  </p>

                  <div className="space-y-4 mb-8">
                    <Button 
                      size="lg" 
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold group"
                      asChild
                    >
                      <Link to="/register">
                        Registrovat zdarma
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                      ✓ Bez kreditní karty  ✓ Okamžitý přístup  ✓ Zrušitelné kdykoliv
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right side - Premium features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-amber-400 to-orange-500 border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Crown className="h-8 w-8 text-white mr-3" />
                    <h3 className="text-2xl font-bold text-white">Premium výhody</h3>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center text-white">
                        <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold group"
                    asChild
                  >
                    <Link to="/premium">
                      Upgradovat na Premium
                      <Crown className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernCTA;
