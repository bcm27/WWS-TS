// Core wood species interface
export interface WoodSpecies {
  species: string;        // Required
  size: string;          // Required (in quarters: 4/4, 6/4, etc)
  price: number;         // Required (stored as double, displayed with $ prefix)
  grade?: string;        // Optional (display as blank cell when undefined)
  vendor: string;        // Required
}

export type WoodType = 'domestic' | 'exotic' | 'plywood';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

export interface GetSpeciesResponse extends ApiResponse<WoodSpecies[]> {
  count: number;
}

// Favorites management
export interface FavoriteSpecies {
  id: string;           // Hash of species + size + index
  species: string;      // Species name
  size: string;         // Size in quarters
  grade?: string;       // Grade if available
  vendor: string;       // Vendor name
  price: number;        // Price per board foot
  dateAdded: string;    // ISO date string
  woodType: WoodType;   // Source type
}

export interface FavoritesStore {
  favorites: FavoriteSpecies[];
  lastUpdated: string;  // ISO date string
  version: number;      // Schema version for future migrations
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface SpeciesTableState extends LoadingState {
  species: WoodSpecies[];
  selectedWoodType: WoodType | null;
  searchTerm: string;
  sortColumn: keyof WoodSpecies | null;
  sortDirection: 'asc' | 'desc';
  filteredSpecies: WoodSpecies[];
}

// Sort configuration
export interface SortConfig {
  column: keyof WoodSpecies;
  direction: 'asc' | 'desc';
}

// Filter configuration
export interface FilterConfig {
  searchTerm: string;
  priceRange?: {
    min: number;
    max: number;
  };
  vendors?: string[];
  grades?: string[];
}

// Table column configuration
export interface TableColumn {
  key: keyof WoodSpecies;
  label: string;
  sortable: boolean;
  formatter?: (value: any) => string;
  className?: string;
}

// Component props types
export interface WoodTypeSelectorProps {
  selectedType: WoodType | null;
  onTypeSelect: (type: WoodType) => void;
  disabled?: boolean;
}

export interface SpeciesTableProps {
  species: WoodSpecies[];
  isLoading: boolean;
  onSort: (column: keyof WoodSpecies) => void;
  sortConfig: SortConfig | null;
  onToggleFavorite: (species: WoodSpecies, woodType: WoodType) => void;
  favorites: FavoriteSpecies[];
}

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface FavoritesListProps {
  favorites: FavoriteSpecies[];
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
}

// Hook return types
export interface UseFavoritesReturn {
  favorites: FavoriteSpecies[];
  addFavorite: (species: WoodSpecies, woodType: WoodType) => boolean;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (species: WoodSpecies, woodType: WoodType) => boolean;
  getFavoriteId: (species: WoodSpecies, woodType: WoodType) => string;
  isMaxFavorites: boolean;
}

export interface UseSpeciesReturn extends LoadingState {
  species: WoodSpecies[];
  selectedWoodType: WoodType | null;
  searchTerm: string;
  sortConfig: SortConfig | null;
  filteredSpecies: WoodSpecies[];
  selectWoodType: (type: WoodType) => void;
  setSearchTerm: (term: string) => void;
  handleSort: (column: keyof WoodSpecies) => void;
  refetch: () => Promise<void>;
}

// Local storage keys
export const STORAGE_KEYS = {
  FAVORITES: 'hardwood-selector-favorites',
  PREFERENCES: 'hardwood-selector-preferences',
} as const;

// Constants
export const MAX_FAVORITES = 32;
export const SEARCH_DEBOUNCE_MS = 300;
export const API_BASE_URL = '/api';

// Error types
export type ApiErrorType = 
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'RATE_LIMITED'
  | 'UNKNOWN_ERROR';

export interface AppError {
  type: ApiErrorType;
  message: string;
  details?: string;
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'table' | 'grid';
  itemsPerPage: number;
  autoRefresh: boolean;
}

// Wood type metadata
export interface WoodTypeInfo {
  type: WoodType;
  label: string;
  description: string;
  count?: number;
}