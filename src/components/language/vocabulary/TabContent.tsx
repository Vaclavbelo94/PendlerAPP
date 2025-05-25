
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import VocabularyReview from '../VocabularyReview';
import VocabularyTable from './VocabularyTable';
import VocabularyAdd from './VocabularyAdd';
import VocabularyProgressDashboard from '../VocabularyProgressDashboard';
import VocabularyBulkActions from './VocabularyBulkActions';
import VocabularyImportExport from '../VocabularyImportExport';
import VocabularyTest from './VocabularyTest';
import ExercisesTab from '../tabs/ExercisesTab';
import { useVocabularyContext } from './VocabularyManager';
import { useToast } from '@/hooks/use-toast';
import { useLanguageContext } from '@/hooks/useLanguageContext';
import { TestResult } from '@/models/VocabularyItem';
import { Button } from "@/components/ui/button";

export const ReviewTabContent = () => (
  <TabsContent value="review" className="pt-6 space-y-6">
    <VocabularyReview />
  </TabsContent>
);

export const TestTabContent = () => {
  const { items, addTestResult } = useVocabularyContext();
  const { addXp } = useLanguageContext();
  const { toast } = useToast();
  
  const handleCompleteTest = (results: TestResult) => {
    // Přidat výsledky do statistik uživatele
    addTestResult(results);
    
    // Vypočítat XP body na základě výsledků
    const score = Math.round(results.correctAnswers / results.totalQuestions * 100);
    const xpPoints = Math.round(score / 10 * results.correctAnswers);
    
    // Přidat XP body za dokončení testu
    if (xpPoints > 0) {
      addXp(xpPoints);
      toast({
        title: `+${xpPoints} XP`,
        description: "Získali jste XP body za dokončení testu!"
      });
    }
  };
  
  return (
    <TabsContent value="test" className="pt-6 space-y-6">
      <VocabularyTest 
        vocabularyItems={items} 
        onCompleteTest={handleCompleteTest} 
      />
    </TabsContent>
  );
};

export const BrowseTabContent = () => {
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

export const AddTabContent = () => {
  const { addVocabularyItem } = useVocabularyContext();
  
  return (
    <TabsContent value="add" className="pt-6">
      <VocabularyAdd
        addItem={addVocabularyItem}
      />
    </TabsContent>
  );
};

export const BulkTabContent = () => {
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

export const ProgressTabContent = () => {
  const { items, userProgress } = useVocabularyContext();
  
  return (
    <TabsContent value="progress" className="pt-6">
      <VocabularyProgressDashboard
        vocabularyCount={items.length}
        progress={userProgress}
      />
    </TabsContent>
  );
};

export const ImportExportTabContent = () => {
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

export const ExercisesTabContent = () => (
  <TabsContent value="exercises" className="pt-6 space-y-6">
    <ExercisesTab />
  </TabsContent>
);

export const LogisticsTabContent = () => (
  <TabsContent value="logistics" className="pt-6 space-y-6">
    <div className="prose prose-sm max-w-none">
      <h2 className="text-2xl font-bold tracking-tight mb-4">Slovíčka: Logistika a rozměry</h2>
      <p className="text-muted-foreground mb-6">
        Tato sekce obsahuje běžně používaná slovíčka pro popis rozměrů, váhy, nakládky, vykládky a orientace ve skladu.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <h3 className="font-medium">Kategorie slovíček:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Rozměry a váha (schwer, leicht, breit, schmal)</li>
          <li>Nakládka a vykládka (die Verladung, die Entladung)</li>
          <li>Skladové prostory (das Tor, die Lagerhalle)</li>
          <li>Směrové výrazy (nach oben, nach unten)</li>
        </ul>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">Doporučené procvičování:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Rozpoznávání pokynů pro manipulaci s balíky</li>
          <li>Popis rozměrů a váhy předmětů</li>
          <li>Komunikace s kolegy při nakládce a vykládce</li>
        </ul>
      </div>
    </div>

    <div className="bg-muted rounded-lg p-4">
      <h3 className="font-medium mb-2">Rozšířené studijní materiály:</h3>
      <p className="text-sm mb-4">Pro více příkladů a interaktivní cvičení k těmto slovíčkům přejděte do sekce kurzu německého jazyka.</p>
      <Button onClick={() => window.open('/german-course', '_blank')} variant="outline">
        Otevřít rozšířené materiály
      </Button>
    </div>
  </TabsContent>
);
