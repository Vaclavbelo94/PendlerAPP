
import React from 'react';
import { Button } from '@/components/ui/button';
import { Briefcase, FileText, Users, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface LawsNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const LawsNavigation: React.FC<LawsNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  const { t } = useTranslation('laws');

  const sections = [
    {
      id: 'all',
      label: t('allLaws'),
      icon: Briefcase,
      description: t('allLawsDescription')
    },
    {
      id: 'work',
      label: t('work'),
      icon: Briefcase,
      description: t('workLawDescription')
    },
    {
      id: 'tax',
      label: t('tax'),
      icon: FileText,
      description: t('taxesDescription')
    },
    {
      id: 'social',
      label: t('social'),
      icon: Users,
      description: t('socialSecurityDescription')
    },
    {
      id: 'health',
      label: t('health'),
      icon: Heart,
      description: t('healthInsuranceDescription')
    }
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-8">
      {sections.map((section, index) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Button
              variant={isActive ? "default" : "outline"}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "transition-all duration-300 hover:scale-105",
                "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:text-primary",
                isActive && "bg-primary/20 border-primary/30 shadow-lg scale-105"
              )}
            >
              <Icon className="h-4 w-4 mr-2" />
              {section.label}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LawsNavigation;
