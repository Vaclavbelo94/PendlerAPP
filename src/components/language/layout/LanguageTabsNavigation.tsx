
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, VocabularyIcon, MessageSquare, Gamepad2 } from "lucide-react";

interface LanguageTabsNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const LanguageTabsNavigation: React.FC<LanguageTabsNavigationProps> = ({ 
  activeTab, 
  onTabChange,
  children 
}) => {
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  // Handle tab changes safely to prevent crashes from rapid clicking
  const handleTabChange = (value: string) => {
    // If we're already switching tabs, ignore additional clicks
    if (isTabSwitching) {
      return;
    }
    
    // Set flag to ignore additional clicks
    setIsTabSwitching(true);
    
    // Update the active tab through the parent component
    onTabChange(value);
    
    // Reset the flag after a short delay to prevent rapid clicks
    setTimeout(() => {
      setIsTabSwitching(false);
    }, 300);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
      <div className="sticky top-0 z-10 bg-background pt-2 pb-2">
        <ScrollArea className="w-full pb-2">
          <TabsList className="w-full inline-flex flex-nowrap min-w-max">
            <TabsTrigger value="grammar" className="flex gap-2 items-center flex-shrink-0">
              <Book className="h-4 w-4" />
              <span className="hidden xs:inline">Gramatika</span>
            </TabsTrigger>
            <TabsTrigger value="vocabulary" className="flex gap-2 items-center flex-shrink-0">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-4 w-4"
              >
                <path d="M12 6.5c3.5 0 4.5 2 4.5 4.5s-1.5 4.5-4.5 4.5h-4V6.5h4Z" />
                <path d="M16.5 15.5c1 0 1.5.5 1.5 1.5s-.5 1.5-1.5 1.5h-8.5v-3h8.5Z" />
              </svg>
              <span className="hidden xs:inline">Slovíčka</span>
            </TabsTrigger>
            <TabsTrigger value="phrases" className="flex gap-2 items-center flex-shrink-0">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden xs:inline">Fráze</span>
            </TabsTrigger>
            <TabsTrigger value="interactive" className="flex gap-2 items-center flex-shrink-0">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden xs:inline">Cvičení</span>
            </TabsTrigger>
          </TabsList>
        </ScrollArea>
      </div>
      
      {children}
    </Tabs>
  );
};

export default LanguageTabsNavigation;
