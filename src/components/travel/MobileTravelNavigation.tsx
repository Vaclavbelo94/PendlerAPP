
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Route, Users, Calculator, TrendingUp, BarChart3 } from 'lucide-react';

interface MobileTravelNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isMobile: boolean;
}

export const MobileTravelNavigation: React.FC<MobileTravelNavigationProps> = ({
  activeTab,
  onTabChange,
  isMobile
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-6">
      <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-5'} gap-1`}>
        <TabsTrigger value="optimizer" className="flex items-center gap-2">
          <Route className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          {isMobile ? 'Optimizer' : 'Optimalizace'}
        </TabsTrigger>
        <TabsTrigger value="ridesharing" className="flex items-center gap-2">
          <Users className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          {isMobile ? 'Jízdy' : 'Sdílení jízd'}
        </TabsTrigger>
        {!isMobile && (
          <>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Kalkulačka
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Predikce
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </>
        )}
      </TabsList>
      {isMobile && (
        <TabsList className="grid w-full grid-cols-3 gap-1 mt-2">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-3 w-3" />
            Kalkulačka
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            Predikce
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-3 w-3" />
            Analytics
          </TabsTrigger>
        </TabsList>
      )}
    </Tabs>
  );
};
