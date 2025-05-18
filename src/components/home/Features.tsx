
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Languages, Calendar, ArrowRight, BarChart3 } from "lucide-react"; // Přidaná ikona BarChart3
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AnimatedCard, HoverEffectCard } from "@/components/ui/animated-section";
import { motion } from "framer-motion";

const features = [
  {
    icon: Languages,
    title: "Výuka němčiny",
    description: "Základní fráze, odborná slovní zásoba a praktická gramatika pro každodenní komunikaci v práci i mimo ni.",
    link: "/language"
  },
  {
    icon: Car,
    title: "Správa vozidla",
    description: "Sledování údržby vozidla, připomínky pro technické kontroly a důležité dopravní předpisy v Německu.",
    link: "/vehicle"
  },
  {
    icon: Calendar,
    title: "Plánování směn a spolujízda",
    description: "Kalendář směn a organizace spolujízdy s dalšími pendlery na vaší trase do práce.",
    link: "/shifts"
  },
  {
    icon: Calendar,
    title: "Přehled zákonů",
    description: "Srozumitelné informace o německém pracovním právu, daních, pojištění a všem, co český pendler potřebuje znát.",
    link: "/laws"
  },
  {
    icon: Languages,
    title: "Překladač",
    description: "Přeložte si jednoduše text z češtiny do němčiny pro snazší komunikaci v práci i běžném životě.",
    link: "/translator"
  },
  {
    icon: BarChart3, // Nová ikona pro Dashboard funkci
    title: "Osobní Dashboard",
    description: "Přehledné statistiky a vizualizace vašeho pokroku a aktivit v jednom přehledném místě.",
    link: "/dashboard",
    isPremium: true // Označení jako prémiové funkce
  }
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-transparent">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Co nabízíme</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pendler Helper poskytuje komplexní nástroje, které vám pomohou s každodenními výzvami 
            při práci v zahraničí.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedCard key={index} index={index} delay={0.2}>
              <HoverEffectCard className="h-full feature-card">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  >
                    <feature.icon className="feature-icon" />
                  </motion.div>
                  <CardTitle className="flex items-center gap-2">
                    {feature.title}
                    {feature.isPremium && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                        Premium
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {feature.description}
                  </CardDescription>
                  <Link to={feature.link} className="group inline-flex items-center text-primary hover:text-primary-600 font-medium">
                    Více informací 
                    <motion.div
                      className="inline-block ml-2"
                      whileHover={{ x: 5 }}
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        x: { repeat: Infinity, repeatDelay: 2, duration: 1.2 } 
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Link>
                </CardContent>
              </HoverEffectCard>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
