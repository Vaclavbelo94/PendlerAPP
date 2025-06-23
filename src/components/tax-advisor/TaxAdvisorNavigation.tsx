
import React from 'react';
import { FileTextIcon, BookOpenIcon, CalculatorIcon, UsersIcon, HelpCircleIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface TaxAdvisorNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TaxAdvisorNavigation: React.FC<TaxAdvisorNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const { t } = useTranslation('common');

  const taxAdvisorTabs = [
    {
      id: 'pendler',
      icon: CalculatorIcon,
      label: t('pendlerCalculator') || 'Pendler kalkulačka',
      description: t('reisepauschaleOptimization') || 'Reisepauschale a daňové optimalizace'
    },
    {
      id: 'interactive',
      icon: HelpCircleIcon,
      label: t('interactiveGuide') || 'Interaktivní průvodce',
      description: t('stepByStepTaxes') || 'Krok za krokem k optimálním daním'
    },
    {
      id: 'documents',
      icon: FileTextIcon,
      label: t('documents') || 'Dokumenty',
      description: t('pdfGenerator') || 'Generátor PDF dokumentů'
    },
    {
      id: 'guide',
      icon: BookOpenIcon,
      label: t('guide') || 'Průvodce',
      description: t('taxReturnGuide') || 'Průvodce daňovým přiznáním'
    },
    {
      id: 'calculator',
      icon: CalculatorIcon,
      label: t('basicCalculator') || 'Základní kalkulátor',
      description: t('quickTaxCalculations') || 'Rychlé daňové výpočty'
    }
  ];

  const currentIndex = taxAdvisorTabs.findIndex(tab => tab.id === activeTab);
  const currentTab = taxAdvisorTabs[currentIndex];

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? taxAdvisorTabs.length - 1 : currentIndex - 1;
    onTabChange(taxAdvisorTabs[prevIndex].id);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % taxAdvisorTabs.length;
    onTabChange(taxAdvisorTabs[nextIndex].id);
  };

  return (
    <>
      {/* Mobile Navigation - Visible on small screens */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between mb-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            className="p-2 hover:bg-primary/10"
            aria-label={t('previous') || 'Předchozí'}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 text-center px-4">
            <h3 className="text-lg font-semibold text-primary truncate">
              {currentTab?.label}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {currentTab?.description}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="p-2 hover:bg-primary/10"
            aria-label={t('next') || 'Další'}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            {taxAdvisorTabs.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-200",
                  index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Navigation - Hidden on small screens */}
      <div className="hidden md:flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
          {taxAdvisorTabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative p-4 md:p-6 rounded-2xl border text-center transition-all duration-300 group min-h-[140px]",
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
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl"
                    layoutId="activeTaxAdvisorTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className="relative z-10 flex flex-col items-center h-full justify-center">
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
                    "font-semibold text-base md:text-lg transition-colors duration-300 mb-2 leading-tight",
                    isActive 
                      ? "text-primary" 
                      : "text-foreground group-hover:text-primary"
                  )}>
                    {tab.label}
                  </h3>
                  
                  <p className={cn(
                    "text-sm transition-colors duration-300 leading-tight px-1",
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
    </>
  );
};

export default TaxAdvisorNavigation;
