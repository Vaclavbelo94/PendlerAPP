
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

const VocabularyTabsNavigation: React.FC<VocabularyTabsNavigationProps> = ({ 
  selectedTab, 
  setSelectedTab, 
  isMobile = false
}) => {
  const { dueItems } = useVocabularyContext();
  
  return (
    <TabsList className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-7'} h-auto p-0.5`}>
      <TabsTrigger 
        value="review" 
        onClick={() => setSelectedTab('review')}
        className="flex items-center justify-center py-1 px-0.5"
      >
        <div className="flex items-center">
          <RotateCw className={`${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} mr-1`} />
          <span className={isMobile ? "text-[10px]" : "text-xs"}>
            {isMobile ? "Opak" : "Opakování"}
          </span>
          {dueItems.length > 0 && (
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="ml-0.5 flex"
            >
              <Badge variant="destructive" className="h-3 min-w-3 flex justify-center items-center text-[8px] px-1">
                {dueItems.length}
              </Badge>
            </motion.div>
          )}
        </div>
      </TabsTrigger>
      
      <TabsTrigger 
        value="test" 
        onClick={() => setSelectedTab('test')}
        className="flex items-center justify-center py-1 px-0.5"
      >
        <div className="flex items-center">
          <ClipboardList className={`${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} mr-1`} />
          <span className={isMobile ? "text-[10px]" : "text-xs"}>Test</span>
        </div>
      </TabsTrigger>
      
      <TabsTrigger 
        value="browse" 
        onClick={() => setSelectedTab('browse')}
        className="flex items-center justify-center py-1 px-0.5"
      >
        <div className="flex items-center">
          <FileText className={`${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} mr-1`} />
          <span className={isMobile ? "text-[10px]" : "text-xs"}>
            {isMobile ? "Prohl" : "Prohlížet"}
          </span>
        </div>
      </TabsTrigger>
      
      <TabsTrigger 
        value="add" 
        onClick={() => setSelectedTab('add')}
        className="flex items-center justify-center py-1 px-0.5"
      >
        <div className="flex items-center">
          <Plus className={`${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} mr-1`} />
          <span className={isMobile ? "text-[10px]" : "text-xs"}>Přidat</span>
        </div>
      </TabsTrigger>
      
      {!isMobile && (
        <>
          <TabsTrigger 
            value="bulk" 
            onClick={() => setSelectedTab('bulk')}
            className="flex items-center justify-center py-1 px-0.5"
          >
            <div className="flex items-center">
              <Files className="w-3.5 h-3.5 mr-1" />
              <span className="text-xs">Hromadně</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="progress" 
            onClick={() => setSelectedTab('progress')}
            className="flex items-center justify-center py-1 px-0.5"
          >
            <div className="flex items-center">
              <BarChart className="w-3.5 h-3.5 mr-1" />
              <span className="text-xs">Statistiky</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="import-export" 
            onClick={() => setSelectedTab('import-export')}
            className="flex items-center justify-center py-1 px-0.5"
          >
            <div className="flex items-center">
              <Import className="w-3 h-3 mr-0.5" />
              <Download className="w-3 h-3" />
              <span className="text-xs ml-1">Imp/Exp</span>
            </div>
          </TabsTrigger>
        </>
      )}
    </TabsList>
  );
};

export default VocabularyTabsNavigation;
