
import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useAddressSearch } from './autocomplete/useAddressSearch';
import AddressInput from './autocomplete/AddressInput';
import SuggestionsList from './autocomplete/SuggestionsList';
import { AddressAutocompleteProps, GooglePlacesSuggestion } from './autocomplete/types';
import { AUTOCOMPLETE_CONFIG } from './autocomplete/constants';

const AddressAutocomplete = memo<AddressAutocompleteProps>(({
  value,
  onChange,
  placeholder = "Zadejte adresu...",
  className,
  disabled = false,
  id
}) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(value, AUTOCOMPLETE_CONFIG.DEBOUNCE_DELAY);
  const { suggestions, loading, error, searchPlaces, setError } = useAddressSearch();

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= AUTOCOMPLETE_CONFIG.MIN_QUERY_LENGTH) {
      searchPlaces(debouncedQuery);
      if (!open) {
        setOpen(true);
      }
    } else {
      setError(null);
    }
  }, [debouncedQuery, searchPlaces, open, setError]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  }, [onChange]);

  const handleSuggestionSelect = useCallback((suggestion: GooglePlacesSuggestion) => {
    const selectedValue = suggestion.description;
    onChange(selectedValue);
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
          <AddressInput
            ref={inputRef}
            id={id}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onClear={handleClear}
            placeholder={placeholder}
            disabled={disabled}
            loading={loading}
            error={error}
          />
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-full p-0" 
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <SuggestionsList
            suggestions={suggestions}
            loading={loading}
            error={error}
            value={value}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});

AddressAutocomplete.displayName = 'AddressAutocomplete';

export default AddressAutocomplete;
