
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { useVocabularyProgress } from '@/hooks/useVocabularyProgress';
import VocabularyReview from './VocabularyReview';
import VocabularyStatistics from './VocabularyStatistics';
import VocabularyProgressDashboard from './VocabularyProgressDashboard';
import VocabularyImportExport from './VocabularyImportExport';
import VocabularyBrowse from './VocabularyBrowse';
import { BarChart2, Download } from 'lucide-react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useToast } from '@/hooks/use-toast';
import VocabularyAdd from './vocabulary/VocabularyAdd';
import VocabularyEdit from './vocabulary/VocabularyEdit';
import TestMode from './vocabulary/TestMode';
import VocabularyBulkActions from './vocabulary/VocabularyBulkActions';
import GamificationTab from './vocabulary/GamificationTab';
import VocabularySettings from './vocabulary/VocabularySettings';

// Sample vocabulary items for demonstration
const sampleVocabularyItems: VocabularyItem[] = [
  {
    id: 'vocab_1',
    word: 'der Hund',
    translation: 'pes',
    example: 'Der Hund bellt.',
    category: 'Zvířata',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'vocab_2',
    word: 'die Katze',
    translation: 'kočka',
    example: 'Die Katze miaut.',
    category: 'Zvířata',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'vocab_3',
    word: 'das Haus',
    translation: 'dům',
    example: 'Das ist mein Haus.',
    category: 'Bydlení',
    difficulty: 'hard',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'vocab_4',
    word: 'der Tisch',
    translation: 'stůl',
    example: 'Der Tisch ist aus Holz.',
    category: 'Nábytek',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'vocab_5',
    word: 'sprechen',
    translation: 'mluvit',
    example: 'Ich spreche Deutsch.',
    category: 'Slovesa',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  }
];

const VocabularySection: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('review');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<VocabularyItem | null>(null);
  const { toast } = useToast();
  
  const {
    items,
    dueItems,
    currentItem,
    dailyGoal,
    completedToday,
    addVocabularyItem,
    markCorrect,
    markIncorrect,
    goToNextItem,
    getStatistics,
    setDailyGoal,
    bulkAddVocabularyItems
  } = useSpacedRepetition(sampleVocabularyItems);

  const { userProgress } = useVocabularyProgress(items);

  // Handle editing a vocabulary item
  const handleEditItem = (item: VocabularyItem) => {
    setCurrentEditItem(item);
    setEditDialogOpen(true);
  };

  // Save edited vocabulary item
  const handleSaveEdit = (updatedItem: VocabularyItem) => {
    // Find the item in the items array
    const updatedItems = items.map(item => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      }
      return item;
    });
    
    // Update local storage
    localStorage.setItem('vocabulary_items', JSON.stringify(updatedItems));
    
    // Show success message
    toast({
      title: "Slovíčko upraveno",
      description: `Slovíčko "${updatedItem.word}" bylo úspěšně upraveno.`,
    });
    
    // Reload page to refresh the items
    window.location.reload();
  };
  
  // Handle deleting a vocabulary item
  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    localStorage.setItem('vocabulary_items', JSON.stringify(updatedItems));
    
    toast({
      title: "Slovíčko smazáno",
      description: "Slovíčko bylo úspěšně smazáno.",
    });
    
    // Reload page to refresh the items
    window.location.reload();
  };

  // Handle bulk delete items
  const handleBulkDeleteItems = (ids: string[]) => {
    const updatedItems = items.filter(item => !ids.includes(item.id));
    localStorage.setItem('vocabulary_items', JSON.stringify(updatedItems));
    window.location.reload();
  };

  // Handle bulk update items
  const handleBulkUpdateItems = (updatedItems: VocabularyItem[]) => {
    // Create a map of updated items
    const updatedItemMap = new Map(updatedItems.map(item => [item.id, item]));
    
    // Merge updated items with original items
    const mergedItems = items.map(item => {
      if (updatedItemMap.has(item.id)) {
        return updatedItemMap.get(item.id) || item;
      }
      return item;
    });
    
    // Update local storage
    localStorage.setItem('vocabulary_items', JSON.stringify(mergedItems));
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-7">
          <TabsTrigger value="review">Opakování</TabsTrigger>
          <TabsTrigger value="test">Testování</TabsTrigger>
          <TabsTrigger value="browse">Procházet</TabsTrigger>
          <TabsTrigger value="add">Přidat slovíčko</TabsTrigger>
          <TabsTrigger value="bulk">Hromadná správa</TabsTrigger>
          <TabsTrigger value="progress">
            <BarChart2 className="h-4 w-4 mr-2 hidden sm:block" />
            Pokrok
          </TabsTrigger>
          <TabsTrigger value="import-export">
            <Download className="h-4 w-4 mr-2 hidden sm:block" />
            Import/Export
          </TabsTrigger>
        </TabsList>
        
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
        
        {/* Test mode tab */}
        <TabsContent value="test">
          <TestMode vocabularyItems={items} />
        </TabsContent>
        
        {/* Browse tab with enhanced search and filtering */}
        <TabsContent value="browse">
          <VocabularyBrowse 
            items={items}
            onAddClick={() => setSelectedTab('add')}
            onDeleteItem={handleDeleteItem}
            onEditItem={handleEditItem}
          />
        </TabsContent>
        
        {/* Add vocabulary tab */}
        <TabsContent value="add">
          <VocabularyAdd addVocabularyItem={addVocabularyItem} />
        </TabsContent>
        
        {/* Bulk actions tab */}
        <TabsContent value="bulk">
          <VocabularyBulkActions 
            vocabularyItems={items}
            onDeleteItems={handleBulkDeleteItems}
            onUpdateItems={handleBulkUpdateItems}
          />
        </TabsContent>
        
        {/* Progress Dashboard Tab */}
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
        
        {/* Import/Export Tab */}
        <TabsContent value="import-export">
          <VocabularyImportExport 
            vocabularyItems={items}
            onImport={bulkAddVocabularyItems}
          />
        </TabsContent>
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

export default VocabularySection;
