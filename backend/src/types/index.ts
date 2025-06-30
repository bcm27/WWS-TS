export interface WoodSpecies {
  species: string;        // Required
  size: string;          // Required (in quarters: 4/4, 6/4, etc)
  price: number;         // Required (stored as double, displayed with $ prefix)
  grade: string | undefined;        // Optional (display as blank cell when undefined)
  vendor: string;        // Required
}

export type WoodType = 'domestic' | 'exotic' | 'plywood';

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

// Database query result interface
export interface DatabaseWoodSpecies {
  id: number;
  species: string;
  size: string;
  price: number;
  grade: string | null;
  vendor: string;
  wood_type: WoodType;
  created_at: Date;
  updated_at: Date;
}

// Request/Response types
export interface GetSpeciesRequest {
  type: WoodType;
}

export interface GetSpeciesResponse extends ApiResponse<WoodSpecies[]> {
  count: number;
}

// Environment configuration
export interface EnvConfig {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_SSL: boolean;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}