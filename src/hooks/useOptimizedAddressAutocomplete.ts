
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
        throw funcError;
      }

      if (data && data.predictions) {
        const mappedSuggestions = data.predictions.map((prediction: any) => ({
          place_id: prediction.place_id,
          display_name: prediction.description,
          structured_formatting: prediction.structured_formatting
        }));
        
        setSuggestions(mappedSuggestions);
      } else {
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
