
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { VocabularyItem } from '@/models/VocabularyItem';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Edit, 
  Trash2, 
  MoreVertical, 
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Plus 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import VocabularySearch from './VocabularySearch';

interface VocabularyBrowseProps {
  items: VocabularyItem[];
  onAddClick: () => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: VocabularyItem) => void;
}

const VocabularyBrowse: React.FC<VocabularyBrowseProps> = ({ 
  items, 
  onAddClick,
  onDeleteItem,
  onEditItem
}) => {
  const [filteredItems, setFilteredItems] = useState<VocabularyItem[]>(items);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof VocabularyItem>('word');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Extract unique categories for filtering
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    items.forEach(item => {
      if (item.category) uniqueCategories.add(item.category);
    });
    return Array.from(uniqueCategories).sort();
  }, [items]);
  
  // Handle search/filter results
  const handleSearch = (results: VocabularyItem[]) => {
    setFilteredItems(results);
    // Clear selection when filter changes
    setSelectedItems([]);
  };
  
  // Handle sort
  const handleSort = (field: keyof VocabularyItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Apply sorting to filtered items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Handle potentially undefined values
      if (aVal === undefined) aVal = '';
      if (bVal === undefined) bVal = '';
      
      // Sort direction
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      // Compare values
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction * aVal.localeCompare(bVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction * (aVal - bVal);
      }
      
      return 0;
    });
  }, [filteredItems, sortField, sortDirection]);
  
  // Selection handlers
  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedItems.length === sortedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedItems.map(item => item.id));
    }
  };
  
  // Delete handlers
  const handleDeleteSelected = () => {
    selectedItems.forEach(id => onDeleteItem(id));
    setSelectedItems([]);
  };

  // Get display name for difficulty
  const getDifficultyLabel = (difficulty: string | undefined) => {
    switch (difficulty) {
      case 'easy': return 'Lehká';
      case 'medium': return 'Střední';
      case 'hard': return 'Těžká';
      default: return 'Neurčená';
    }
  };
  
  // Get mastery level label
  const getMasteryLabel = (item: VocabularyItem) => {
    if (item.repetitionLevel >= 4) return { label: 'Zvládnuto', color: 'success' };
    if (item.repetitionLevel > 0) return { label: 'Učím se', color: 'secondary' };
    return { label: 'Nové', color: 'default' };
  };

  return (
    <div className="space-y-4">
      <VocabularySearch 
        items={items} 
        onSearch={handleSearch}
        categories={categories}
      />
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vaše slovíčka</CardTitle>
            <Button onClick={onAddClick} size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Přidat slovíčko
            </Button>
          </div>
          <CardDescription>
            {filteredItems.length === items.length 
              ? `Celkem máte ${items.length} slovíček`
              : `Zobrazeno ${filteredItems.length} z ${items.length} slovíček`
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {sortedItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {items.length === 0 
                  ? 'Zatím nemáte žádná slovíčka. Začněte přidáním nového slovíčka.' 
                  : 'Žádná slovíčka neodpovídají vašemu vyhledávání.'
                }
              </p>
              {items.length === 0 && (
                <Button onClick={onAddClick} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Přidat slovíčko
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table header with sorting */}
              <div className="flex items-center border-b pb-2 text-sm font-medium text-muted-foreground">
                <div className="w-8 flex justify-center">
                  <Checkbox 
                    checked={selectedItems.length === sortedItems.length && sortedItems.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </div>
                <div 
                  className="flex-1 cursor-pointer flex items-center"
                  onClick={() => handleSort('word')}
                >
                  Slovíčko
                  {sortField === 'word' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
                <div 
                  className="flex-1 cursor-pointer flex items-center"
                  onClick={() => handleSort('translation')}
                >
                  Překlad
                  {sortField === 'translation' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
                <div 
                  className="w-28 hidden md:block cursor-pointer flex items-center"
                  onClick={() => handleSort('category')}
                >
                  Kategorie
                  {sortField === 'category' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
                <div 
                  className="w-24 hidden md:block cursor-pointer flex items-center"
                  onClick={() => handleSort('repetitionLevel')}
                >
                  Úroveň
                  {sortField === 'repetitionLevel' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
                <div className="w-10"></div>
              </div>
              
              {/* Vocabulary items */}
              <div className="divide-y">
                {sortedItems.map(item => {
                  const masteryInfo = getMasteryLabel(item);
                  return (
                    <div key={item.id} className="flex items-center py-3">
                      <div className="w-8 flex justify-center">
                        <Checkbox 
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleSelection(item.id)}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.word}</p>
                        {item.difficulty && (
                          <span className="text-xs text-muted-foreground">
                            {getDifficultyLabel(item.difficulty)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p>{item.translation}</p>
                        {item.example && (
                          <p className="text-xs italic text-muted-foreground truncate max-w-[200px]">
                            {item.example}
                          </p>
                        )}
                      </div>
                      <div className="w-28 hidden md:block">
                        {item.category && (
                          <Badge variant="outline" className="font-normal">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      <div className="w-24 hidden md:block">
                        <Badge variant={masteryInfo.color as any}>
                          {masteryInfo.label}
                        </Badge>
                      </div>
                      <div className="w-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditItem(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Upravit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Smazat
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Smazat slovíčko?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Opravdu chcete smazat slovíčko "{item.word}"? Tato akce je nevratná.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Zrušit</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => onDeleteItem(item.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Smazat
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
        
        {selectedItems.length > 0 && (
          <CardFooter className="border-t pt-4 flex justify-between items-center">
            <p className="text-sm">Vybráno: {selectedItems.length}</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Smazat vybrané
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Smazat vybraná slovíčka?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Opravdu chcete smazat {selectedItems.length} vybraných slovíček? 
                    Tato akce je nevratná.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Zrušit</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteSelected}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Smazat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default VocabularyBrowse;
