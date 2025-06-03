
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Languages, 
  Calculator, 
  Car, 
  GraduationCap, 
  Scale,
  Map,
  Settings,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export const ModernFeatures = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Správa směn',
      description: 'Efektivní plánování a správa pracovních směn s automatickými připomínkami.',
      route: '/shifts',
      color: 'from-blue-500 to-blue-600',
      badge: 'Populární',
      image: '🗓️'
    },
    {
      icon: Languages,
      title: 'Výuka němčiny',
      description: 'Interaktivní kurzy němčiny zaměřené na pracovní prostředí a každodenní komunikaci.',
      route: '/vocabulary',
      color: 'from-green-500 to-green-600',
      badge: 'Nové',
      image: '🇩🇪'
    },
    {
      icon: Calculator,
      title: 'Daňové kalkulačky',
      description: 'Přesné výpočty mezd, daní a pojištění pro práci v Německu.',
      route: '/calculator',
      color: 'from-purple-500 to-purple-600',
      badge: 'Aktualizováno',
      image: '💰'
    },
    {
      icon: Car,
      title: 'Správa vozidel',
      description: 'Evidence vozidel, nákladů na palivo a údržbu pro pendlery.',
      route: '/vehicle',
      color: 'from-orange-500 to-orange-600',
      badge: null,
      image: '🚗'
    },
    {
      icon: Map,
      title: 'Plánování cest',
      description: 'Optimalizace tras a plánování cest do práce s analýzou nákladů.',
      route: '/travel',
      color: 'from-cyan-500 to-cyan-600',
      badge: null,
      image: '🗺️'
    },
    {
      icon: Scale,
      title: 'Právní poradenství',
      description: 'Přehled zákonů a práv pracovníků v Německu s praktickými radami.',
      route: '/laws',
      color: 'from-red-500 to-red-600',
      badge: 'Důležité',
      image: '⚖️'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Vše co potřebujete na jednom místě
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kompletní sada nástrojů pro úspěšnou práci v Německu. Od správy směn po výuku jazyka.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <CardHeader className="relative">
                  {feature.badge && (
                    <Badge className="absolute top-4 right-4 z-10" variant="secondary">
                      {feature.badge}
                    </Badge>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl">{feature.image}</div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground mb-6 flex-1">
                    {feature.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    asChild
                  >
                    <Link to={feature.route}>
                      Prozkoumat
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModernFeatures;
