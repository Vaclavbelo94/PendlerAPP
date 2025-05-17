
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Bookmark, MessageCircle, Trophy, Brain } from "lucide-react";

interface LanguageTabsNavigationProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const LanguageTabsNavigation: React.FC<LanguageTabsNavigationProps> = ({
  children,
  activeTab,
  onTabChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="flex w-full mb-4 bg-muted/60">
        <TabsTrigger value="grammar" className="flex-1">
          <BookOpen className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Gramatika</span>
          <span className="sm:hidden">Gram</span>
        </TabsTrigger>
        <TabsTrigger value="vocabulary" className="flex-1">
          <Bookmark className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Slovní zásoba</span>
          <span className="sm:hidden">Slovíčka</span>
        </TabsTrigger>
        <TabsTrigger value="phrases" className="flex-1">
          <MessageCircle className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Fráze</span>
          <span className="sm:hidden">Fráze</span>
        </TabsTrigger>
        <TabsTrigger value="interactive" className="flex-1">
          <Brain className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Interaktivní</span>
          <span className="sm:hidden">Kvíz</span>
        </TabsTrigger>
        <TabsTrigger value="gamification" className="flex-1">
          <Trophy className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Odměny</span>
          <span className="sm:hidden">Odměny</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default LanguageTabsNavigation;
