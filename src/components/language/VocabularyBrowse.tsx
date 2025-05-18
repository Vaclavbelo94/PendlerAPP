
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { VocabularyItem } from '@/models/VocabularyItem';
import { Plus } from 'lucide-react';
import VirtualizedVocabularyTable from './vocabulary/VirtualizedVocabularyTable';

interface VocabularyBrowseProps {
  items: VocabularyItem[];
  onEditItem: (item: VocabularyItem) => void;
  onDeleteItem: (id: string) => void;
  onAddClick?: () => void;
}

const VocabularyBrowse: React.FC<VocabularyBrowseProps> = ({
  items,
  onEditItem,
  onDeleteItem,
  onAddClick
}) => {
  // Use virtualized table for efficient rendering of large datasets
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Slovní zásoba</CardTitle>
            <CardDescription>
              Celkem {items.length} slovíček
            </CardDescription>
          </div>
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Přidat slovíčko
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <VirtualizedVocabularyTable 
          items={items}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      </CardContent>
    </Card>
  );
};

export default VocabularyBrowse;
