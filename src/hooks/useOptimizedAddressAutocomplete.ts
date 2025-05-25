
import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from './useDebounce';

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

interface CacheEntry {
  data: AddressSuggestion[];
  timestamp: number;
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useOptimizedAddressAutocomplete = (query: string) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Memoize cache key
  const cacheKey = useMemo(() => 
    debouncedQuery.toLowerCase().trim(), 
    [debouncedQuery]
  );

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setSuggestions([]);
      setError(null);
      return;
    }

    // Check cache first
    const cachedResult = cache.get(cacheKey);
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      setSuggestions(cachedResult.data);
      return;
    }

    const searchAddresses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedQuery)}&limit=5&addressdetails=1&countrycodes=cz,de`,
          { 
            signal: controller.signal,
            headers: {
              'User-Agent': 'PendlerBuddy/1.0'
            }
          }
        );
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          
          // Cache the result
          cache.set(cacheKey, {
            data,
            timestamp: Date.now()
          });
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Request was aborted');
        } else {
          console.error('Error fetching address suggestions:', error);
          setError('Nepodařilo se načíst návrhy adres');
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    };

    searchAddresses();
  }, [debouncedQuery, cacheKey]);

  // Clear old cache entries periodically
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      for (const [key, entry] of cache.entries()) {
        if (now - entry.timestamp > CACHE_DURATION) {
          cache.delete(key);
        }
      }
    };

    const interval = setInterval(cleanup, 60000); // Cleanup every minute
    return () => clearInterval(interval);
  }, []);

  return { suggestions, loading, error };
};
