
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Calendar, 
  Calculator, 
  BookOpen, 
  Languages, 
  MapPin,
  FileText,
  Scale,
  Sparkles
} from 'lucide-react';

const features = [
  {
    title: "Správa směn",
    description: "Sledujte své pracovní směny a plánujte si čas",
    icon: Calendar,
    href: "/shifts",
    color: "bg-blue-500",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    title: "Správa vozidla",
    description: "Údržba, náklady a dokumenty k vašemu vozidlu",
    icon: Car,
    href: "/vehicle", 
    color: "bg-green-500",
    gradient: "from-green-500 to-green-600"
  },
  {
    title: "Výuka němčiny",
    description: "Naučte se německy pro práci v zahraničí",
    icon: BookOpen,
    href: "/vocabulary",
    color: "bg-purple-500",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    title: "Překladač",
    description: "Překládejte texty a komunikujte bez překážek",
    icon: Languages,
    href: "/translator",
    color: "bg-indigo-500",
    gradient: "from-indigo-500 to-indigo-600"
  },
  {
    title: "Kalkulačka mezd",
    description: "Vypočítejte si čistou mzdu a daně",
    icon: Calculator,
    href: "/calculator",
    color: "bg-orange-500",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    title: "Plánovač cest",
    description: "Optimalizujte dojíždění do práce",
    icon: MapPin,
    href: "/travel-planning",
    color: "bg-red-500",
    gradient: "from-red-500 to-red-600"
  },
  {
    title: "Daňové poradenství",
    description: "Poradenství k daním a právním záležitostem",
    icon: FileText,
    href: "/tax-advisor",
    color: "bg-yellow-500",
    gradient: "from-yellow-500 to-yellow-600"
  },
  {
    title: "Přehled zákonů",
    description: "Důležité zákony pro práci v Německu",
    icon: Scale,
    href: "/laws",
    color: "bg-teal-500",
    gradient: "from-teal-500 to-teal-600"
  }
];

const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-background to-muted/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-4xl font-bold">
              Vše, co potřebujete na jednom místě
            </h2>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kompletní sada nástrojů pro úspěšnou práci v zahraničí
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={feature.href}>
                <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-card/50 backdrop-blur-sm h-full">
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <CardHeader className="pb-3 relative z-10">
                    <motion.div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 10,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                      }}
                    >
                      <feature.icon className="h-7 w-7" />
                    </motion.div>
                    
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                  
                  {/* Animated border */}
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-transparent"
                    whileHover={{
                      borderImage: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent) 1"
                    }}
                  />
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
