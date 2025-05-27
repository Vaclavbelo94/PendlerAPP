
import React from 'react';
import { Bot, Languages, BookOpen, Clock } from 'lucide-react';
import CategoryNavigation, { CategoryTab } from '@/components/navigation/CategoryNavigation';

interface TranslatorNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const translatorTabs: CategoryTab[] = [
  {
    id: 'ai-chat',
    icon: Bot,
    label: 'AI Chat',
    description: 'Inteligentní AI asistent pro překlady'
  },
  {
    id: 'quick-translate',
    icon: Languages,
    label: 'Rychlé překlady',
    description: 'Klasický překladač'
  },
  {
    id: 'phrasebook',
    icon: BookOpen,
    label: 'Frázovník',
    description: 'Užitečné fráze pro práci'
  },
  {
    id: 'history',
    icon: Clock,
    label: 'Historie',
    description: 'Předchozí překlady'
  }
];

export const TranslatorNavigation: React.FC<TranslatorNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <CategoryNavigation
      tabs={translatorTabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      variant="cards"
      className="mb-8"
    />
  );
};

export default TranslatorNavigation;
