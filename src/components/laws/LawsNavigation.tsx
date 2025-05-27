
import React from 'react';
import { BookOpen, Briefcase, Euro, Users, Heart } from 'lucide-react';
import CategoryNavigation, { CategoryTab } from '@/components/navigation/CategoryNavigation';

interface LawsNavigationProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const lawsTabs: CategoryTab[] = [
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
    <CategoryNavigation
      tabs={lawsTabs}
      activeTab={activeCategory}
      onTabChange={onCategoryChange}
      variant="cards"
      className="mb-8"
    />
  );
};

export default LawsNavigation;
