
import React, { useState, useRef, useCallback, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, Loader2, X } from 'lucide-react';
import { useOptimizedAddressAutocomplete } from '@/hooks/useOptimizedAddressAutocomplete';
import { cn } from '@/lib/utils';

interface OptimizedAddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const OptimizedAddressAutocomplete = memo<OptimizedAddressAutocompleteProps>(({
  value,
  onChange,
  placeholder = "Zadejte adresu...",
  className,
  disabled = false,
  id
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { suggestions, loading, error } = useOptimizedAddressAutocomplete(inputValue);

  const handleInputChange = useCallback((newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
    if (newValue.length >= 3 && !open) {
      setOpen(true);
    }
  }, [onChange, open]);

  const handleSuggestionSelect = useCallback((suggestion: any) => {
    const selectedValue = suggestion.display_name;
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

  // Update internal value when prop value changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

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
                "pl-10 pr-10 mobile-input",
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
          className="w-full p-0 mobile-dropdown" 
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
                      value={suggestion.display_name}
                      onSelect={() => handleSuggestionSelect(suggestion)}
                      className="cursor-pointer mobile-touch-target"
                    >
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate">
                        {suggestion.display_name}
                      </span>
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

OptimizedAddressAutocomplete.displayName = 'OptimizedAddressAutocomplete';

export default OptimizedAddressAutocomplete;
