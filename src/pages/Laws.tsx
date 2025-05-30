
import React, { useState, useMemo } from 'react';
import PublicPageWithPremiumCheck from '@/components/premium/PublicPageWithPremiumCheck';
import LawsNavigation from '@/components/laws/LawsNavigation';
import LawsHeader from '@/components/laws/LawsHeader';
import LawsGrid from '@/components/laws/LawsGrid';
import LawsLoadingSkeleton from '@/components/laws/LawsLoadingSkeleton';
import { lawItems } from '@/data/lawsData';

const Laws = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading with shorter duration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Reduced loading time
    
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
      <PublicPageWithPremiumCheck featureName="Zákony" allowPublicAccess={true}>
        <LawsLoadingSkeleton />
      </PublicPageWithPremiumCheck>
    );
  }

  return (
    <PublicPageWithPremiumCheck featureName="Zákony" allowPublicAccess={true}>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <LawsHeader />
        
        <LawsNavigation
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <LawsGrid laws={filteredLaws} />
      </div>
    </PublicPageWithPremiumCheck>
  );
};

export default Laws;
