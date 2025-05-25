
import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

export const useAddressAutocomplete = (query: string) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const searchAddresses = async () => {
      setLoading(true);
      try {
        // Používáme Nominatim API (OpenStreetMap) pro geokódování
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedQuery)}&limit=5&addressdetails=1&countrycodes=cz,de`
        );
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    searchAddresses();
  }, [debouncedQuery]);

  return { suggestions, loading };
};
