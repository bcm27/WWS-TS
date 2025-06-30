import { WoodSpecies, WoodType, FavoriteSpecies } from '@/types';
import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for combining CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Generate a unique ID for a wood species (for favorites)
 */
export function generateSpeciesId(species: WoodSpecies, woodType: WoodType): string {
  const baseString = `${species.species}-${species.size}-${species.vendor}-${woodType}`;
  return btoa(baseString).replace(/[+/=]/g, '').toLowerCase();
}

/**
 * Format price as currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format wood size for display
 */
export function formatSize(size: string): string {
  // Handle common size formats
  if (size.includes('/')) {
    return size; // Already in fraction format
  }
  
  // Convert decimal to fraction if needed
  const num = parseFloat(size);
  if (!isNaN(num)) {
    return `${Math.round(num * 4)}/4`;
  }
  
  return size;
}

/**
 * Format grade for display (handle undefined/null)
 */
export function formatGrade(grade?: string): string {
  return grade || '';
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sort array of wood species by column
 */
export function sortSpecies(
  species: WoodSpecies[],
  column: keyof WoodSpecies,
  direction: 'asc' | 'desc'
): WoodSpecies[] {
  return [...species].sort((a, b) => {
    const aVal = a[column];
    const bVal = b[column];
    
    // Handle undefined values (grade can be undefined)
    if (aVal === undefined && bVal === undefined) return 0;
    if (aVal === undefined) return direction === 'asc' ? 1 : -1;
    if (bVal === undefined) return direction === 'asc' ? -1 : 1;
    
    // Handle different data types
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    // String comparison (case-insensitive)
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    
    if (aStr < bStr) return direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Filter species based on search term
 */
export function filterSpecies(species: WoodSpecies[], searchTerm: string): WoodSpecies[] {
  if (!searchTerm.trim()) return species;
  
  const term = searchTerm.toLowerCase().trim();
  
  return species.filter(item => 
    item.species.toLowerCase().includes(term) ||
    item.vendor.toLowerCase().includes(term) ||
    item.size.toLowerCase().includes(term) ||
    (item.grade && item.grade.toLowerCase().includes(term)) ||
    formatPrice(item.price).toLowerCase().includes(term)
  );
}

/**
 * Get wood type display information
 */
export function getWoodTypeInfo(type: WoodType) {
  const info = {
    domestic: {
      label: 'Domestic',
      description: 'North American hardwood species',
      icon: '🌲',
      color: 'bg-green-100 text-green-800',
    },
    exotic: {
      label: 'Exotic',
      description: 'International and tropical hardwoods',
      icon: '🌴',
      color: 'bg-orange-100 text-orange-800',
    },
    plywood: {
      label: 'Plywood',
      description: 'Engineered wood panels and veneers',
      icon: '📋',
      color: 'bg-blue-100 text-blue-800',
    },
  };
  
  return info[type];
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

/**
 * Download text as file
 */
export function downloadAsFile(content: string, filename: string, mimeType = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return 'Unknown';
  }
}

/**
 * Calculate board feet from dimensions
 */
export function calculateBoardFeet(
  thickness: number, // in inches
  width: number,     // in inches
  length: number     // in feet
): number {
  return (thickness * width * length) / 12;
}

/**
 * Parse size string to numeric value for calculations
 */
export function parseSize(size: string): number {
  // Handle quarter sizes (4/4, 6/4, etc.)
  if (size.includes('/')) {
    const parts = size.split('/').map(n => parseInt(n, 10));
    const numerator = parts[0];
    const denominator = parts[1];
    
    // Check if both parts are valid numbers
    if (numerator !== undefined && denominator !== undefined && 
        !isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
    
    // Return 0 for invalid fractions
    return 0;
  }
  
  // Handle decimal sizes
  const parsed = parseFloat(size);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Get unique values from array of objects by key
 */
export function getUniqueValues<T, K extends keyof T>(array: T[], key: K): T[K][] {
  return Array.from(new Set(array.map(item => item[key]).filter(Boolean)));
}

/**
 * Group array by key
 */
export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey]!.push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  return window.innerWidth < 768;
}

/**
 * Scroll to element smoothly
 */
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Convert favorites to wood species for display
 */
export function favoriteToSpecies(favorite: FavoriteSpecies): WoodSpecies {
  return {
    species: favorite.species,
    size: favorite.size,
    price: favorite.price,
    grade: favorite.grade,
    vendor: favorite.vendor,
  };
}