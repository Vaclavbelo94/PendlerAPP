
import React from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import VocabularyBrowse from '@/components/language/VocabularyBrowse';

interface VocabularyTableProps {
  vocabularyItems: VocabularyItem[];
  onEditItem: (item: VocabularyItem) => void;
  onDeleteItem: (id: string) => void;
}

const VocabularyTable: React.FC<VocabularyTableProps> = ({
  vocabularyItems,
  onEditItem,
  onDeleteItem
}) => {
  return (
    <VocabularyBrowse
      items={vocabularyItems}
      onEditItem={onEditItem}
      onDeleteItem={onDeleteItem}
      onAddClick={() => {
        // This will trigger a tab change from parent component
        const addTab = document.querySelector('[value="add"]');
        if (addTab instanceof HTMLElement) {
          addTab.click();
        }
      }}
    />
  );
};

export default VocabularyTable;
