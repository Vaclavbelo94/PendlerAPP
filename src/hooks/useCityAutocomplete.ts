
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

interface CitySuggestion {
  place_id: string;
  display_name: string;
  main_text: string;
  secondary_text: string;
}

export const useCityAutocomplete = (query: string) => {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const { t } = useTranslation('profile');

  const searchCities = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use Edge function for city autocomplete
      const { data, error: funcError } = await supabase.functions.invoke('address-autocomplete', {
        body: { query: searchQuery, type: 'cities' }
      });

      if (funcError) {
        throw funcError;
      }

      if (data && data.predictions) {
        setSuggestions(data.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      setError(t('noCitiesFound'));
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (debouncedQuery) {
      searchCities(debouncedQuery);
    } else {
      setSuggestions([]);
      setError(null);
    }
  }, [debouncedQuery, searchCities]);

  return { suggestions, loading, error };
};
