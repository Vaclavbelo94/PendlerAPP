
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Calculator, TrendingUp, FileText, FunctionSquare } from "lucide-react";
import { motion } from "framer-motion";

interface CalculatorWelcomeSectionProps {
  onQuickAccess: (calculatorType: string) => void;
}

const CalculatorWelcomeSection: React.FC<CalculatorWelcomeSectionProps> = ({ onQuickAccess }) => {
  const { user, isPremium } = useAuth();

  const quickAccessCalculators = [
    {
      id: "basic",
      title: "Základní kalkulačka",
      description: "Pro běžné matematické operace",
      icon: Calculator,
      popular: true
    },
    {
      id: "tax",
      title: "Daňová kalkulačka",
      description: "Výpočty daní a odvodů",
      icon: FileText,
      premium: false
    },
    {
      id: "crossborder",
      title: "Zahraniční práce",
      description: "Kalkulace pro pendlery",
      icon: TrendingUp,
      premium: true
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 py-8 px-6">
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h1 
              className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Kalkulačky
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Užitečné nástroje pro výpočty a plánování
            </motion.p>
          </div>
          
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {isPremium && (
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 flex items-center gap-1">
                Premium účet
              </Badge>
            )}
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Rychlý přístup</h2>
            <p className="text-muted-foreground">Nejpoužívanější kalkulačky pro rychlé výpočty</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickAccessCalculators.map((calc, index) => {
              const Icon = calc.icon;
              const isAccessible = !calc.premium || isPremium;
              
              return (
                <motion.div
                  key={calc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Card className={`cursor-pointer transition-all duration-300 hover:shadow-md ${!isAccessible ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm">{calc.title}</h3>
                            {calc.popular && (
                              <Badge variant="secondary" className="text-xs">Populární</Badge>
                            )}
                            {calc.premium && (
                              <Badge className="text-xs bg-amber-500">Premium</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{calc.description}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => onQuickAccess(calc.id)}
                        disabled={!isAccessible}
                      >
                        {isAccessible ? 'Otevřít' : 'Vyžaduje Premium'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CalculatorWelcomeSection;
