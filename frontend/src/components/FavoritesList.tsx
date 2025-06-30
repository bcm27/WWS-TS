import { useState } from 'react';
import { Trash2, Heart, AlertCircle } from 'lucide-react';
import { FavoritesListProps, FavoriteSpecies, MAX_FAVORITES } from '@/types';
import { formatPrice, formatRelativeTime, getWoodTypeInfo, cn } from '@/utils';

/**
 * Component for displaying and managing favorites
 */
export function FavoritesList({ 
  favorites, 
  onRemoveFavorite, 
  onClearAll 
}: FavoritesListProps) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleSelectAll = () => {
    if (selectedItems.size === favorites.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(favorites.map(f => f.id)));
    }
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach(id => onRemoveFavorite(id));
    setSelectedItems(new Set());
  };

  const handleClearAll = () => {
    onClearAll();
    setShowConfirmClear(false);
    setSelectedItems(new Set());
  };

  if (favorites.length === 0) {
    return <EmptyFavorites />;
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Favorites ({favorites.length}/{MAX_FAVORITES})
          </h2>
          
          <div className="flex items-center space-x-2">
            <div className={cn(
              'h-2 bg-gray-200 rounded-full',
              'w-24'
            )}>
              <div 
                className="h-2 bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${(favorites.length / MAX_FAVORITES) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-500">
              {MAX_FAVORITES - favorites.length} remaining
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {selectedItems.size > 0 && (
            <button
              onClick={handleRemoveSelected}
              className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove Selected ({selectedItems.size})
            </button>
          )}
          
          <button
            onClick={() => setShowConfirmClear(true)}
            disabled={favorites.length === 0}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear All
          </button>
        </div>
      </div>

      {/* Bulk selection controls */}
      {favorites.length > 0 && (
        <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.size === favorites.length && favorites.length > 0}
              onChange={toggleSelectAll}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">
              Select All ({favorites.length})
            </span>
          </label>
          
          {selectedItems.size > 0 && (
            <span className="text-sm text-gray-500">
              {selectedItems.size} selected
            </span>
          )}
        </div>
      )}

      {/* Favorites grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((favorite) => (
          <FavoriteCard
            key={favorite.id}
            favorite={favorite}
            onRemove={() => onRemoveFavorite(favorite.id)}
            isSelected={selectedItems.has(favorite.id)}
            onToggleSelect={() => toggleSelectItem(favorite.id)}
          />
        ))}
      </div>

      {/* Clear all confirmation modal */}
      {showConfirmClear && (
        <ConfirmDialog
          title="Clear All Favorites"
          message={`Are you sure you want to remove all ${favorites.length} favorites? This action cannot be undone.`}
          confirmLabel="Clear All"
          onConfirm={handleClearAll}
          onCancel={() => setShowConfirmClear(false)}
          destructive
        />
      )}
    </div>
  );
}

/**
 * Individual favorite card component
 */
interface FavoriteCardProps {
  favorite: FavoriteSpecies;
  onRemove: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
}

function FavoriteCard({ 
  favorite, 
  onRemove, 
  isSelected, 
  onToggleSelect 
}: FavoriteCardProps) {
  const woodTypeInfo = getWoodTypeInfo(favorite.woodType);

  return (
    <div className={cn(
      'relative bg-white rounded-lg border-2 transition-all duration-200 p-4',
      isSelected 
        ? 'border-primary-500 shadow-md' 
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
    )}>
      {/* Selection checkbox */}
      <div className="absolute top-3 left-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      </div>

      {/* Wood type badge */}
      <div className="absolute top-3 right-3">
        <span className={cn(
          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
          woodTypeInfo.color
        )}>
          <span className="mr-1">{woodTypeInfo.icon}</span>
          {woodTypeInfo.label}
        </span>
      </div>

      {/* Content */}
      <div className="mt-8 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {favorite.species}
          </h3>
          <p className="text-sm text-gray-600">
            Size: {favorite.size}
          </p>
        </div>

        {favorite.grade && (
          <div className="text-sm text-gray-600">
            Grade: <span className="font-medium">{favorite.grade}</span>
          </div>
        )}

        <div className="text-sm text-gray-600">
          Vendor: <span className="font-medium">{favorite.vendor}</span>
        </div>

        <div className="text-xl font-bold text-gray-900">
          {formatPrice(favorite.price)}
          <span className="text-sm text-gray-500 font-normal ml-1">per bf</span>
        </div>

        <div className="text-xs text-gray-500">
          Added {formatRelativeTime(favorite.dateAdded)}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center text-yellow-500">
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-xs text-gray-500 ml-1">Favorited</span>
          </div>
          
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded"
            aria-label="Remove from favorites"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state for when no favorites exist
 */
function EmptyFavorites() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
        <Heart className="w-12 h-12" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No favorites yet
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Start building your collection by adding wood species to your favorites. 
        You can save up to {MAX_FAVORITES} items.
      </p>
      
      <button className="text-primary-600 hover:text-primary-500 font-medium">
        Browse Wood Species
      </button>
    </div>
  );
}

/**
 * Confirmation dialog component
 */
interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

function ConfirmDialog({ 
  title, 
  message, 
  confirmLabel, 
  onConfirm, 
  onCancel, 
  destructive = false 
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onCancel}
        />

        {/* Center the modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            {destructive && (
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            )}
            
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              className={cn(
                'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
                destructive 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
              )}
            >
              {confirmLabel}
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}