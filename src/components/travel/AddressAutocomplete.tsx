
import React, { useState, useRef, useCallback, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, Loader2, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

interface GooglePlacesSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const GOOGLE_MAPS_API_KEY = "AIzaSyBKc8VQM2i4TyHq5mI6aK9gJNBBSVnO4xY"; // Replace with your actual API key

const AddressAutocomplete = memo<AddressAutocompleteProps>(({
  value,
  onChange,
  placeholder = "Zadejte adresu...",
  className,
  disabled = false,
  id
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<GooglePlacesSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(inputValue, 300);

  const searchPlaces = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=address&components=country:cz|country:de&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'OK') {
        setSuggestions(data.predictions || []);
      } else {
        console.error('Google Places API error:', data.status);
        setError('Nepodařilo se načíst návrhy adres');
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setError('Nepodařilo se načíst návrhy adres');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 3) {
      searchPlaces(debouncedQuery);
      if (!open) {
        setOpen(true);
      }
    } else {
      setSuggestions([]);
      setError(null);
    }
  }, [debouncedQuery, searchPlaces, open]);

  const handleInputChange = useCallback((newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
  }, [onChange]);

  const handleSuggestionSelect = useCallback((suggestion: GooglePlacesSuggestion) => {
    const selectedValue = suggestion.description;
    setInputValue(selectedValue);
    onChange(selectedValue);
    setOpen(false);
    inputRef.current?.blur();
  }, [onChange]);

  const handleClear = useCallback(() => {
    setInputValue('');
    onChange('');
    setOpen(false);
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  }, []);

  return (
    <div className={cn("relative", className)}>
      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              id={id}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "pl-10 pr-10",
                error && "border-destructive"
              )}
            />
            {loading && (
              <Loader2 className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {inputValue && !loading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-full p-0" 
          align="start"
          side="bottom"
          sideOffset={4}
        >
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
              
              {!loading && !error && suggestions.length === 0 && inputValue.length >= 3 && (
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
                      onSelect={() => handleSuggestionSelect(suggestion)}
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
        </PopoverContent>
      </Popover>
    </div>
  );
});

AddressAutocomplete.displayName = 'AddressAutocomplete';

export default AddressAutocomplete;
