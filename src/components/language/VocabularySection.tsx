
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useIsMobile } from "@/hooks/use-mobile";
import VocabularyReview from './VocabularyReview';
import { useVocabularyContext } from './vocabulary/VocabularyManager';
import VocabularyTabsNavigation from './vocabulary/VocabularyTabsNavigation';
import VocabularyManager from './vocabulary/VocabularyManager';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

import {
  ReviewTabContent,
  TestTabContent,
  BrowseTabContent,
  AddTabContent,
  BulkTabContent,
  ProgressTabContent,
  ImportExportTabContent
} from './vocabulary/TabContent';

const VocabularyContent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('review');
  const isMobile = useIsMobile();
  const { isAdmin } = useAuth();
  
  return (
    <div className="space-y-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <Card className="border-b p-1">
          <VocabularyTabsNavigation 
            selectedTab={selectedTab} 
            setSelectedTab={setSelectedTab} 
            isMobile={isMobile}
            isAdmin={isAdmin}
          />
        </Card>
        
        <div className="mt-2">
          <ReviewTabContent />
          <TestTabContent />
          <BrowseTabContent />
          
          {isAdmin ? (
            <AddTabContent />
          ) : (
            <TabsContent value="add">
              <Alert variant="default" className="bg-amber-50 border-amber-200">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Pouze administrátoři mají možnost přidávat nová slovíčka.
                </AlertDescription>
              </Alert>
            </TabsContent>
          )}
          
          {isAdmin && <BulkTabContent />}
          <ProgressTabContent />
          {isAdmin && <ImportExportTabContent />}
        </div>
      </Tabs>
    </div>
  );
};

const VocabularySection: React.FC = () => {
  return (
    <VocabularyManager>
      <VocabularyContent />
    </VocabularyManager>
  );
};

export default VocabularySection;
