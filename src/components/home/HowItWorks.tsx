
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Settings, Zap, Crown } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: "Registrace",
    description: "Vytvořte si účet zdarma během několika sekund",
    color: "bg-blue-500"
  },
  {
    icon: Settings,
    title: "Nastavení",
    description: "Přizpůsobte si aplikaci podle vašich potřeb",
    color: "bg-green-500"
  },
  {
    icon: Zap,
    title: "Používání",
    description: "Začněte používat všechny dostupné funkce",
    color: "bg-orange-500"
  },
  {
    icon: Crown,
    title: "Premium",
    description: "Odemkněte pokročilé funkce s Premium plánem",
    color: "bg-purple-500"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Jak to funguje?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Začněte používat Pendler Buddy ve čtyřech jednoduchých krocích
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <step.icon className="h-8 w-8" />
                  </motion.div>
                  
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted/10">
                    {index + 1}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Connection lines for desktop */}
        <div className="hidden lg:block relative -mt-20">
          <svg className="absolute inset-0 w-full h-40" viewBox="0 0 1200 160">
            <motion.path
              d="M 200 80 Q 400 60 600 80 Q 800 100 1000 80"
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="10,5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
};
