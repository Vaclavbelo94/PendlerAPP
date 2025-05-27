
import React, { useState } from 'react';
import PremiumCheck from '@/components/premium/PremiumCheck';
import LawsNavigation from '@/components/laws/LawsNavigation';
import LawsHeader from '@/components/laws/LawsHeader';
import LawsGrid from '@/components/laws/LawsGrid';
import { lawItems } from '@/data/lawsData';

const Laws = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const getFilteredLaws = () => {
    if (activeCategory === "all") {
      return lawItems;
    }
    return lawItems.filter(law => law.category === activeCategory);
  };

  return (
    <PremiumCheck featureKey="laws">
      <div className="container mx-auto px-4 py-8">
        <LawsHeader />
        
        <LawsNavigation
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <LawsGrid laws={getFilteredLaws()} />
      </div>
    </PremiumCheck>
  );
};

export default Laws;
