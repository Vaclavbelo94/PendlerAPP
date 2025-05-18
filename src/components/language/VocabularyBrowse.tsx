
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VocabularyItem } from '@/models/VocabularyItem';
import { Plus, Filter } from 'lucide-react';
import VirtualizedVocabularyTable from './vocabulary/VirtualizedVocabularyTable';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  const isMobile = useMediaQuery("xs");
  const [filteredItems, setFilteredItems] = useState<VocabularyItem[]>(items);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Funkce pro filtrování podle kategorie
  const filterByCategory = (category: string | null) => {
    if (category === null) {
      setFilteredItems(items);
      setActiveFilter(null);
    } else {
      const filtered = items.filter(item => item.category === category);
      setFilteredItems(filtered);
      setActiveFilter(category);
    }
  };

  // Získat unikátní kategorie
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <CardTitle>Slovní zásoba</CardTitle>
            <CardDescription>
              {activeFilter 
                ? `Kategorie: ${activeFilter} (${filteredItems.length} slovíček)` 
                : `Celkem ${items.length} slovíček`}
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {isMobile && categories.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="sm:mr-2">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrovat
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="space-y-2">
                    <h4 className="font-medium">Filtrovat podle kategorie</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeFilter && (
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer bg-primary text-primary-foreground"
                          onClick={() => filterByCategory(null)}
                        >
                          Všechny kategorie
                        </Badge>
                      )}
                      {categories.map(category => (
                        <Badge 
                          key={category} 
                          variant={activeFilter === category ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => filterByCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            
            <Button onClick={onAddClick}>
              <Plus className="mr-2 h-4 w-4" />
              {isMobile ? "Přidat" : "Přidat slovíčko"}
            </Button>
          </div>
        </div>
        
        {/* Filtry pro desktop zobrazení */}
        {!isMobile && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge 
              variant={activeFilter === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => filterByCategory(null)}
            >
              Všechny kategorie
            </Badge>
            {categories.map(category => (
              <Badge 
                key={category} 
                variant={activeFilter === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => filterByCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <VirtualizedVocabularyTable 
          items={activeFilter ? filteredItems : items}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      </CardContent>
    </Card>
  );
};

export default VocabularyBrowse;
