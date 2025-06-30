import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Upload, FileText, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

import { FavoritesList } from '@/components/FavoritesList';
import { useFavorites } from '@/hooks/useFavorites';
import { localStorageService } from '@/utils/localStorage';
import { downloadAsFile } from '@/utils';

/**
 * Favorites page component - manage saved species
 */
export function Favorites() {
  const [_showImportDialog, setShowImportDialog] = useState(false);
  
  const {
    favorites,
    removeFavorite,
    clearFavorites,
  } = useFavorites();

  // Handle export favorites
  const handleExport = () => {
    try {
      const exportData = localStorageService.exportFavorites();
      const fileName = `hardwood-favorites-${new Date().toISOString().split('T')[0]}.json`;
      downloadAsFile(exportData, fileName, 'application/json');
      toast.success('Favorites exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export favorites');
    }
  };

const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) {
    setShowImportDialog(false);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const result = localStorageService.importFavorites(content);

      if (result.success) {
        toast.success(`Imported ${result.imported} favorites`);
        if (result.errors.length > 0) {
          result.errors.forEach(error => toast.error(error));
        }
      } else {
        toast.error('Failed to import favorites');
        result.errors.forEach(error => toast.error(error));
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to read import file');
    } finally {
      setShowImportDialog(false);
    }
  };

  reader.readAsText(file);

  // Reset file input
  event.target.value = '';
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Species Selector
              </Link>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                My Favorites
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              {/* Export button */}
              <button
                onClick={handleExport}
                disabled={favorites.length === 0}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export favorites to JSON file"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>

              {/* Import button */}
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
                  title="Import favorites from JSON file"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </label>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-100">
                  <Heart className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Your Favorite Wood Species
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Manage your saved wood species. You can export your favorites to backup or share, 
                  and import previously saved collections. Each collection can contain up to 32 species.
                </p>
              </div>
            </div>
            
            {/* Quick stats */}
            {favorites.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{favorites.length}</div>
                    <div className="text-sm text-gray-500">Total Favorites</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {new Set(favorites.map(f => f.woodType)).size}
                    </div>
                    <div className="text-sm text-gray-500">Wood Types</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {new Set(favorites.map(f => f.vendor)).size}
                    </div>
                    <div className="text-sm text-gray-500">Vendors</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Favorites list */}
          <FavoritesList
            favorites={favorites}
            onRemoveFavorite={removeFavorite}
            onClearAll={clearFavorites}
          />

          {/* Import/Export help */}
          {favorites.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Backup & Share
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Use the export feature to create a backup of your favorites or share them with colleagues. 
                      The exported file can be imported later to restore your collection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <Link to="/" className="hover:text-gray-700">
                Species Selector
              </Link>
              <span>•</span>
              <Link to="/favorites" className="hover:text-gray-700">
                Favorites
              </Link>
              <span>•</span>
              <button
                onClick={handleExport}
                disabled={favorites.length === 0}
                className="hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export Data
              </button>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              &copy; 2024 Hardwood Species Selector. Your favorites are stored locally in your browser.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Quick actions component for the favorites page
 */
export function FavoritesQuickActions() {
  const { favorites } = useFavorites();
  
  const groupedByType = favorites.reduce((acc, fav) => {
    acc[fav.woodType] = (acc[fav.woodType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (favorites.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="space-y-4">
        {/* Browse by type */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Browse by Type</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(groupedByType).map(([type, count]) => (
              <Link
                key={type}
                to={`/?type=${type}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                {type} ({count})
              </Link>
            ))}
          </div>
        </div>

        {/* Price range summary */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
          <div className="text-sm text-gray-600">
            ${Math.min(...favorites.map(f => f.price)).toFixed(2)} - 
            ${Math.max(...favorites.map(f => f.price)).toFixed(2)} per board foot
          </div>
        </div>
      </div>
    </div>
  );
}