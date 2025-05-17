
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCw, 
  FileText, 
  Plus, 
  BarChart, 
  Files, 
  ClipboardList, 
  Import, 
  Export 
} from "lucide-react";
import { useVocabularyContext } from './VocabularyManager';
import { motion } from 'framer-motion';

interface VocabularyTabsNavigationProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const VocabularyTabsNavigation: React.FC<VocabularyTabsNavigationProps> = ({ selectedTab, setSelectedTab }) => {
  const { dueItems } = useVocabularyContext();
  
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto p-1">
      <TabsTrigger 
        value="review" 
        onClick={() => setSelectedTab('review')}
        className="flex items-center"
      >
        <RotateCw className="w-4 h-4 mr-1" />
        <span className="hidden md:inline">Opakování</span>
        <span className="md:hidden">Opakování</span>
        {dueItems.length > 0 && (
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="ml-1.5 flex"
          >
            <Badge variant="destructive" className="h-4 min-w-4 flex justify-center items-center text-xs">
              {dueItems.length}
            </Badge>
          </motion.div>
        )}
      </TabsTrigger>
      
      <TabsTrigger 
        value="test" 
        onClick={() => setSelectedTab('test')}
        className="flex items-center"
      >
        <ClipboardList className="w-4 h-4 mr-1" />
        <span className="hidden md:inline">Test</span>
        <span className="md:hidden">Test</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="browse" 
        onClick={() => setSelectedTab('browse')}
        className="flex items-center"
      >
        <FileText className="w-4 h-4 mr-1" />
        <span className="hidden md:inline">Prohlížet</span>
        <span className="md:hidden">Prohlížet</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="add" 
        onClick={() => setSelectedTab('add')}
        className="flex items-center"
      >
        <Plus className="w-4 h-4 mr-1" />
        <span className="hidden md:inline">Přidat</span>
        <span className="md:hidden">Přidat</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="bulk" 
        onClick={() => setSelectedTab('bulk')}
        className="flex items-center"
      >
        <Files className="w-4 h-4 mr-1" />
        <span className="hidden md:inline">Hromadně</span>
        <span className="md:hidden">Hromadně</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="progress" 
        onClick={() => setSelectedTab('progress')}
        className="flex items-center"
      >
        <BarChart className="w-4 h-4 mr-1" />
        <span className="hidden md:inline">Statistiky</span>
        <span className="md:hidden">Statistiky</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="import-export" 
        onClick={() => setSelectedTab('import-export')}
        className="flex items-center"
      >
        <div className="flex items-center">
          <Import className="w-3 h-3" />
          <Export className="w-3 h-3" />
        </div>
        <span className="hidden md:inline ml-1">Import/Export</span>
        <span className="md:hidden ml-1">Imp/Exp</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default VocabularyTabsNavigation;

