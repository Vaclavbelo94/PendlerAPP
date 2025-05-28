
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, Award } from 'lucide-react';
import CountUp from 'react-countup';

const stats = [
  {
    icon: Users,
    number: 12500,
    suffix: "+",
    label: "Aktivních uživatelů",
    description: "Spolehlivě používá naši aplikaci"
  },
  {
    icon: Clock,
    number: 580000,
    suffix: "+",
    label: "Hodin práce",
    description: "Celkem zaznamenáno v systému"
  },
  {
    icon: TrendingUp,
    number: 98,
    suffix: "%",
    label: "Spokojených uživatelů",
    description: "Doporučuje aplikaci dalším"
  },
  {
    icon: Award,
    number: 15,
    suffix: "",
    label: "Zemí podporováno",
    description: "Pro práci v zahraničí"
  }
];

export const UnifiedStats = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/5 via-background to-accent/5">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Výsledky, kterým můžete věřit
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Tisíce uživatelů již využívají naše nástroje pro efektivní práci
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="text-center space-y-4 p-6 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">
                    <CountUp 
                      end={stat.number} 
                      duration={2.5}
                      separator=","
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
