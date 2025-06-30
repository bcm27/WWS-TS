import { 
  WoodSpecies, 
  WoodType, 
  GetSpeciesResponse, 
  ApiResponse,
  ApiError,
  ApiErrorType 
} from '@/types';

const API_BASE_URL = '/api';

class ApiService {
  private async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          success: false,
          error: 'Unknown Error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        }));

        throw this.createAppError(response.status, errorData.message || errorData.error);
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'TypeError') {
        // Network error (fetch failed)
        throw this.createAppError(0, 'Network error. Please check your internet connection.');
      }
      throw error; // Re-throw our custom errors
    }
  }

  private createAppError(status: number, message: string): Error {
    let type: ApiErrorType;
    
    switch (status) {
      case 400:
        type = 'BAD_REQUEST';
        break;
      case 404:
        type = 'NOT_FOUND';
        break;
      case 429:
        type = 'RATE_LIMITED';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        type = 'SERVER_ERROR';
        break;
      case 0:
        type = 'NETWORK_ERROR';
        break;
      default:
        type = 'UNKNOWN_ERROR';
    }

    const error = new Error(message);
    error.name = type;
    return error;
  }

  /**
   * Get domestic wood species
   */
  async getDomesticSpecies(): Promise<WoodSpecies[]> {
    const response = await this.fetchWithErrorHandling<GetSpeciesResponse>('/domestic');
    return response.data;
  }

  /**
   * Get exotic wood species
   */
  async getExoticSpecies(): Promise<WoodSpecies[]> {
    const response = await this.fetchWithErrorHandling<GetSpeciesResponse>('/exotic');
    return response.data;
  }

  /**
   * Get plywood species
   */
  async getPlywoodSpecies(): Promise<WoodSpecies[]> {
    const response = await this.fetchWithErrorHandling<GetSpeciesResponse>('/plywood');
    return response.data;
  }

  /**
   * Get species by wood type (generic method)
   */
  async getSpeciesByType(woodType: WoodType): Promise<WoodSpecies[]> {
    const response = await this.fetchWithErrorHandling<GetSpeciesResponse>(`/species/${woodType}`);
    return response.data;
  }

  /**
   * Search species across all types or within a specific type
   */
  async searchSpecies(searchTerm: string, woodType?: WoodType): Promise<WoodSpecies[]> {
    const params = new URLSearchParams({
      q: searchTerm,
    });

    if (woodType) {
      params.append('type', woodType);
    }

    const response = await this.fetchWithErrorHandling<GetSpeciesResponse>(
      `/search?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get available wood types with counts
   */
  async getWoodTypes(): Promise<{ type: WoodType; count: number }[]> {
    const response = await this.fetchWithErrorHandling<ApiResponse<{ type: WoodType; count: number }[]>>(
      '/wood-types'
    );
    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.fetchWithErrorHandling('/health');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get API information
   */
  async getApiInfo(): Promise<any> {
    return this.fetchWithErrorHandling('/');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing purposes
export { ApiService };

// Helper functions for common API operations
export const speciesApi = {
  /**
   * Fetch species data based on wood type
   */
  async fetchSpecies(woodType: WoodType): Promise<WoodSpecies[]> {
    switch (woodType) {
      case 'domestic':
        return apiService.getDomesticSpecies();
      case 'exotic':
        return apiService.getExoticSpecies();
      case 'plywood':
        return apiService.getPlywoodSpecies();
      default:
        throw new Error(`Invalid wood type: ${woodType}`);
    }
  },

  /**
   * Search across all species
   */
  async search(searchTerm: string, woodType?: WoodType): Promise<WoodSpecies[]> {
    if (searchTerm.length < 2) {
      throw new Error('Search term must be at least 2 characters long');
    }
    return apiService.searchSpecies(searchTerm, woodType);
  },
};

// Error handling utilities
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    switch (error.name as ApiErrorType) {
      case 'NETWORK_ERROR':
        return 'Unable to connect to the server. Please check your internet connection.';
      case 'SERVER_ERROR':
        return 'Server is temporarily unavailable. Please try again later.';
      case 'NOT_FOUND':
        return 'Requested data not found.';
      case 'BAD_REQUEST':
        return 'Invalid request. Please check your input.';
      case 'RATE_LIMITED':
        return 'Too many requests. Please wait a moment before trying again.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  return 'An unexpected error occurred.';
};

// Retry logic for failed requests
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (400-499)
      if (error instanceof Error && error.name === 'BAD_REQUEST') {
        throw error;
      }

      // Don't retry on the last attempt
      if (i === maxRetries) {
        break;
      }

      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  throw lastError;
};