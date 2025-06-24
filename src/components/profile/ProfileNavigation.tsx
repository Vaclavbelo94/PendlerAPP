
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Settings, Bell, Shield, CreditCard, FileText, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ProfileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  const { t } = useTranslation('profile');

  const sections = [
    {
      id: 'overview',
      label: t('overview') || 'Přehled',
      icon: User,
      description: t('personalInfoDescription') || 'Osobní informace a nastavení'
    },
    {
      id: 'workData',
      label: t('workData') || 'Pracovní údaje',
      icon: Briefcase,
      description: t('workDataDescription') || 'Informace o práci a zaměstnání'
    },
    {
      id: 'subscription',
      label: t('subscription') || 'Předplatné',
      icon: CreditCard,
      description: t('billingDescription') || 'Správa předplatného a plateb'
    }
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
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
                isActive && "shadow-lg scale-105"
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

export default ProfileNavigation;
