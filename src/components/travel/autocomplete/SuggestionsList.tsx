
import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { MapPin, Loader2 } from 'lucide-react';
import { GooglePlacesSuggestion } from './types';

interface SuggestionsListProps {
  suggestions: GooglePlacesSuggestion[];
  loading: boolean;
  error: string | null;
  value: string;
  onSuggestionSelect: (suggestion: GooglePlacesSuggestion) => void;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({
  suggestions,
  loading,
  error,
  value,
  onSuggestionSelect
}) => {
  return (
    <Command>
      <CommandList className="max-h-[200px] overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Načítám návrhy...</span>
          </div>
        )}
        
        {error && (
          <div className="p-4 text-sm text-destructive">
            {error}
          </div>
        )}
        
        {!loading && !error && suggestions.length === 0 && value.length >= 3 && (
          <CommandEmpty>
            Žádné návrhy nebyly nalezeny.
          </CommandEmpty>
        )}
        
        {suggestions.length > 0 && (
          <CommandGroup>
            {suggestions.map((suggestion) => (
              <CommandItem
                key={suggestion.place_id}
                value={suggestion.description}
                onSelect={() => onSuggestionSelect(suggestion)}
                className="cursor-pointer"
              >
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {suggestion.structured_formatting.main_text}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {suggestion.structured_formatting.secondary_text}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};

export default SuggestionsList;
