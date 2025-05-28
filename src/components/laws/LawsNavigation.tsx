
import React from 'react';
import { BookOpen, Briefcase, Euro, Users, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LawsNavigationProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const lawsTabs = [
  {
    id: 'all',
    icon: BookOpen,
    label: 'Všechny zákony',
    description: 'Kompletní přehled všech zákonů'
  },
  {
    id: 'work',
    icon: Briefcase,
    label: 'Pracovní právo',
    description: 'Zákony týkající se práce'
  },
  {
    id: 'tax',
    icon: Euro,
    label: 'Daně',
    description: 'Daňové předpisy a pravidla'
  },
  {
    id: 'social',
    icon: Users,
    label: 'Sociální zabezpečení',
    description: 'Sociální dávky a pojištění'
  },
  {
    id: 'health',
    icon: Heart,
    label: 'Zdravotní pojištění',
    description: 'Zdravotnické předpisy'
  }
];

export const LawsNavigation: React.FC<LawsNavigationProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-7xl">
        {lawsTabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onCategoryChange(tab.id)}
              className={cn(
                "relative p-4 md:p-6 rounded-2xl border text-center transition-all duration-300 group",
                "hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isActive 
                  ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 shadow-lg" 
                  : "bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/20"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background gradient for active state */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl"
                  layoutId="activeLawsTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 mb-3",
                    isActive 
                      ? "bg-gradient-to-br from-primary/20 to-accent/20 text-primary" 
                      : "bg-gradient-to-br from-muted/50 to-muted/30 text-muted-foreground group-hover:from-primary/10 group-hover:to-accent/10 group-hover:text-primary"
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                </motion.div>
                
                <h3 className={cn(
                  "font-semibold text-lg transition-colors duration-300 mb-2",
                  isActive 
                    ? "text-primary" 
                    : "text-foreground group-hover:text-primary"
                )}>
                  {tab.label}
                </h3>
                
                <p className={cn(
                  "text-sm transition-colors duration-300",
                  isActive 
                    ? "text-muted-foreground" 
                    : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {tab.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default LawsNavigation;
