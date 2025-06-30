import { useState, useEffect, useCallback } from 'react';
import { WoodSpecies, WoodType, FavoriteSpecies, UseFavoritesReturn, MAX_FAVORITES } from '@/types';
import { localStorageService } from '@/utils/localStorage';
import { generateSpeciesId } from '@/utils';

/**
 * Custom hook for managing favorites functionality
 */
export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<FavoriteSpecies[]>([]);
  const [_isLoading, setIsLoading] = useState(true);  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorageService.getFavorites();
        setFavorites(stored);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
    };}

    loadFavorites();
  }, []);

  /**
   * Add a species to favorites
   */
  const addFavorite = useCallback((species: WoodSpecies, woodType: WoodType): boolean => {
    // Check if already at max favorites
    if (favorites.length >= MAX_FAVORITES) {
      return false;
    }

    const id = generateSpeciesId(species, woodType);
    
    // Check if already favorited
    if (favorites.some(fav => fav.id === id)) {
      return false;
    }

    const newFavorite: FavoriteSpecies = {
      id,
      species: species.species,
      size: species.size,
      price: species.price,
      grade: species.grade,
      vendor: species.vendor,
      woodType,
      dateAdded: new Date().toISOString(),
    };

    const updatedFavorites = [...favorites, newFavorite];
    
    // Save to localStorage
    if (localStorageService.saveFavorites(updatedFavorites)) {
      setFavorites(updatedFavorites);
      return true;
    }
    
    return false;
  }, [favorites]);

  /**
   * Remove a favorite by ID
   */
  const removeFavorite = useCallback((id: string): void => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    
    if (localStorageService.saveFavorites(updatedFavorites)) {
      setFavorites(updatedFavorites);
    }
  }, [favorites]);

  /**
   * Clear all favorites
   */
  const clearFavorites = useCallback((): void => {
    if (localStorageService.clearFavorites()) {
      setFavorites([]);
    }
  }, []);

  /**
   * Check if a species is favorited
   */
  const isFavorite = useCallback((species: WoodSpecies, woodType: WoodType): boolean => {
    const id = generateSpeciesId(species, woodType);
    return favorites.some(fav => fav.id === id);
  }, [favorites]);

  /**
   * Get favorite ID for a species
   */
  const getFavoriteId = useCallback((species: WoodSpecies, woodType: WoodType): string => {
    return generateSpeciesId(species, woodType);
  }, []);

  /**
   * Check if at maximum favorites
   */
  const isMaxFavorites = favorites.length >= MAX_FAVORITES;

  return {
    favorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
    getFavoriteId,
    isMaxFavorites,
  };
}