
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface GooglePlacesSuggestion {
  place_id: string;
  display_name: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

const GOOGLE_MAPS_API_KEY = "AIzaSyBKc8VQM2i4TyHq5mI6aK9gJNBBSVnO4xY";

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
      // Using Google Places API for better autocomplete
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(searchQuery)}&types=address&components=country:cz|country:de&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'OK') {
        const mappedSuggestions = data.predictions?.map((prediction: any) => ({
          place_id: prediction.place_id,
          display_name: prediction.description,
          structured_formatting: prediction.structured_formatting
        })) || [];
        
        setSuggestions(mappedSuggestions);
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
