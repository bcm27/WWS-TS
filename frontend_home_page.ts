import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, RefreshCw, Settings, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { WoodTypeSelector } from '@/components/WoodTypeSelector';
import { SearchBar, SearchSuggestions } from '@/components/SearchBar';
import { SpeciesTable, SpeciesTableCompact } from '@/components/SpeciesTable';
import { useSpecies } from '@/hooks/useSpecies';
import { useFavorites } from '@/hooks/useFavorites';
import { WoodType, WoodSpecies } from '@/types';
import { cn, isMobile } from '@/utils';

/**
 * Home page component - main species selector interface
 */
export function Home() {
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const {
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
  } = useSpecies();

  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    isMaxFavorites,
  } = useFavorites();

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobileView(isMobile());
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle favorite toggle
  const handleToggleFavorite = (woodSpecies: WoodSpecies, woodType: WoodType) => {
    if (!selectedWoodType) return;
    
    const speciesIsFavorited = isFavorite(woodSpecies, selectedWoodType);
    
    if (speciesIsFavorited) {
      removeFavorite(favorites.find(f => 
        f.species === woodSpecies.species && 
        f.size === woodSpecies.size && 
        f.vendor === woodSpecies.vendor
      )?.id || '');
      toast.success('Removed from favorites');
    } else {
      if (isMaxFavorites) {
        toast.error('Maximum favorites reached (32)');
        return;
      }
      
      const success = addFavorite(woodSpecies, selectedWoodType);
      if (success) {
        toast.success('Added to favorites');
      } else {
        toast.error('Failed to add to favorites');
      }
    }
  };

  // Handle search suggestions
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">
                🪵 Hardwood Species Selector
              </h1>
              
              {selectedWoodType && (
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                  <span>•</span>
                  <span className="capitalize">{selectedWoodType}</span>
                  <span>({filteredSpecies.length} species)</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Favorites link */}
              <Link
                to="/favorites"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Heart className="w-4 h-4 mr-2" />
                Favorites ({favorites.length})
              </Link>

              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="inline-flex items-center p-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                aria-label="Refresh data"
              >
                <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Wood type selector */}
          <WoodTypeSelector
            selectedType={selectedWoodType}
            onTypeSelect={selectWoodType}
            disabled={isLoading}
          />

          {/* Search and filters section */}
          {selectedWoodType && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Search Species
                  </label>
                  <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search by species, vendor, grade, or price..."
                    disabled={isLoading}
                  />
                </div>

                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Quick Search
                </button>
              </div>

              {/* Search suggestions */}
              {showSuggestions && (
                <SearchSuggestions
                  onSuggestionClick={handleSuggestionClick}
                  disabled={isLoading}
                />
              )}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading species data
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleRefresh}
                      className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Species table */}
          {selectedWoodType && !error && (
            <div className="space-y-4">
              {/* Table header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedWoodType.charAt(0).toUpperCase() + selectedWoodType.slice(1)} Wood Species
                  </h2>
                  {searchTerm && (
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredSpecies.length} results for "{searchTerm}"
                    </p>
                  )}
                </div>

                {/* Sort indicator */}
                {sortConfig && (
                  <div className="text-sm text-gray-500">
                    Sorted by {sortConfig.column} ({sortConfig.direction === 'asc' ? 'ascending' : 'descending'})
                  </div>
                )}
              </div>

              {/* Responsive table */}
              {isMobileView ? (
                <SpeciesTableCompact
                  species={filteredSpecies}
                  isLoading={isLoading}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                />
              ) : (
                <SpeciesTable
                  species={filteredSpecies}
                  isLoading={isLoading}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                />
              )}
            </div>
          )}

          {/* Getting started message */}
          {!selectedWoodType && !error && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                🌳
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to Hardwood Species Selector
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Select a wood type above to browse available species, compare prices, and save your favorites.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => selectWoodType('domestic')}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Browse Domestic Woods
                </button>
                <span className="text-gray-300">|</span>
                <Link
                  to="/favorites"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  View Favorites
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2024 Hardwood Species Selector. Built with TypeScript, React, and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}