
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import VocabularyReview from '../VocabularyReview';
import VocabularyStatistics from '../VocabularyStatistics';
import VocabularyProgressDashboard from '../VocabularyProgressDashboard';
import VocabularyImportExport from '../VocabularyImportExport';
import VocabularyBrowse from '../VocabularyBrowse';
import VocabularyAdd from './VocabularyAdd';
import TestMode from './TestMode';
import VocabularyBulkActions from './VocabularyBulkActions';
import GamificationTab from './GamificationTab';
import VocabularySettings from './VocabularySettings';
import VocabularyEdit from './VocabularyEdit';
import { useVocabularyContext } from '@/contexts/VocabularyContext';

export const ReviewTabContent: React.FC = () => {
  const { getStatistics, dailyGoal, setDailyGoal } = useVocabularyContext();
  
  return (
    <TabsContent value="review" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <VocabularyReview />
        </div>
        <div className="md:col-span-1">
          <VocabularyStatistics statistics={getStatistics()} />
          
          <div className="mt-4 flex justify-end">
            <VocabularySettings 
              dailyGoal={dailyGoal}
              onSaveSettings={setDailyGoal}
            />
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export const TestTabContent: React.FC = () => {
  const { items } = useVocabularyContext();
  
  return (
    <TabsContent value="test">
      <TestMode vocabularyItems={items} />
    </TabsContent>
  );
};

export const BrowseTabContent: React.FC = () => {
  const { items, handleEditItem, handleDeleteItem } = useVocabularyContext();
  
  return (
    <TabsContent value="browse">
      <VocabularyBrowse 
        items={items}
        onAddClick={() => {}} // This will be handled by tab selection
        onDeleteItem={handleDeleteItem}
        onEditItem={handleEditItem}
      />
    </TabsContent>
  );
};

export const AddTabContent: React.FC = () => {
  const { addVocabularyItem } = useVocabularyContext();
  
  return (
    <TabsContent value="add">
      <VocabularyAdd addVocabularyItem={addVocabularyItem} />
    </TabsContent>
  );
};

export const BulkTabContent: React.FC = () => {
  const { items, handleBulkDeleteItems, handleBulkUpdateItems } = useVocabularyContext();
  
  return (
    <TabsContent value="bulk">
      <VocabularyBulkActions 
        vocabularyItems={items}
        onDeleteItems={handleBulkDeleteItems}
        onUpdateItems={handleBulkUpdateItems}
      />
    </TabsContent>
  );
};

export const ProgressTabContent: React.FC = () => {
  const { userProgress, items, dailyGoal, completedToday } = useVocabularyContext();
  
  return (
    <TabsContent value="progress">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <VocabularyProgressDashboard 
            userProgress={userProgress}
            items={items}
          />
        </div>
        <div>
          <GamificationTab 
            userProgress={userProgress}
            vocabularyItems={items}
            dailyGoal={dailyGoal}
            completedToday={completedToday}
          />
        </div>
      </div>
    </TabsContent>
  );
};

export const ImportExportTabContent: React.FC = () => {
  const { items, bulkAddVocabularyItems } = useVocabularyContext();
  
  return (
    <TabsContent value="import-export">
      <VocabularyImportExport 
        vocabularyItems={items}
        onImport={bulkAddVocabularyItems}
      />
    </TabsContent>
  );
};
