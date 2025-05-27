
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Bookmark, MessageCircle, Trophy, Brain } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface LanguageTabsNavigationProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
  renderBadge?: (tabName: string) => React.ReactNode;
}

const LanguageTabsNavigation: React.FC<LanguageTabsNavigationProps> = ({
  children,
  activeTab,
  onTabChange,
  renderBadge
}) => {
  const isMobile = useMediaQuery("xs");
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="flex w-full mb-2 sm:mb-3 bg-muted/60 p-0.5 h-auto">
        <TabsTrigger value="grammar" className="flex-1 py-1 sm:py-1.5 px-0.5 sm:px-1.5">
          <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 sm:mr-1.5" />
          <span className={isMobile ? "sr-only" : "hidden sm:inline text-xs"}>Gramatika</span>
          <span className={isMobile ? "text-[10px] mt-0.5" : "sm:hidden text-xs"}>Gram</span>
          {renderBadge && renderBadge("grammar")}
        </TabsTrigger>
        <TabsTrigger value="vocabulary" className="flex-1 py-1 sm:py-1.5 px-0.5 sm:px-1.5">
          <Bookmark className="h-3 w-3 sm:h-3.5 sm:w-3.5 sm:mr-1.5" />
          <span className={isMobile ? "sr-only" : "hidden sm:inline text-xs"}>Lekce</span>
          <span className={isMobile ? "text-[10px] mt-0.5" : "sm:hidden text-xs"}>Lekce</span>
          {renderBadge && renderBadge("vocabulary")}
        </TabsTrigger>
        <TabsTrigger value="phrases" className="flex-1 py-1 sm:py-1.5 px-0.5 sm:px-1.5">
          <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 sm:mr-1.5" />
          <span className={isMobile ? "sr-only" : "hidden sm:inline text-xs"}>Fráze</span>
          <span className={isMobile ? "text-[10px] mt-0.5" : "sm:hidden text-xs"}>Fráze</span>
          {renderBadge && renderBadge("phrases")}
        </TabsTrigger>
        <TabsTrigger value="interactive" className="flex-1 py-1 sm:py-1.5 px-0.5 sm:px-1.5">
          <Brain className="h-3 w-3 sm:h-3.5 sm:w-3.5 sm:mr-1.5" />
          <span className={isMobile ? "sr-only" : "hidden sm:inline text-xs"}>Interaktivní</span>
          <span className={isMobile ? "text-[10px] mt-0.5" : "sm:hidden text-xs"}>Kvíz</span>
          {renderBadge && renderBadge("interactive")}
        </TabsTrigger>
        <TabsTrigger value="gamification" className="flex-1 py-1 sm:py-1.5 px-0.5 sm:px-1.5">
          <Trophy className="h-3 w-3 sm:h-3.5 sm:w-3.5 sm:mr-1.5" />
          <span className={isMobile ? "sr-only" : "hidden sm:inline text-xs"}>Odměny</span>
          <span className={isMobile ? "text-[10px] mt-0.5" : "sm:hidden text-xs"}>Odměny</span>
          {renderBadge && renderBadge("gamification")}
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default LanguageTabsNavigation;
