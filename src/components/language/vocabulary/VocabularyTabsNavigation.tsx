
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
  isMobile?: boolean;
}

const VocabularyTabsNavigation: React.FC<VocabularyTabsNavigationProps> = ({ selectedTab, setSelectedTab, isMobile }) => {
  const { dueItems } = useVocabularyContext();
  
  return (
    <TabsList className="grid grid-cols-4 lg:grid-cols-7 h-auto p-0.5">
      <TabsTrigger 
        value="review" 
        onClick={() => setSelectedTab('review')}
        className="flex items-center py-0.5 px-0.5"
      >
        <RotateCw className="w-2.5 h-2.5 mr-0.5" />
        <span className={isMobile ? "text-[9px]" : "hidden md:inline text-xs"}>Opakování</span>
        <span className={isMobile ? "hidden" : "md:hidden text-[10px]"}>Opak</span>
        {dueItems.length > 0 && (
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="ml-0.5 flex"
          >
            <Badge variant="destructive" className="h-2.5 min-w-2.5 flex justify-center items-center text-[8px] px-0.5">
              {dueItems.length}
            </Badge>
          </motion.div>
        )}
      </TabsTrigger>
      
      <TabsTrigger 
        value="test" 
        onClick={() => setSelectedTab('test')}
        className="flex items-center py-0.5 px-0.5"
      >
        <ClipboardList className="w-2.5 h-2.5 mr-0.5" />
        <span className={isMobile ? "text-[9px]" : "hidden md:inline text-xs"}>Test</span>
        <span className={isMobile ? "hidden" : "md:hidden text-[10px]"}>Test</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="browse" 
        onClick={() => setSelectedTab('browse')}
        className="flex items-center py-0.5 px-0.5"
      >
        <FileText className="w-2.5 h-2.5 mr-0.5" />
        <span className={isMobile ? "text-[9px]" : "hidden md:inline text-xs"}>Prohlížet</span>
        <span className={isMobile ? "hidden" : "md:hidden text-[10px]"}>Prohl</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="add" 
        onClick={() => setSelectedTab('add')}
        className="flex items-center py-0.5 px-0.5"
      >
        <Plus className="w-2.5 h-2.5 mr-0.5" />
        <span className={isMobile ? "text-[9px]" : "hidden md:inline text-xs"}>Přidat</span>
        <span className={isMobile ? "hidden" : "md:hidden text-[10px]"}>Přidat</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="bulk" 
        onClick={() => setSelectedTab('bulk')}
        className="flex items-center py-0.5 px-0.5"
      >
        <Files className="w-2.5 h-2.5 mr-0.5" />
        <span className={isMobile ? "text-[9px]" : "hidden md:inline text-xs"}>Hromadně</span>
        <span className={isMobile ? "hidden" : "md:hidden text-[10px]"}>Hrom</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="progress" 
        onClick={() => setSelectedTab('progress')}
        className="flex items-center py-0.5 px-0.5"
      >
        <BarChart className="w-2.5 h-2.5 mr-0.5" />
        <span className={isMobile ? "text-[9px]" : "hidden md:inline text-xs"}>Statistiky</span>
        <span className={isMobile ? "hidden" : "md:hidden text-[10px]"}>Stat</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="import-export" 
        onClick={() => setSelectedTab('import-export')}
        className="flex items-center py-0.5 px-0.5"
      >
        <div className="flex items-center">
          <Import className="w-2 h-2" />
          <Download className="w-2 h-2" />
        </div>
        <span className={isMobile ? "text-[9px]" : "hidden md:inline text-xs ml-0.5"}>Imp/Exp</span>
        <span className={isMobile ? "hidden" : "md:hidden text-[10px] ml-0.5"}>I/E</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default VocabularyTabsNavigation;
