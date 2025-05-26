
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  TrendingUp, 
  Shield, 
  Users, 
  BookOpen, 
  Smartphone,
  Globe,
  Calculator
} from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: "Úspora času",
    description: "Automatizujte své každodenní úkoly a získejte více času pro to, co je důležité.",
    color: "bg-blue-500"
  },
  {
    icon: TrendingUp,
    title: "Lepší organizace",
    description: "Mějte přehled o svých směnách, financích a pokroku v učení na jednom místě.",
    color: "bg-green-500"
  },
  {
    icon: Shield,
    title: "Bezpečnost dat",
    description: "Vaše data jsou chráněna moderními bezpečnostními standardy a šifrováním.",
    color: "bg-purple-500"
  },
  {
    icon: Users,
    title: "Komunitní podpora",
    description: "Připojte se k tisícům uživatelů, kteří sdílejí své zkušenosti a rady.",
    color: "bg-orange-500"
  },
  {
    icon: BookOpen,
    title: "Kontinuální učení",
    description: "Zlepšujte své jazykové dovednosti s interaktivními cvičeními a testy.",
    color: "bg-red-500"
  },
  {
    icon: Globe,
    title: "Podpora více jazyků",
    description: "Aplikace podporuje češtinu, němčinu a další jazyky pro snadnou komunikaci.",
    color: "bg-indigo-500"
  },
  {
    icon: Smartphone,
    title: "Mobilní přístup",
    description: "Používejte aplikaci kdykoli a kdekoli díky responzivnímu designu.",
    color: "bg-pink-500"
  },
  {
    icon: Calculator,
    title: "Finanční nástroje",
    description: "Spočítejte si daně, náklady na dopravu a optimalizujte své finance.",
    color: "bg-teal-500"
  }
];

const Benefits = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Proč používat Pendlerův Pomocník?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Objevte výhody, které vám naše aplikace přinese ve vaší práci v zahraničí
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center h-full flex flex-col">
                  <motion.div
                    className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 5 }}
                  >
                    <benefit.icon className="h-8 w-8" />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm flex-1">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Připojte se k rostoucí komunitě spokojených uživatelů
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Ověřené bezpečnostní standardy
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              24/7 zákaznická podpora
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Pravidelné aktualizace
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
