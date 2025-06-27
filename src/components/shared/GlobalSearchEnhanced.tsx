
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, Star, TrendingUp, X } from 'lucide-react';
import { useDataSharing } from '@/hooks/useDataSharing';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  url?: string;
  relevance: number;
  metadata?: Record<string, any>;
}

interface GlobalSearchEnhancedProps {
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  maxResults?: number;
  categories?: string[];
}

const GlobalSearchEnhanced: React.FC<GlobalSearchEnhancedProps> = ({
  onResultSelect,
  placeholder = "Hledat napříč aplikací...",
  maxResults = 10,
  categories = []
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const { getAllData } = useDataSharing('search');

  // Mock search data including vocabulary
  const searchData = useMemo(() => {
    const allData = getAllData();
    return {
      ...allData,
      vocabulary: [
        { term: 'Pendler', definition: 'Osoba dojíždějící za prací', category: 'general' },
        { term: 'Směna', definition: 'Pracovní doba', category: 'work' },
        { term: 'Kalkulačka', definition: 'Nástroj pro výpočty', category: 'tools' }
      ]
    };
  }, [getAllData]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    const searchTimeout = setTimeout(() => {
      performSearch(query);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, selectedCategory]);

  const performSearch = (searchQuery: string) => {
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Kalkulačka pohonných hmot',
        description: 'Vypočítejte náklady na pohonné hmoty pro vaše cesty',
        category: 'tools',
        url: '/calculator/fuel',
        relevance: 0.9
      },
      {
        id: '2',
        title: 'Správa vozidel',
        description: 'Spravujte informace o vašich vozidlech',
        category: 'vehicles',
        url: '/vehicles',
        relevance: 0.8
      }
    ];

    // Add vocabulary results if available
    if (searchData.vocabulary) {
      const vocabularyResults = searchData.vocabulary
        .filter((item: any) => 
          item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.definition.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((item: any) => ({
          id: `vocab-${item.term}`,
          title: item.term,
          description: item.definition,
          category: 'vocabulary',
          relevance: 0.7
        }));
      
      mockResults.push(...vocabularyResults);
    }

    const filteredResults = selectedCategory === 'all' 
      ? mockResults 
      : mockResults.filter(result => result.category === selectedCategory);

    setResults(filteredResults.slice(0, maxResults));
  };

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [query, ...prev.filter(s => s !== query)].slice(0, 5);
      return updated;
    });

    if (onResultSelect) {
      onResultSelect(result);
    }
    
    setQuery('');
    setResults([]);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory('all')}
          >
            Vše
          </Badge>
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}

      {/* Search results */}
      {(results.length > 0 || isSearching) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-muted-foreground">
              Hledám...
            </div>
          ) : (
            <div className="p-2">
              {results.map(result => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="p-3 hover:bg-muted rounded cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{result.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{result.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2">
                      {result.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent searches */}
      {query.length === 0 && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Clock className="h-3 w-3" />
              Nedávná hledání
            </div>
          </div>
          <div className="p-2">
            {recentSearches.map((search, index) => (
              <div
                key={index}
                onClick={() => setQuery(search)}
                className="p-2 hover:bg-muted rounded cursor-pointer text-sm transition-colors"
              >
                {search}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearchEnhanced;
