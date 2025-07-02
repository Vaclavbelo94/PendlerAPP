
import React from 'react';
import { Briefcase, Car, Home, FileText, AlertTriangle, ShoppingCart, Coffee } from 'lucide-react';
import CategoryNavigation, { CategoryTab } from '@/components/navigation/CategoryNavigation';

interface PhrasesCategoryNavigationProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const phrasesCategories: CategoryTab[] = [
  {
    id: 'workplace',
    icon: Briefcase,
    label: 'V práci',
    description: 'Pracovní prostředí'
  },
  {
    id: 'transportation',
    icon: Car,
    label: 'Doprava',
    description: 'Cestování a transport'
  },
  {
    id: 'accommodation',
    icon: Home,
    label: 'Ubytování',
    description: 'Bydlení a pronájem'
  },
  {
    id: 'official',
    icon: FileText,
    label: 'Úřady a dokumenty',
    description: 'Oficiální záležitosti'
  },
  {
    id: 'emergency',
    icon: AlertTriangle,
    label: 'Nouzové situace',
    description: 'Pomoc a emergency'
  },
  {
    id: 'shopping',
    icon: ShoppingCart,
    label: 'Nakupování',
    description: 'Obchody a nákupy'
  },
  {
    id: 'food',
    icon: Coffee,
    label: 'Jídlo a restaurace',
    description: 'Stravování a gastronomie'
  }
];

export const PhrasesCategoryNavigation: React.FC<PhrasesCategoryNavigationProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  return (
    <CategoryNavigation
      tabs={phrasesCategories}
      activeTab={activeCategory}
      onTabChange={onCategoryChange}
      variant="compact"
      className="mb-6"
    />
  );
};

export default PhrasesCategoryNavigation;
