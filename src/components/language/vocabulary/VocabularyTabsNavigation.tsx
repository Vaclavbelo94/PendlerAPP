
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
  Download 
} from "lucide-react";
import { useVocabularyContext } from './VocabularyProvider';
import { motion } from 'framer-motion';

interface VocabularyTabsNavigationProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  isMobile?: boolean; // Added isMobile prop as optional
}

const VocabularyTabsNavigation: React.FC<VocabularyTabsNavigationProps> = ({ selectedTab, setSelectedTab, isMobile }) => {
  const { dueItems } = useVocabularyContext();
  
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto p-1">
      <TabsTrigger 
        value="review" 
        onClick={() => setSelectedTab('review')}
        className="flex items-center"
      >
        <RotateCw className="w-4 h-4 mr-1" />
        <span className={isMobile ? "text-xs" : "hidden md:inline"}>Opakování</span>
        <span className={isMobile ? "hidden" : "md:hidden"}>Opakování</span>
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
        <span className={isMobile ? "text-xs" : "hidden md:inline"}>Test</span>
        <span className={isMobile ? "hidden" : "md:hidden"}>Test</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="browse" 
        onClick={() => setSelectedTab('browse')}
        className="flex items-center"
      >
        <FileText className="w-4 h-4 mr-1" />
        <span className={isMobile ? "text-xs" : "hidden md:inline"}>Prohlížet</span>
        <span className={isMobile ? "hidden" : "md:hidden"}>Prohlížet</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="add" 
        onClick={() => setSelectedTab('add')}
        className="flex items-center"
      >
        <Plus className="w-4 h-4 mr-1" />
        <span className={isMobile ? "text-xs" : "hidden md:inline"}>Přidat</span>
        <span className={isMobile ? "hidden" : "md:hidden"}>Přidat</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="bulk" 
        onClick={() => setSelectedTab('bulk')}
        className="flex items-center"
      >
        <Files className="w-4 h-4 mr-1" />
        <span className={isMobile ? "text-xs" : "hidden md:inline"}>Hromadně</span>
        <span className={isMobile ? "hidden" : "md:hidden"}>Hromadně</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="progress" 
        onClick={() => setSelectedTab('progress')}
        className="flex items-center"
      >
        <BarChart className="w-4 h-4 mr-1" />
        <span className={isMobile ? "text-xs" : "hidden md:inline"}>Statistiky</span>
        <span className={isMobile ? "hidden" : "md:hidden"}>Statistiky</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="import-export" 
        onClick={() => setSelectedTab('import-export')}
        className="flex items-center"
      >
        <div className="flex items-center">
          <Import className="w-3 h-3" />
          <Download className="w-3 h-3" />
        </div>
        <span className={isMobile ? "text-xs" : "hidden md:inline ml-1"}>Import/Export</span>
        <span className={isMobile ? "hidden" : "md:hidden ml-1"}>Imp/Exp</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default VocabularyTabsNavigation;
