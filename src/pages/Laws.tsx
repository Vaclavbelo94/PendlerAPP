
import React, { useState, useMemo } from 'react';
import PremiumCheck from '@/components/premium/PremiumCheck';
import LawsNavigation from '@/components/laws/LawsNavigation';
import LawsHeader from '@/components/laws/LawsHeader';
import LawsGrid from '@/components/laws/LawsGrid';
import LawsLoadingSkeleton from '@/components/laws/LawsLoadingSkeleton';
import { lawItems } from '@/data/lawsData';

const Laws = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredLaws = useMemo(() => {
    if (activeCategory === "all") {
      return lawItems;
    }
    return lawItems.filter(law => law.category === activeCategory);
  }, [activeCategory]);

  if (isLoading) {
    return (
      <PremiumCheck featureKey="laws">
        <LawsLoadingSkeleton />
      </PremiumCheck>
    );
  }

  return (
    <PremiumCheck featureKey="laws">
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <LawsHeader />
        
        <LawsNavigation
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <LawsGrid laws={filteredLaws} />
      </div>
    </PremiumCheck>
  );
};

export default Laws;
