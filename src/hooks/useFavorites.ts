
import { useState, useEffect, useCallback } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('german_lesson_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('german_lesson_favorites', JSON.stringify(newFavorites));
  }, []);

  const addToFavorites = useCallback((phraseId: string) => {
    const newFavorites = [...favorites, phraseId];
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  const removeFromFavorites = useCallback((phraseId: string) => {
    const newFavorites = favorites.filter(id => id !== phraseId);
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  const toggleFavorite = useCallback((phraseId: string) => {
    if (favorites.includes(phraseId)) {
      removeFromFavorites(phraseId);
    } else {
      addToFavorites(phraseId);
    }
  }, [favorites, addToFavorites, removeFromFavorites]);

  const isFavorite = useCallback((phraseId: string) => {
    return favorites.includes(phraseId);
  }, [favorites]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite
  };
};
