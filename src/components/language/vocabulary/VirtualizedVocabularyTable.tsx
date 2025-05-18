
import React, { useMemo, useState } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, Filter, ArrowUpDown } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualizedVocabularyTableProps {
  items: VocabularyItem[];
  onEditItem: (item: VocabularyItem) => void;
  onDeleteItem: (id: string) => void;
}

const VirtualizedVocabularyTable: React.FC<VirtualizedVocabularyTableProps> = ({
  items,
  onEditItem,
  onDeleteItem
}) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'word' | 'translation' | 'category' | 'repetitionLevel' | 'lastReviewed'>('word');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  
  // Parent container ref for virtualization
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  // Handle sorting
  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  // Extract unique categories and difficulties for filtering
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    items.forEach(item => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [items]);
  
  const difficulties = useMemo(() => {
    const uniqueDifficulties = new Set<string>();
    items.forEach(item => {
      if (item.difficulty) {
        uniqueDifficulties.add(item.difficulty);
      }
    });
    return Array.from(uniqueDifficulties);
  }, [items]);
  
  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(item => 
        item.word.toLowerCase().includes(searchLower) ||
        item.translation.toLowerCase().includes(searchLower) ||
        (item.category && item.category.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply category filter
    if (filterCategory) {
      result = result.filter(item => item.category === filterCategory);
    }
    
    // Apply difficulty filter
    if (filterDifficulty) {
      result = result.filter(item => item.difficulty === filterDifficulty);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortField) {
        case 'word':
        case 'translation':
        case 'category':
          const aVal = (a[sortField] || '').toLowerCase();
          const bVal = (b[sortField] || '').toLowerCase();
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        
        case 'repetitionLevel':
          return sortOrder === 'asc' 
            ? a.repetitionLevel - b.repetitionLevel
            : b.repetitionLevel - a.repetitionLevel;
            
        case 'lastReviewed':
          const aDate = a.lastReviewed ? new Date(a.lastReviewed).getTime() : 0;
          const bDate = b.lastReviewed ? new Date(b.lastReviewed).getTime() : 0;
          return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
          
        default:
          return 0;
      }
    });
    
    return result;
  }, [items, search, sortField, sortOrder, filterCategory, filterDifficulty]);
  
  // Virtualized rows for optimized rendering
  const rowVirtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // approx. row height
    overscan: 5,
  });
  
  const renderDifficultyBadge = (difficulty?: string) => {
    if (!difficulty) return null;
    
    const badgeVariant = difficulty === 'easy' ? 'outline' : 
                         difficulty === 'medium' ? 'secondary' : 'default';
                         
    return (
      <Badge variant={badgeVariant}>
        {difficulty === 'easy' ? 'Snadné' : 
         difficulty === 'medium' ? 'Střední' : 'Obtížné'}
      </Badge>
    );
  };
  
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalHeight = rowVirtualizer.getTotalSize();
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Hledat slovíčka..."
            className="pl-9 w-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative inline-block text-left">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Kategorie
              {filterCategory && <Badge variant="secondary" className="ml-1">1</Badge>}
            </Button>
            {/* Dropdown for categories would go here */}
          </div>
          
          <div className="relative inline-block text-left">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Obtížnost
              {filterDifficulty && <Badge variant="secondary" className="ml-1">1</Badge>}
            </Button>
            {/* Dropdown for difficulties would go here */}
          </div>
        </div>
      </div>
      
      <div>
        <div
          ref={parentRef}
          className="border rounded-md overflow-auto"
          style={{ height: '500px', width: '100%' }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] cursor-pointer" onClick={() => toggleSort('word')}>
                  <div className="flex items-center">
                    Slovo
                    {sortField === 'word' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[200px] cursor-pointer" onClick={() => toggleSort('translation')}>
                  <div className="flex items-center">
                    Překlad
                    {sortField === 'translation' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[150px] cursor-pointer" onClick={() => toggleSort('category')}>
                  <div className="flex items-center">
                    Kategorie
                    {sortField === 'category' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[100px] cursor-pointer" onClick={() => toggleSort('repetitionLevel')}>
                  <div className="flex items-center">
                    Úroveň
                    {sortField === 'repetitionLevel' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Obtížnost</TableHead>
                <TableHead className="w-[100px] text-right">Akce</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              <tr style={{ height: `${totalHeight}px` }} />
              
              {virtualRows.map((virtualRow) => {
                const item = filteredItems[virtualRow.index];
                return (
                  <TableRow
                    key={item.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <TableCell className="font-medium">{item.word}</TableCell>
                    <TableCell>{item.translation}</TableCell>
                    <TableCell>{item.category || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={item.repetitionLevel >= 4 ? 'default' : 'outline'}>
                        {item.repetitionLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>{renderDifficultyBadge(item.difficulty)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {items.length === 0 
                      ? "Zatím nemáte žádná slovíčka" 
                      : "Nebyly nalezeny žádné výsledky pro vaše filtry"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Zobrazeno {filteredItems.length} z {items.length} slovíček
      </div>
    </div>
  );
};

export default VirtualizedVocabularyTable;
