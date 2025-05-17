
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Download } from 'lucide-react';

interface VocabularyTabsNavigationProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const VocabularyTabsNavigation: React.FC<VocabularyTabsNavigationProps> = ({ 
  selectedTab, 
  setSelectedTab 
}) => {
  return (
    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-7">
      <TabsTrigger 
        value="review"
        onClick={() => setSelectedTab("review")}
      >
        Opakování
      </TabsTrigger>
      <TabsTrigger 
        value="test"
        onClick={() => setSelectedTab("test")}
      >
        Testování
      </TabsTrigger>
      <TabsTrigger 
        value="browse"
        onClick={() => setSelectedTab("browse")}
      >
        Procházet
      </TabsTrigger>
      <TabsTrigger 
        value="add"
        onClick={() => setSelectedTab("add")}
      >
        Přidat slovíčko
      </TabsTrigger>
      <TabsTrigger 
        value="bulk"
        onClick={() => setSelectedTab("bulk")}
      >
        Hromadná správa
      </TabsTrigger>
      <TabsTrigger 
        value="progress"
        onClick={() => setSelectedTab("progress")}
      >
        <BarChart2 className="h-4 w-4 mr-2 hidden sm:block" />
        Pokrok
      </TabsTrigger>
      <TabsTrigger 
        value="import-export"
        onClick={() => setSelectedTab("import-export")}
      >
        <Download className="h-4 w-4 mr-2 hidden sm:block" />
        Import/Export
      </TabsTrigger>
    </TabsList>
  );
};

export default VocabularyTabsNavigation;
