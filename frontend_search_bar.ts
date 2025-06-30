import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { SearchBarProps } from '@/types';
import { cn } from '@/utils';

/**
 * Search bar component with clear functionality
 */
export function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder = 'Search species, vendor, grade...',
  disabled = false,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(searchTerm);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    onSearchChange(value);
  };

  const handleClear = () => {
    setLocalValue('');
    onSearchChange('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search 
            className={cn(
              'h-5 w-5 transition-colors duration-200',
              disabled ? 'text-gray-300' : 'text-gray-400'
            )} 
            aria-hidden="true"
          />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg',
            'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'placeholder-gray-400 text-gray-900 text-sm',
            'transition-colors duration-200',
            disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
            localValue && 'pr-10'
          )}
          aria-label="Search wood species"
        />
        
        {localValue && !disabled && (
          <button
            onClick={handleClear}
            className={cn(
              'absolute inset-y-0 right-0 pr-3 flex items-center',
              'text-gray-400 hover:text-gray-600 focus:outline-none',
              'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded'
            )}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Search results count indicator */}
      {localValue && (
        <div className="absolute top-full left-0 mt-1">
          <div className="text-xs text-gray-500">
            Searching for "{localValue}"
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Advanced search bar with filters
 */
interface AdvancedSearchBarProps extends SearchBarProps {
  onPriceRangeChange?: (min: number, max: number) => void;
  priceRange?: { min: number; max: number };
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

export function AdvancedSearchBar({
  searchTerm,
  onSearchChange,
  placeholder = 'Search species, vendor, grade...',
  disabled = false,
  onPriceRangeChange,
  priceRange,
  showFilters = false,
  onToggleFilters,
}: AdvancedSearchBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
        
        {onToggleFilters && (
          <button
            onClick={onToggleFilters}
            className={cn(
              'px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'transition-colors duration-200',
              showFilters
                ? 'bg-primary-50 text-primary-700 border-primary-300'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            )}
            disabled={disabled}
          >
            Filters
          </button>
        )}
      </div>
      
      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Filters</h3>
          
          {/* Price Range Filter */}
          {onPriceRangeChange && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Price Range (per board foot)
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange?.min || ''}
                    onChange={(e) => {
                      const min = parseFloat(e.target.value) || 0;
                      onPriceRangeChange(min, priceRange?.max || 1000);
                    }}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    disabled={disabled}
                  />
                </div>
                <span className="text-gray-500">to</span>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange?.max || ''}
                    onChange={(e) => {
                      const max = parseFloat(e.target.value) || 1000;
                      onPriceRangeChange(priceRange?.min || 0, max);
                    }}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Quick search suggestions component
 */
interface SearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  disabled?: boolean;
}

export function SearchSuggestions({ 
  onSuggestionClick, 
  disabled = false 
}: SearchSuggestionsProps) {
  const suggestions = [
    'Oak', 'Cherry', 'Maple', 'Walnut', 'Mahogany', 'Teak',
    '4/4', '6/4', '8/4', 'Select', 'Common', 'FAS'
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Search</h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            disabled={disabled}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-full border',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
              disabled
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200'
            )}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}