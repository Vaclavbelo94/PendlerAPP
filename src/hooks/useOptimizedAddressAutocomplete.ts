
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { supabase } from '@/integrations/supabase/client';

interface GooglePlacesSuggestion {
  place_id: string;
  display_name: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

// Fallback addresses for common destinations
const getAddressFallback = (query: string): GooglePlacesSuggestion[] => {
  const fallbackAddresses = [
    { name: 'DHL-Ottendorf, Bergener Ring 2, 01458 Ottendorf-Okrilla', country: 'Německo' },
    { name: 'Václavské náměstí, Praha 1', country: 'Česká republika' },
    { name: 'náměstí Svobody, Brno', country: 'Česká republika' },
    { name: 'Nová Karolina, Ostrava', country: 'Česká republika' },
    { name: 'náměstí Republiky, Plzeň', country: 'Česká republika' },
    { name: 'Frauenkirche, Dresden', country: 'Německo' },
    { name: 'Brandenburg Gate, Berlin', country: 'Německo' },
    { name: 'Rynek Główny, Kraków', country: 'Polsko' },
    { name: 'Stare Miasto, Warszawa', country: 'Polsko' },
    { name: 'Market Square, Wrocław', country: 'Polsko' }
  ];

  const filtered = fallbackAddresses
    .filter(addr => 
      addr.name.toLowerCase().includes(query.toLowerCase()) ||
      addr.country.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5)
    .map((addr, index) => ({
      place_id: `fallback_addr_${index}_${addr.name.replace(/[^a-zA-Z0-9]/g, '_')}`,
      display_name: `${addr.name}, ${addr.country}`,
      structured_formatting: {
        main_text: addr.name,
        secondary_text: addr.country
      }
    }));

  return filtered;
};

export const useOptimizedAddressAutocomplete = (query: string) => {
  const [suggestions, setSuggestions] = useState<GooglePlacesSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  const searchPlaces = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use Edge function for address autocomplete
      const { data, error: funcError } = await supabase.functions.invoke('address-autocomplete', {
        body: { query: searchQuery }
      });

      if (funcError) {
        console.warn('Edge function error, falling back to local search:', funcError);
        // Fallback to local address search
        const fallbackAddresses = getAddressFallback(searchQuery);
        setSuggestions(fallbackAddresses);
        return;
      }

      if (data && data.predictions) {
        const mappedSuggestions = data.predictions.map((prediction: any) => ({
          place_id: prediction.place_id,
          display_name: prediction.description,
          structured_formatting: prediction.structured_formatting
        }));
        
        setSuggestions(mappedSuggestions);
      } else {
        // Fallback to local search if no predictions
        const fallbackAddresses = getAddressFallback(searchQuery);
        setSuggestions(fallbackAddresses);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      // Fallback to local address search
      const fallbackAddresses = getAddressFallback(searchQuery);
      setSuggestions(fallbackAddresses);
      setError(null); // Don't show error if fallback works
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      searchPlaces(debouncedQuery);
    } else {
      setSuggestions([]);
      setError(null);
    }
  }, [debouncedQuery, searchPlaces]);

  return { suggestions, loading, error };
};
