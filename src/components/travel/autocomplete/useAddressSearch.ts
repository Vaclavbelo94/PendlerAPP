
import { useState, useCallback } from 'react';
import { GooglePlacesSuggestion } from './types';
import { GOOGLE_MAPS_API_KEY, AUTOCOMPLETE_CONFIG } from './constants';

export const useAddressSearch = () => {
  const [suggestions, setSuggestions] = useState<GooglePlacesSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPlaces = useCallback(async (query: string) => {
    if (!query || query.length < AUTOCOMPLETE_CONFIG.MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=${AUTOCOMPLETE_CONFIG.REQUEST_TYPES}&components=country:${AUTOCOMPLETE_CONFIG.COUNTRY_CODES}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'OK') {
        setSuggestions(data.predictions || []);
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

  return {
    suggestions,
    loading,
    error,
    searchPlaces,
    setSuggestions,
    setError
  };
};
