
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from "lucide-react";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete";
import { cn } from "@/lib/utils";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  recentAddresses?: string[];
  className?: string;
}

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  placeholder, 
  recentAddresses = [],
  className 
}: AddressAutocompleteProps) => {
  const [focused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { suggestions, loading } = useAddressAutocomplete(value);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const showDropdown = focused && (suggestions.length > 0 || recentAddresses.length > 0);
  const allSuggestions = [
    ...recentAddresses.map(addr => ({ display_name: addr, isRecent: true })),
    ...suggestions.map(s => ({ display_name: s.display_name, isRecent: false }))
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
          onChange(allSuggestions[selectedIndex].display_name);
          setFocused(false);
        }
        break;
      case 'Escape':
        setFocused(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setFocused(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    if (!focused) {
      setSelectedIndex(-1);
    }
  }, [focused]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
      
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-64 overflow-y-auto">
          {recentAddresses.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                Nedávné adresy
              </div>
              {recentAddresses.map((address, index) => (
                <Button
                  key={`recent-${index}`}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left h-auto p-3",
                    selectedIndex === index && "bg-accent"
                  )}
                  onClick={() => handleSuggestionClick(address)}
                >
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="truncate">{address}</span>
                </Button>
              ))}
            </>
          )}
          
          {suggestions.length > 0 && (
            <>
              {recentAddresses.length > 0 && (
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                  Návrhy
                </div>
              )}
              {suggestions.map((suggestion, index) => {
                const adjustedIndex = index + recentAddresses.length;
                return (
                  <Button
                    key={suggestion.place_id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left h-auto p-3",
                      selectedIndex === adjustedIndex && "bg-accent"
                    )}
                    onClick={() => handleSuggestionClick(suggestion.display_name)}
                  >
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{suggestion.display_name}</span>
                  </Button>
                );
              })}
            </>
          )}
          
          {loading && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Vyhledávám...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
