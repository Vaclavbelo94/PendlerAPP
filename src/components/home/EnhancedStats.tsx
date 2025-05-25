
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Star, TrendingUp, Clock, Globe, Award } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

const stats = [
  { 
    icon: Users, 
    value: 1200, 
    suffix: '+', 
    label: 'Aktivních uživatelů', 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  { 
    icon: Star, 
    value: 4.8, 
    suffix: '/5', 
    label: 'Hodnocení', 
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  { 
    icon: TrendingUp, 
    value: 25, 
    suffix: '%', 
    label: 'Měsíční růst', 
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  { 
    icon: Clock, 
    value: 150, 
    suffix: 'h', 
    label: 'Ušetřený čas týdně', 
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  { 
    icon: Globe, 
    value: 15, 
    suffix: '+', 
    label: 'Podporovaných zemí', 
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10'
  },
  { 
    icon: Award, 
    value: 95, 
    suffix: '%', 
    label: 'Spokojenost uživatelů', 
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  }
];

export const EnhancedStats = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Pendler Buddy v číslech</h2>
          <p className="text-muted-foreground">Připojte se k tisícům spokojených uživatelů</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 10 }}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </motion.div>
                  
                  <AnimatedCounter 
                    from={0} 
                    to={stat.value} 
                    suffix={stat.suffix}
                  />
                  
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    {stat.label}
                  </p>
                  
                  {/* Progress bar animation */}
                  <motion.div
                    className="mt-3 h-1 bg-muted rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <motion.div
                      className={`h-full bg-gradient-to-r ${stat.color.replace('text-', 'from-')} to-transparent`}
                      initial={{ width: '0%' }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: index * 0.1 + 0.7 }}
                    />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
