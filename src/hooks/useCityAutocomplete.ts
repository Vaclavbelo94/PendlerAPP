
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

// Fallback cities for common destinations
const getCityFallback = (query: string): CitySuggestion[] => {
  const fallbackCities = [
    { name: 'Praha', country: 'Česká republika' },
    { name: 'Brno', country: 'Česká republika' },
    { name: 'Ostrava', country: 'Česká republika' },
    { name: 'Plzeň', country: 'Česká republika' },
    { name: 'Liberec', country: 'Česká republika' },
    { name: 'Olomouc', country: 'Česká republika' },
    { name: 'České Budějovice', country: 'Česká republika' },
    { name: 'Hradec Králové', country: 'Česká republika' },
    { name: 'Pardubice', country: 'Česká republika' },
    { name: 'Zlín', country: 'Česká republika' },
    { name: 'Havířov', country: 'Česká republika' },
    { name: 'Kladno', country: 'Česká republika' },
    { name: 'Most', country: 'Česká republika' },
    { name: 'Opava', country: 'Česká republika' },
    { name: 'Frýdek-Místek', country: 'Česká republika' },
    { name: 'Karviná', country: 'Česká republika' },
    { name: 'Jihlava', country: 'Česká republika' },
    { name: 'Teplice', country: 'Česká republika' },
    { name: 'Děčín', country: 'Česká republika' },
    { name: 'Karlovy Vary', country: 'Česká republika' },
    { name: 'Jablonec nad Nisou', country: 'Česká republika' },
    { name: 'Mladá Boleslav', country: 'Česká republika' },
    { name: 'Prostějov', country: 'Česká republika' },
    { name: 'Přerov', country: 'Česká republika' },
    { name: 'Chomutov', country: 'Česká republika' },
    { name: 'Třinec', country: 'Česká republika' },
    { name: 'Třebíč', country: 'Česká republika' },
    { name: 'Uherské Hradiště', country: 'Česká republika' },
    { name: 'Kralupy nad Vltavou', country: 'Česká republika' },
    { name: 'Beroun', country: 'Česká republika' },
    { name: 'Ottendorf-Okrilla', country: 'Německo' },
    { name: 'Dresden', country: 'Německo' },
    { name: 'Berlin', country: 'Německo' },
    { name: 'Görlitz', country: 'Německo' },
    { name: 'Bautzen', country: 'Německo' },
    { name: 'Zittau', country: 'Německo' },
    { name: 'Wrocław', country: 'Polsko' },
    { name: 'Kraków', country: 'Polsko' },
    { name: 'Warszawa', country: 'Polsko' },
    { name: 'Gdańsk', country: 'Polsko' },
    { name: 'Poznań', country: 'Polsko' },
    { name: 'Łódź', country: 'Polsko' },
    { name: 'Szczecin', country: 'Polsko' },
    { name: 'Katowice', country: 'Polsko' },
    { name: 'Lublin', country: 'Polsko' },
    { name: 'Białystok', country: 'Polsko' },
    { name: 'Opole', country: 'Polsko' }
  ];

  const filtered = fallbackCities
    .filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.country.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 8)
    .map((city, index) => ({
      place_id: `fallback_${index}_${city.name}`,
      display_name: `${city.name}, ${city.country}`,
      main_text: city.name,
      secondary_text: city.country
    }));

  return filtered;
};

export const useCityAutocomplete = (query: string) => {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const { t } = useTranslation('common');

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
        console.warn('Edge function error, falling back to local search:', funcError);
        // Fallback to local city search
        const fallbackCities = getCityFallback(searchQuery);
        setSuggestions(fallbackCities);
        return;
      }

      if (data && data.predictions) {
        setSuggestions(data.predictions);
      } else {
        // Fallback to local search if no predictions
        const fallbackCities = getCityFallback(searchQuery);
        setSuggestions(fallbackCities);
      }
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      // Fallback to local city search
      const fallbackCities = getCityFallback(searchQuery);
      setSuggestions(fallbackCities);
      setError(null); // Don't show error if fallback works
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
