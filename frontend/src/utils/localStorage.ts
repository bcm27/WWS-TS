import { FavoritesStore, FavoriteSpecies, STORAGE_KEYS } from '@/types';

const CURRENT_VERSION = 1;

/**
 * Local storage utilities with error handling and versioning
 */
class LocalStorageService {
  /**
   * Get favorites from localStorage
   */
  getFavorites(): FavoriteSpecies[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!stored) {
        return [];
      }

      const data: FavoritesStore = JSON.parse(stored);
      
      // Handle version migration if needed
      if (data.version !== CURRENT_VERSION) {
        return this.migrateFavorites(data);
      }

      return data.favorites || [];
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error);
      return [];
    }
  }

  /**
   * Save favorites to localStorage
   */
  saveFavorites(favorites: FavoriteSpecies[]): boolean {
    try {
      const data: FavoritesStore = {
        favorites,
        lastUpdated: new Date().toISOString(),
        version: CURRENT_VERSION,
      };

      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
      
      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.handleQuotaExceeded();
      }
      
      return false;
    }
  }

  /**
   * Add a single favorite
   */
  addFavorite(favorite: FavoriteSpecies): boolean {
    const favorites = this.getFavorites();
    
    // Check if already exists
    const exists = favorites.some(f => f.id === favorite.id);
    if (exists) {
      return false;
    }

    favorites.push(favorite);
    return this.saveFavorites(favorites);
  }

  /**
   * Remove a single favorite by ID
   */
  removeFavorite(id: string): boolean {
    const favorites = this.getFavorites();
    const filtered = favorites.filter(f => f.id !== id);
    
    if (filtered.length === favorites.length) {
      return false; // ID not found
    }

    return this.saveFavorites(filtered);
  }

  /**
   * Clear all favorites
   */
  clearFavorites(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEYS.FAVORITES);
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage usage info
   */
  getStorageInfo(): { used: number; available: boolean } {
    if (!this.isAvailable()) {
      return { used: 0, available: false };
    }

    try {
      const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES) || '';
      return {
        used: new Blob([favorites]).size,
        available: true,
      };
    } catch {
      return { used: 0, available: false };
    }
  }

  /**
   * Handle quota exceeded error
   */
  private handleQuotaExceeded(): void {
    console.warn('localStorage quota exceeded. Attempting to free space...');
    
    try {
      // Remove oldest favorites if we have too many
      const favorites = this.getFavorites();
      if (favorites.length > 20) {
        const sorted = favorites.sort((a, b) => 
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );
        const reduced = sorted.slice(-20); // Keep newest 20
        this.saveFavorites(reduced);
      }
    } catch (error) {
      console.error('Failed to handle quota exceeded:', error);
    }
  }

  /**
   * Migrate favorites from older versions
   */
  private migrateFavorites(data: any): FavoriteSpecies[] {
    console.log('Migrating favorites data from version', data.version, 'to', CURRENT_VERSION);
    
    try {
      // Version 0 to 1 migration (if needed in future)
      if (!data.version || data.version === 0) {
        // Handle migration from unversioned data
        if (Array.isArray(data)) {
          return data as FavoriteSpecies[];
        }
        if (data.favorites && Array.isArray(data.favorites)) {
          return data.favorites as FavoriteSpecies[];
        }
      }

      return data.favorites || [];
    } catch (error) {
      console.error('Error migrating favorites:', error);
      return [];
    }
  }

  /**
   * Export favorites as JSON
   */
  exportFavorites(): string {
    const favorites = this.getFavorites();
    return JSON.stringify({
      favorites,
      exportedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    }, null, 2);
  }

  /**
   * Import favorites from JSON
   */
  importFavorites(jsonString: string): { success: boolean; imported: number; errors: string[] } {
    const result = { success: false, imported: 0, errors: [] as string[] };

    try {
      const data = JSON.parse(jsonString);
      
      if (!data.favorites || !Array.isArray(data.favorites)) {
        result.errors.push('Invalid format: favorites array not found');
        return result;
      }

      const currentFavorites = this.getFavorites();
      const importedFavorites: FavoriteSpecies[] = [];

      for (const favorite of data.favorites) {
        // Validate favorite structure
        if (this.validateFavorite(favorite)) {
          // Check if not already exists
          if (!currentFavorites.some(f => f.id === favorite.id)) {
            importedFavorites.push(favorite);
          }
        } else {
          result.errors.push(`Invalid favorite: ${favorite.species || 'unknown'}`);
        }
      }

      if (importedFavorites.length > 0) {
        const allFavorites = [...currentFavorites, ...importedFavorites];
        result.success = this.saveFavorites(allFavorites);
        result.imported = importedFavorites.length;
      } else {
        result.success = true;
        result.errors.push('No new favorites to import');
      }

      return result;
    } catch (error) {
      result.errors.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  /**
   * Validate favorite structure
   */
  private validateFavorite(favorite: any): favorite is FavoriteSpecies {
    return (
      typeof favorite === 'object' &&
      typeof favorite.id === 'string' &&
      typeof favorite.species === 'string' &&
      typeof favorite.size === 'string' &&
      typeof favorite.vendor === 'string' &&
      typeof favorite.price === 'number' &&
      typeof favorite.woodType === 'string' &&
      typeof favorite.dateAdded === 'string' &&
      ['domestic', 'exotic', 'plywood'].includes(favorite.woodType)
    );
  }
}

// Create and export singleton instance
export const localStorageService = new LocalStorageService();

// Export utility functions
export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};