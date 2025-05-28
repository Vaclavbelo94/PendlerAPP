
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Calculator, 
  Car, 
  Languages, 
  DollarSign, 
  MapPin,
  Clock,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Calendar,
    title: "Správa směn",
    description: "Přehledný kalendář s možností plánování, úprav a exportu směn. Automatické výpočty mezd a přesčasů.",
    color: "from-blue-500/20 to-blue-600/20 border-blue-500/30"
  },
  {
    icon: Calculator,
    title: "Daňová kalkulačka",
    description: "Přesné výpočty daní pro práci v zahraničí. Porovnání daňových systémů a optimalizace příjmů.",
    color: "from-green-500/20 to-green-600/20 border-green-500/30"
  },
  {
    icon: Car,
    title: "Analýza dojíždění",
    description: "Sledování nákladů na dopravu, optimalizace tras a porovnání různých způsobů dopravy.",
    color: "from-purple-500/20 to-purple-600/20 border-purple-500/30"
  },
  {
    icon: Languages,
    title: "Jazykové lekce",
    description: "Praktické německé fráze pro práci, interaktivní cvičení a sledování pokroku v učení.",
    color: "from-amber-500/20 to-amber-600/20 border-amber-500/30"
  },
  {
    icon: MapPin,
    title: "Plánování cest",
    description: "Optimalizace tras, rezervace ubytování a plánování pracovních cest s úsporou času i peněz.",
    color: "from-indigo-500/20 to-indigo-600/20 border-indigo-500/30"
  },
  {
    icon: Shield,
    title: "Právní poradce",
    description: "Aktuální informace o právech pracovníků, minimální mzda a pracovní podmínky v zahraničí.",
    color: "from-red-500/20 to-red-600/20 border-red-500/30"
  }
];

export const UnifiedFeatures = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Vše co potřebujete na jednom místě
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Komplexní sada nástrojů pro efektivní správu práce v zahraničí
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group border-2 hover:border-primary/20">
                  <CardHeader className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
