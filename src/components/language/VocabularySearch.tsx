
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { 
  Search,
  SlidersHorizontal,
  X,
  Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { VocabularyItem } from '@/models/VocabularyItem';

interface VocabularySearchProps {
  items: VocabularyItem[];
  onSearch: (filteredItems: VocabularyItem[]) => void;
  categories: string[];
}

const VocabularySearch = ({ items, onSearch, categories }: VocabularySearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [masteryLevel, setMasteryLevel] = useState<string>('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Search and filter items
  useEffect(() => {
    let filtered = [...items];
    
    // Text search filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.word.toLowerCase().includes(lowerSearch) || 
        item.translation.toLowerCase().includes(lowerSearch) || 
        (item.example && item.example.toLowerCase().includes(lowerSearch))
      );
    }
    
    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter(item => item.difficulty === selectedDifficulty);
    }
    
    // Mastery level filter
    if (masteryLevel) {
      switch (masteryLevel) {
        case 'new':
          filtered = filtered.filter(item => item.repetitionLevel === 0);
          break;
        case 'learning':
          filtered = filtered.filter(item => item.repetitionLevel > 0 && item.repetitionLevel < 4);
          break;
        case 'mastered':
          filtered = filtered.filter(item => item.repetitionLevel >= 4);
          break;
        case 'dueToday':
          const today = new Date();
          filtered = filtered.filter(item => {
            if (!item.nextReviewDate) return true; // New items are due today
            const reviewDate = new Date(item.nextReviewDate);
            return reviewDate <= today;
          });
          break;
      }
    }
    
    // Count active filters
    let count = 0;
    if (selectedCategory) count++;
    if (selectedDifficulty) count++;
    if (masteryLevel) count++;
    setActiveFilters(count);
    
    // Send filtered items back
    onSearch(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty, masteryLevel, items, onSearch]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedDifficulty('');
    setMasteryLevel('');
  };

  return (
    <Card>
      <CardContent className="pt-4 pb-3">
        <div className="flex flex-col space-y-3">
          {/* Search input row */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Hledat slovíčka..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <Popover open={filtersVisible} onOpenChange={setFiltersVisible}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="relative"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFilters > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {activeFilters}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Filtry</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category-filter">Kategorie</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger id="category-filter">
                        <SelectValue placeholder="Všechny kategorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Všechny kategorie</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty-filter">Obtížnost</Label>
                    <Select
                      value={selectedDifficulty}
                      onValueChange={setSelectedDifficulty}
                    >
                      <SelectTrigger id="difficulty-filter">
                        <SelectValue placeholder="Všechny obtížnosti" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Všechny obtížnosti</SelectItem>
                        <SelectItem value="easy">Lehká</SelectItem>
                        <SelectItem value="medium">Střední</SelectItem>
                        <SelectItem value="hard">Těžká</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mastery-filter">Úroveň zvládnutí</Label>
                    <Select
                      value={masteryLevel}
                      onValueChange={setMasteryLevel}
                    >
                      <SelectTrigger id="mastery-filter">
                        <SelectValue placeholder="Všechny úrovně" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Všechny úrovně</SelectItem>
                        <SelectItem value="new">Nové</SelectItem>
                        <SelectItem value="learning">Učím se</SelectItem>
                        <SelectItem value="mastered">Zvládnuté</SelectItem>
                        <SelectItem value="dueToday">K dnešnímu opakování</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                    >
                      Resetovat filtry
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Active filters display */}
          {activeFilters > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedCategory && (
                <Badge variant="outline" className="flex items-center gap-1 py-1 px-2">
                  Kategorie: {selectedCategory}
                  <button onClick={() => setSelectedCategory('')} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {selectedDifficulty && (
                <Badge variant="outline" className="flex items-center gap-1 py-1 px-2">
                  Obtížnost: {
                    selectedDifficulty === 'easy' ? 'Lehká' : 
                    selectedDifficulty === 'medium' ? 'Střední' : 'Těžká'
                  }
                  <button onClick={() => setSelectedDifficulty('')} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {masteryLevel && (
                <Badge variant="outline" className="flex items-center gap-1 py-1 px-2">
                  {
                    masteryLevel === 'new' ? 'Nové' : 
                    masteryLevel === 'learning' ? 'Učím se' : 
                    masteryLevel === 'mastered' ? 'Zvládnuté' : 'K dnešnímu opakování'
                  }
                  <button onClick={() => setMasteryLevel('')} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VocabularySearch;
