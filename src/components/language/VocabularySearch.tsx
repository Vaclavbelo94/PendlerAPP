
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface VocabularySearchProps {
  onSearch: (term: string) => void;
  onFilterChange: (filters: VocabularyFilters) => void;
  categories: string[];
}

export interface VocabularyFilters {
  difficulty?: 'easy' | 'medium' | 'hard' | undefined;
  category?: string;
  onlyDue?: boolean;
}

const VocabularySearch: React.FC<VocabularySearchProps> = ({
  onSearch,
  onFilterChange,
  categories,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<VocabularyFilters>({});
  
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(searchTerm);
  };
  
  const handleFilterChange = (newFilters: Partial<VocabularyFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
    setSearchTerm('');
    onSearch('');
  };
  
  const hasActiveFilters = searchTerm || Object.values(filters).some(value => value !== undefined);
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Hledat slovíčka..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="default">
          Hledat
        </Button>
      </form>
      
      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.difficulty || ''}
          onValueChange={(value) => 
            handleFilterChange({ difficulty: value ? value as any : undefined })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Obtížnost" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Všechny obtížnosti</SelectItem>
            <SelectItem value="easy">Lehká</SelectItem>
            <SelectItem value="medium">Střední</SelectItem>
            <SelectItem value="hard">Těžká</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={filters.category || ''}
          onValueChange={(value) => 
            handleFilterChange({ category: value || undefined })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Všechny kategorie</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          className={`${filters.onlyDue ? 'bg-primary/10' : ''}`}
          onClick={() => handleFilterChange({ onlyDue: !filters.onlyDue })}
        >
          K opakování
        </Button>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Zrušit filtry
          </Button>
        )}
      </div>
      
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary">
              Vyhledávání: {searchTerm}
            </Badge>
          )}
          {filters.difficulty && (
            <Badge variant="secondary">
              Obtížnost: {filters.difficulty === 'easy' ? 'Lehká' : 
                          filters.difficulty === 'medium' ? 'Střední' : 'Těžká'}
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary">
              Kategorie: {filters.category}
            </Badge>
          )}
          {filters.onlyDue && (
            <Badge variant="secondary">
              Pouze k opakování
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default VocabularySearch;
