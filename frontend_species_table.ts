import React from 'react';
import { ChevronUp, ChevronDown, Star, Heart } from 'lucide-react';
import { SpeciesTableProps, WoodSpecies, SortConfig, TableColumn } from '@/types';
import { formatPrice, formatGrade, cn } from '@/utils';

/**
 * Main species table component
 */
export function SpeciesTable({
  species,
  isLoading,
  onSort,
  sortConfig,
  onToggleFavorite,
  favorites,
}: SpeciesTableProps) {
  // Define table columns
  const columns: TableColumn[] = [
    { key: 'species', label: 'Species', sortable: true },
    { key: 'size', label: 'Size', sortable: true },
    { key: 'grade', label: 'Grade', sortable: true, formatter: formatGrade },
    { key: 'price', label: 'Price', sortable: true, formatter: formatPrice, className: 'text-right' },
    { key: 'vendor', label: 'Vendor', sortable: true },
  ];

  const handleSort = (column: keyof WoodSpecies) => {
    onSort(column);
  };

  const getSortIcon = (column: keyof WoodSpecies) => {
    if (sortConfig?.column !== column) {
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-gray-600" />
      : <ChevronDown className="w-4 h-4 text-gray-600" />;
  };

  const isFavorited = (item: WoodSpecies) => {
    return favorites.some(fav => 
      fav.species === item.species && 
      fav.size === item.size && 
      fav.vendor === item.vendor
    );
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (species.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Favorite column */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
              >
                <Heart className="w-4 h-4" />
              </th>
              
              {/* Data columns */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : '',
                    column.className || 'text-left'
                  )}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {species.map((item, index) => {
              const favorited = isFavorited(item);
              
              return (
                <tr
                  key={`${item.species}-${item.size}-${item.vendor}-${index}`}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* Favorite button */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleFavorite(item, 'domestic')} // TODO: Pass actual wood type
                      className={cn(
                        'p-1 rounded-full transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
                        favorited
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-400 hover:text-red-500'
                      )}
                      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart 
                        className={cn(
                          'w-4 h-4 transition-all duration-200',
                          favorited ? 'fill-current' : ''
                        )} 
                      />
                    </button>
                  </td>
                  
                  {/* Data columns */}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-6 py-4 whitespace-nowrap text-sm',
                        column.className || ''
                      )}
                    >
                      {column.key === 'species' ? (
                        <div className="font-medium text-gray-900">{item[column.key]}</div>
                      ) : column.formatter ? (
                        <div className="text-gray-900">
                          {column.formatter(item[column.key])}
                        </div>
                      ) : (
                        <div className="text-gray-900">{item[column.key] || '—'}</div>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Table footer with count */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{species.length}</span> species
          </div>
          
          {sortConfig && (
            <div className="text-sm text-gray-500">
              Sorted by {sortConfig.column} ({sortConfig.direction})
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for the table
 */
function TableSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="bg-gray-50 px-6 py-3">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        
        {/* Row skeletons */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-t border-gray-200">
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-4"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Empty state when no species are found
 */
function EmptyState() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No species found
        </h3>
        
        <p className="text-gray-500 mb-6">
          Try selecting a different wood type or adjusting your search criteria.
        </p>
        
        <div className="flex justify-center space-x-4">
          <button className="text-primary-600 hover:text-primary-500 font-medium">
            Clear filters
          </button>
          <button className="text-primary-600 hover:text-primary-500 font-medium">
            View all species
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact table view for mobile
 */
export function SpeciesTableCompact({
  species,
  isLoading,
  onToggleFavorite,
  favorites,
}: Omit<SpeciesTableProps, 'onSort' | 'sortConfig'>) {
  const isFavorited = (item: WoodSpecies) => {
    return favorites.some(fav => 
      fav.species === item.species && 
      fav.size === item.size && 
      fav.vendor === item.vendor
    );
  };

  if (isLoading) {
    return <CompactSkeleton />;
  }

  if (species.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {species.map((item, index) => {
        const favorited = isFavorited(item);
        
        return (
          <div
            key={`${item.species}-${item.size}-${item.vendor}-${index}`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{item.species}</h3>
                  <span className="text-sm text-gray-500">({item.size})</span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  {item.grade && (
                    <div>Grade: <span className="font-medium">{item.grade}</span></div>
                  )}
                  <div>Vendor: <span className="font-medium">{item.vendor}</span></div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatPrice(item.price)}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onToggleFavorite(item, 'domestic')} // TODO: Pass actual wood type
                className={cn(
                  'p-2 rounded-full transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
                  favorited
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-red-500'
                )}
                aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart 
                  className={cn(
                    'w-5 h-5 transition-all duration-200',
                    favorited ? 'fill-current' : ''
                  )} 
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Compact loading skeleton
 */
function CompactSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}