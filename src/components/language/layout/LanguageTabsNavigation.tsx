
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
      <TabsList className="flex w-full mb-4 bg-muted/60 p-0.5 h-auto">
        <TabsTrigger value="grammar" className="flex-1 py-1.5 sm:py-2 px-1 sm:px-2">
          <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
          <span className={isMobile ? "sr-only" : "hidden sm:inline"}>Gramatika</span>
          <span className={isMobile ? "text-xs mt-1" : "sm:hidden text-xs"}>Gram</span>
          {renderBadge && renderBadge("grammar")}
        </TabsTrigger>
        <TabsTrigger value="vocabulary" className="flex-1 py-1.5 sm:py-2 px-1 sm:px-2">
          <Bookmark className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
          <span className={isMobile ? "sr-only" : "hidden sm:inline"}>Slovní zásoba</span>
          <span className={isMobile ? "text-xs mt-1" : "sm:hidden text-xs"}>Slovíčka</span>
          {renderBadge && renderBadge("vocabulary")}
        </TabsTrigger>
        <TabsTrigger value="phrases" className="flex-1 py-1.5 sm:py-2 px-1 sm:px-2">
          <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
          <span className={isMobile ? "sr-only" : "hidden sm:inline"}>Fráze</span>
          <span className={isMobile ? "text-xs mt-1" : "sm:hidden text-xs"}>Fráze</span>
          {renderBadge && renderBadge("phrases")}
        </TabsTrigger>
        <TabsTrigger value="interactive" className="flex-1 py-1.5 sm:py-2 px-1 sm:px-2">
          <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
          <span className={isMobile ? "sr-only" : "hidden sm:inline"}>Interaktivní</span>
          <span className={isMobile ? "text-xs mt-1" : "sm:hidden text-xs"}>Kvíz</span>
          {renderBadge && renderBadge("interactive")}
        </TabsTrigger>
        <TabsTrigger value="gamification" className="flex-1 py-1.5 sm:py-2 px-1 sm:px-2">
          <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
          <span className={isMobile ? "sr-only" : "hidden sm:inline"}>Odměny</span>
          <span className={isMobile ? "text-xs mt-1" : "sm:hidden text-xs"}>Odměny</span>
          {renderBadge && renderBadge("interactive")}
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default LanguageTabsNavigation;
