
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  TrendingUp,
  X
} from 'lucide-react';
import { useDataSharing } from '@/hooks/useDataSharing';
import { dataSharingService } from '@/services/DataSharingService';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  module: string;
  type: string;
  relevance: number;
  data: any;
  path?: string;
}

interface SearchFilters {
  modules: string[];
  types: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

const GlobalSearchEnhanced: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    modules: [],
    types: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { getAllData } = useDataSharing('search');

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Enhanced search function
  const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const allData = getAllData();
      const searchResults: SearchResult[] = [];

      // Search in shifts
      if (!searchFilters.modules.length || searchFilters.modules.includes('shifts')) {
        const shifts = allData.shifts || [];
        shifts.forEach((shift: any) => {
          const relevance = calculateRelevance(searchQuery, [
            shift.type,
            shift.notes,
            shift.date
          ]);
          
          if (relevance > 0.1) {
            searchResults.push({
              id: `shift_${shift.id}`,
              title: `Směna - ${shift.type}`,
              description: shift.notes || `Směna na ${shift.date}`,
              module: 'shifts',
              type: 'shift',
              relevance,
              data: shift,
              path: '/shifts'
            });
          }
        });
      }

      // Search in vehicles
      if (!searchFilters.modules.length || searchFilters.modules.includes('vehicles')) {
        const vehicles = allData.vehicles || [];
        vehicles.forEach((vehicle: any) => {
          const relevance = calculateRelevance(searchQuery, [
            vehicle.brand,
            vehicle.model,
            vehicle.license_plate,
            vehicle.vin
          ]);
          
          if (relevance > 0.1) {
            searchResults.push({
              id: `vehicle_${vehicle.id}`,
              title: `${vehicle.brand} ${vehicle.model}`,
              description: `SPZ: ${vehicle.license_plate}`,
              module: 'vehicles',
              type: 'vehicle',
              relevance,
              data: vehicle,
              path: '/vehicles'
            });
          }
        });
      }

      // Search in language data
      if (!searchFilters.modules.length || searchFilters.modules.includes('language')) {
        const languageData = allData.language || {};
        if (languageData.vocabulary) {
          languageData.vocabulary.forEach((word: any) => {
            const relevance = calculateRelevance(searchQuery, [
              word.german,
              word.czech,
              word.category
            ]);
            
            if (relevance > 0.1) {
              searchResults.push({
                id: `vocab_${word.id}`,
                title: `${word.german} - ${word.czech}`,
                description: `Kategorie: ${word.category}`,
                module: 'language',
                type: 'vocabulary',
                relevance,
                data: word,
                path: '/language'
              });
            }
          });
        }
      }

      // Search in analytics insights
      if (!searchFilters.modules.length || searchFilters.modules.includes('analytics')) {
        const insights = dataSharingService.getCrossModuleInsights();
        insights.forEach((insight) => {
          const relevance = calculateRelevance(searchQuery, [
            insight.title,
            insight.description,
            insight.type
          ]);
          
          if (relevance > 0.1) {
            searchResults.push({
              id: `insight_${insight.id}`,
              title: insight.title,
              description: insight.description,
              module: 'analytics',
              type: 'insight',
              relevance,
              data: insight,
              path: '/dashboard'
            });
          }
        });
      }

      // Sort by relevance and apply filters
      let filteredResults = searchResults.sort((a, b) => b.relevance - a.relevance);
      
      if (searchFilters.types.length) {
        filteredResults = filteredResults.filter(result => 
          searchFilters.types.includes(result.type)
        );
      }

      setResults(filteredResults.slice(0, 20)); // Limit to 20 results
      
      // Save to recent searches
      const newRecentSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recent_searches', JSON.stringify(newRecentSearches));
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [getAllData, recentSearches]);

  // Calculate search relevance
  const calculateRelevance = (query: string, fields: (string | undefined)[]): number => {
    const queryLower = query.toLowerCase();
    let relevance = 0;
    
    fields.forEach(field => {
      if (!field) return;
      
      const fieldLower = field.toLowerCase();
      
      // Exact match
      if (fieldLower === queryLower) {
        relevance += 1;
      }
      // Starts with query
      else if (fieldLower.startsWith(queryLower)) {
        relevance += 0.8;
      }
      // Contains query
      else if (fieldLower.includes(queryLower)) {
        relevance += 0.5;
      }
      // Fuzzy match (simplified)
      else if (calculateFuzzyScore(queryLower, fieldLower) > 0.7) {
        relevance += 0.3;
      }
    });
    
    return relevance / fields.length;
  };

  // Simplified fuzzy matching
  const calculateFuzzyScore = (query: string, target: string): number => {
    if (query.length === 0) return 1;
    if (target.length === 0) return 0;
    
    const matches = query.split('').filter(char => target.includes(char)).length;
    return matches / query.length;
  };

  // Generate search suggestions
  const generateSuggestions = useCallback((input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const allData = getAllData();
    const suggestionSet = new Set<string>();

    // Add suggestions from recent data
    (allData.shifts || []).forEach((shift: any) => {
      if (shift.type?.toLowerCase().includes(input.toLowerCase())) {
        suggestionSet.add(shift.type);
      }
    });

    (allData.vehicles || []).forEach((vehicle: any) => {
      const brand = vehicle.brand?.toLowerCase();
      const model = vehicle.model?.toLowerCase();
      if (brand?.includes(input.toLowerCase())) {
        suggestionSet.add(vehicle.brand);
      }
      if (model?.includes(input.toLowerCase())) {
        suggestionSet.add(vehicle.model);
      }
    });

    setSuggestions(Array.from(suggestionSet).slice(0, 5));
  }, [getAllData]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        performSearch(query, filters);
        generateSuggestions(query);
      } else {
        setResults([]);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters, performSearch, generateSuggestions]);

  // Available modules and types for filtering
  const availableModules = ['shifts', 'vehicles', 'language', 'analytics'];
  const availableTypes = ['shift', 'vehicle', 'vocabulary', 'insight'];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Vyhledejte směny, vozidla, slovní zásobu..."
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            className="h-6 w-6 p-0"
          >
            <Filter className="h-3 w-3" />
          </Button>
          {query && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="mt-2 absolute w-full z-50 bg-white">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Moduly:</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {availableModules.map(module => (
                    <Badge
                      key={module}
                      variant={filters.modules.includes(module) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          modules: prev.modules.includes(module)
                            ? prev.modules.filter(m => m !== module)
                            : [...prev.modules, module]
                        }));
                      }}
                    >
                      {module}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Typy:</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {availableTypes.map(type => (
                    <Badge
                      key={type}
                      variant={filters.types.includes(type) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          types: prev.types.includes(type)
                            ? prev.types.filter(t => t !== type)
                            : [...prev.types, type]
                        }));
                      }}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && !showFilters && (
        <Card className="mt-2 absolute w-full z-40 bg-white">
          <CardContent className="p-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <Sparkles className="h-3 w-3" />
              Návrhy:
            </div>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded text-sm"
                onClick={() => setQuery(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Searches */}
      {!query && recentSearches.length > 0 && (
        <Card className="mt-2 absolute w-full z-30 bg-white">
          <CardContent className="p-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <Clock className="h-3 w-3" />
              Nedávná vyhledávání:
            </div>
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded text-sm"
                onClick={() => setQuery(search)}
              >
                {search}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <Card className="mt-2 absolute w-full z-20 bg-white max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <TrendingUp className="h-3 w-3" />
              Nalezeno {results.length} výsledků:
            </div>
            {results.map((result) => (
              <div
                key={result.id}
                className="p-3 hover:bg-gray-50 cursor-pointer rounded border-b last:border-b-0"
                onClick={() => {
                  if (result.path) {
                    window.location.href = result.path;
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{result.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{result.description}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {result.module}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 ml-2">
                    {Math.round(result.relevance * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {query && !isSearching && results.length === 0 && (
        <Card className="mt-2 absolute w-full z-20 bg-white">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-600">
              Žádné výsledky pro "{query}"
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Zkuste jiné klíčové slovo nebo upravte filtry
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearchEnhanced;
