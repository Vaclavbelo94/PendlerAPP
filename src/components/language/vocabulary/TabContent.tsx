
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import VocabularyReview from '../VocabularyReview';
import VocabularyTable from './VocabularyTable';
import VocabularyAdd from './VocabularyAdd';
import VocabularyProgressDashboard from '../VocabularyProgressDashboard';
import VocabularyBulkActions from './VocabularyBulkActions';
import VocabularyImportExport from '../VocabularyImportExport';
import VocabularyTest from './VocabularyTest';
import { useVocabularyContext } from './VocabularyManager';
import { TestResult } from './VocabularyTest';
import { useToast } from '@/hooks/use-toast';
import { useLanguageContext } from '../LanguageManager';

export const ReviewTabContent: React.FC = () => (
  <TabsContent value="review" className="pt-6 space-y-6">
    <VocabularyReview />
  </TabsContent>
);

export const TestTabContent: React.FC = () => {
  const { items, addTestResult } = useVocabularyContext();
  const { addXp } = useLanguageContext();
  const { toast } = useToast();

  const handleCompleteTest = (results: TestResult) => {
    // Přidat výsledky do statistik uživatele
    addTestResult(results);
    
    // Vypočítat XP body na základě výsledků
    const score = Math.round((results.correctAnswers / results.totalQuestions) * 100);
    const xpPoints = Math.round((score / 10) * results.correctAnswers);
    
    // Přidat XP body za dokončení testu
    if (xpPoints > 0) {
      addXp(xpPoints);
      
      toast({
        title: `+${xpPoints} XP`,
        description: "Získali jste XP body za dokončení testu!",
      });
    }
  };

  return (
    <TabsContent value="test" className="pt-6 space-y-6">
      <VocabularyTest vocabularyItems={items} onCompleteTest={handleCompleteTest} />
    </TabsContent>
  );
};

export const BrowseTabContent: React.FC = () => {
  const { items, handleEditItem, handleDeleteItem } = useVocabularyContext();

  return (
    <TabsContent value="browse" className="pt-6">
      <VocabularyTable 
        vocabularyItems={items}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
      />
    </TabsContent>
  );
};

export const AddTabContent: React.FC = () => {
  const { addVocabularyItem } = useVocabularyContext();

  return (
    <TabsContent value="add" className="pt-6">
      <VocabularyAdd onAddItem={addVocabularyItem} />
    </TabsContent>
  );
};

export const BulkTabContent: React.FC = () => {
  const { items, handleBulkDeleteItems, handleBulkUpdateItems } = useVocabularyContext();

  return (
    <TabsContent value="bulk" className="pt-6">
      <VocabularyBulkActions
        vocabularyItems={items}
        onDeleteItems={handleBulkDeleteItems}
        onUpdateItems={handleBulkUpdateItems}
      />
    </TabsContent>
  );
};

export const ProgressTabContent: React.FC = () => {
  const { items, userProgress } = useVocabularyContext();

  return (
    <TabsContent value="progress" className="pt-6">
      <VocabularyProgressDashboard 
        totalVocabulary={items.length}
        userProgress={userProgress}
      />
    </TabsContent>
  );
};

export const ImportExportTabContent: React.FC = () => {
  const { items, bulkAddVocabularyItems } = useVocabularyContext();

  return (
    <TabsContent value="import-export" className="pt-6">
      <VocabularyImportExport
        vocabularyItems={items}
        onImport={bulkAddVocabularyItems}
      />
    </TabsContent>
  );
};

