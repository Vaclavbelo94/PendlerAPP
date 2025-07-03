
import React, { useState, useRef, useCallback, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, Loader2, X, CheckCircle } from 'lucide-react';
import { useCityAutocomplete } from '@/hooks/useCityAutocomplete';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  showCheckIcon?: boolean;
}

const CityAutocomplete = memo<CityAutocompleteProps>(({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
  id,
  showCheckIcon = false
}) => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { suggestions, loading, error } = useCityAutocomplete(value);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (newValue.length >= 2 && !open) {
      setOpen(true);
    }
  }, [onChange, open]);

  const handleSuggestionSelect = useCallback((suggestion: any) => {
    onChange(suggestion.main_text);
    setOpen(false);
    inputRef.current?.blur();
  }, [onChange]);

  const handleClear = useCallback(() => {
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
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || t('cityPlaceholder')}
              disabled={disabled}
              className={cn(
                "pl-10 pr-10",
                error && "border-destructive",
                showCheckIcon && value && "pr-16"
              )}
            />
            {loading && (
              <Loader2 className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {showCheckIcon && value && !loading && (
              <CheckCircle className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
            {value && !loading && (
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
                  <span className="text-sm text-muted-foreground">{t('loadingCities')}</span>
                </div>
              )}
              
              {error && (
                <div className="p-4 text-sm text-destructive">
                  {error}
                </div>
              )}
              
              {!loading && !error && suggestions.length === 0 && value.length >= 2 && (
                <CommandEmpty>
                  {t('noCitiesFound')}
                </CommandEmpty>
              )}
              
              {suggestions.length > 0 && (
                <CommandGroup>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.place_id}
                      value={suggestion.main_text}
                      onSelect={() => handleSuggestionSelect(suggestion)}
                      className="cursor-pointer"
                    >
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {suggestion.main_text}
                        </span>
                        {suggestion.secondary_text && (
                          <span className="text-xs text-muted-foreground">
                            {suggestion.secondary_text}
                          </span>
                        )}
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

CityAutocomplete.displayName = 'CityAutocomplete';

export default CityAutocomplete;
