
import React, { useState } from 'react';
import { Tabs } from "@/components/ui/tabs";
import VocabularyTabsNavigation from './vocabulary/VocabularyTabsNavigation';
import { 
  ReviewTabContent, 
  TestTabContent, 
  BrowseTabContent,
  AddTabContent,
  BulkTabContent,
  ProgressTabContent,
  ImportExportTabContent
} from './vocabulary/TabContent';
import VocabularyEdit from './vocabulary/VocabularyEdit';
import VocabularyManager, { useVocabularyContext } from './vocabulary/VocabularyManager';
import { useMediaQuery } from "@/hooks/use-media-query";

const VocabularyContent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('review');
  const { editDialogOpen, setEditDialogOpen, handleSaveEdit, currentEditItem } = useVocabularyContext();
  const isMobile = useMediaQuery("xs");
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <VocabularyTabsNavigation 
          selectedTab={selectedTab} 
          setSelectedTab={setSelectedTab} 
          isMobile={isMobile}
        />
        
        {/* Tab Contents */}
        <ReviewTabContent />
        <TestTabContent />
        <BrowseTabContent />
        <AddTabContent />
        <BulkTabContent />
        <ProgressTabContent />
        <ImportExportTabContent />
      </Tabs>
      
      {/* Edit Vocabulary Item Dialog */}
      <VocabularyEdit
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        currentItem={currentEditItem}
        onSave={handleSaveEdit}
      />
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
