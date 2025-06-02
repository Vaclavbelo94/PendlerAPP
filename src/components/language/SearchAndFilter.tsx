
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, X } from "lucide-react";
import { useGermanLessonsTranslation } from '@/hooks/useGermanLessonsTranslation';
import { PracticalPhrase } from '@/data/extendedGermanLessons';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedImportance: string;
  onImportanceChange: (importance: string) => void;
  favorites: string[];
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  totalPhrases: number;
  filteredCount: number;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedImportance,
  onImportanceChange,
  favorites,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  totalPhrases,
  filteredCount
}) => {
  const { t } = useGermanLessonsTranslation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const importanceOptions = [
    { value: 'all', labelKey: 'filter.all' },
    { value: 'critical', labelKey: 'filter.critical' },
    { value: 'important', labelKey: 'filter.important' },
    { value: 'useful', labelKey: 'filter.useful' }
  ];

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => onSearchChange('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Filter controls */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtry
            </Button>

            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={onToggleFavoritesOnly}
              className="flex items-center gap-2"
            >
              <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              {t('instruction.favorites')} ({favorites.length})
            </Button>

            <div className="text-sm text-muted-foreground ml-auto">
              {filteredCount} z {totalPhrases} frází
            </div>
          </div>

          {/* Expanded filters */}
          {isFilterOpen && (
            <div className="border-t pt-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Důležitost</h4>
                  <div className="flex flex-wrap gap-2">
                    {importanceOptions.map((option) => (
                      <Badge
                        key={option.value}
                        variant={selectedImportance === option.value ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => onImportanceChange(option.value)}
                      >
                        {t(option.labelKey)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchAndFilter;
