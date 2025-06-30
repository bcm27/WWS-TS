import { useState, useEffect, useCallback, useMemo } from 'react';
import { WoodSpecies, WoodType, UseSpeciesReturn, SortConfig, SEARCH_DEBOUNCE_MS } from '@/types';
import { speciesApi, handleApiError } from '@/services/api';
import { sortSpecies, filterSpecies, debounce } from '@/utils';

/**
 * Custom hook for managing wood species data and state
 */
export function useSpecies(): UseSpeciesReturn {
  const [species, setSpecies] = useState<WoodSpecies[]>([]);
  const [selectedWoodType, setSelectedWoodType] = useState<WoodType | null>(null);
  const [searchTerm, setSearchTermState] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Debounced search term setter
   */
  const debouncedSetSearchTerm = useMemo(
    () => debounce((term: string) => {
      setSearchTermState(term);
    }, SEARCH_DEBOUNCE_MS),
    []
  );

  /**
   * Set search term with debouncing
   */
  const setSearchTerm = useCallback((term: string) => {
    debouncedSetSearchTerm(term);
  }, [debouncedSetSearchTerm]);

  /**
   * Fetch species data for selected wood type
   */
  const fetchSpecies = useCallback(async (woodType: WoodType) => {
    if (!woodType) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await speciesApi.fetchSpecies(woodType);
      setSpecies(data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching species:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Select wood type and fetch data
   */
  const selectWoodType = useCallback((type: WoodType) => {
    setSelectedWoodType(type);
    setSearchTermState(''); // Clear search when changing wood type
    setSortConfig(null);   // Clear sort when changing wood type
    setError(null);        // Clear any previous errors
  }, []);

  /**
   * Handle sorting
   */
  const handleSort = useCallback((column: keyof WoodSpecies) => {
    setSortConfig(prevConfig => {
      if (prevConfig?.column === column) {
        // Toggle direction if same column
        return {
          column,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        // New column, start with ascending
        return {
          column,
          direction: 'asc',
        };
      }
    });
  }, []);

  /**
   * Refetch current data
   */
  const refetch = useCallback(async () => {
    if (selectedWoodType) {
      await fetchSpecies(selectedWoodType);
    }
  }, [selectedWoodType, fetchSpecies]);

  /**
   * Effect to fetch data when wood type changes
   */
  useEffect(() => {
    if (selectedWoodType) {
      fetchSpecies(selectedWoodType);
    }
  }, [selectedWoodType, fetchSpecies]);

  /**
   * Compute filtered and sorted species
   */
  const filteredSpecies = useMemo(() => {
    let result = species;

    // Apply search filter
    if (searchTerm.trim()) {
      result = filterSpecies(result, searchTerm);
    }

    // Apply sorting
    if (sortConfig) {
      result = sortSpecies(result, sortConfig.column, sortConfig.direction);
    }

    return result;
  }, [species, searchTerm, sortConfig]);

  return {
    species,
    selectedWoodType,
    searchTerm,
    sortConfig,
    filteredSpecies,
    isLoading,
    error,
    selectWoodType,
    setSearchTerm,
    handleSort,
    refetch,
  };
}

/**
 * Hook for searching across all wood types
 */
export function useSpeciesSearch() {
  const [results, setResults] = useState<WoodSpecies[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Search species across all types or within a specific type
   */
  const search = useCallback(async (searchTerm: string, woodType?: WoodType) => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await speciesApi.search(searchTerm, woodType);
      setResults(data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setResults([]);
      console.error('Error searching species:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear search results
   */
  const clearSearch = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  /**
   * Debounced search function
   */
  const debouncedSearch = useMemo(
    () => debounce(search, SEARCH_DEBOUNCE_MS),
    [search]
  );

  return {
    results,
    isLoading,
    error,
    search: debouncedSearch,
    clearSearch,
  };
}

/**
 * Hook for getting wood type metadata
 */
export function useWoodTypes() {
  const [woodTypes, setWoodTypes] = useState<{ type: WoodType; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch wood types with counts
   */
  const fetchWoodTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await speciesApi.getWoodTypes();
      setWoodTypes(data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching wood types:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load wood types on mount
   */
  useEffect(() => {
    fetchWoodTypes();
  }, [fetchWoodTypes]);

  return {
    woodTypes,
    isLoading,
    error,
    refetch: fetchWoodTypes,
  };
}