import { Pool } from 'pg';
import { WoodSpecies, WoodType, DatabaseWoodSpecies } from '../types';
import { getPool } from '../utils/database';

export class SpeciesService {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  /**
   * Get all wood species by type
   */
  async getSpeciesByType(woodType: WoodType): Promise<WoodSpecies[]> {
    const query = `
      SELECT 
        species,
        size,
        price,
        grade,
        vendor
      FROM wood_species 
      WHERE wood_type = $1 
      ORDER BY species ASC, size ASC, grade ASC NULLS LAST
    `;

    try {
      const result = await this.pool.query<DatabaseWoodSpecies>(query, [woodType]);
      
      // Transform database result to API format
      return result.rows.map(this.transformDatabaseSpecies);
    } catch (error) {
      console.error(`Error fetching ${woodType} species:`, error);
      throw new Error(`Failed to fetch ${woodType} wood species`);
    }
  }

  /**
   * Get species count by type
   */
  async getSpeciesCountByType(woodType: WoodType): Promise<number> {
    const query = 'SELECT COUNT(*) FROM wood_species WHERE wood_type = $1';
    
    try {
      const result = await this.pool.query(query, [woodType]);
      return parseInt(result.rows[0]?.count || '0', 10);
    } catch (error) {
      console.error(`Error counting ${woodType} species:`, error);
      throw new Error(`Failed to count ${woodType} wood species`);
    }
  }

  /**
   * Check if wood type exists and has species
   */
  async validateWoodType(woodType: string): Promise<boolean> {
    const validTypes: WoodType[] = ['domestic', 'exotic', 'plywood'];
    return validTypes.includes(woodType as WoodType);
  }

  /**
   * Get all available wood types with counts
   */
  async getAvailableWoodTypes(): Promise<{ type: WoodType; count: number }[]> {
    const query = `
      SELECT 
        wood_type as type, 
        COUNT(*) as count 
      FROM wood_species 
      GROUP BY wood_type 
      ORDER BY wood_type
    `;

    try {
      const result = await this.pool.query(query);
      return result.rows.map(row => ({
        type: row.type as WoodType,
        count: parseInt(row.count, 10)
      }));
    } catch (error) {
      console.error('Error fetching wood types:', error);
      throw new Error('Failed to fetch available wood types');
    }
  }

  /**
   * Search species across all types
   */
  async searchSpecies(searchTerm: string, woodType?: WoodType): Promise<WoodSpecies[]> {
    let query = `
      SELECT 
        species,
        size,
        price,
        grade,
        vendor
      FROM wood_species 
      WHERE (
        LOWER(species) LIKE LOWER($1) OR 
        LOWER(vendor) LIKE LOWER($1) OR 
        LOWER(grade) LIKE LOWER($1)
      )
    `;
    
    const params: (string | WoodType)[] = [`%${searchTerm}%`];
    
    if (woodType) {
      query += ' AND wood_type = $2';
      params.push(woodType);
    }
    
    query += ' ORDER BY species ASC, size ASC, grade ASC NULLS LAST';

    try {
      const result = await this.pool.query<DatabaseWoodSpecies>(query, params);
      return result.rows.map(this.transformDatabaseSpecies);
    } catch (error) {
      console.error('Error searching species:', error);
      throw new Error('Failed to search wood species');
    }
  }

  /**
   * Transform database row to API format
   */
  private transformDatabaseSpecies(dbSpecies: DatabaseWoodSpecies): WoodSpecies {
    return {
      species: dbSpecies.species,
      size: dbSpecies.size,
      price: Number(dbSpecies.price),
      grade: dbSpecies.grade || undefined,
      vendor: dbSpecies.vendor,
    };
  }

  /**
   * Health check - verify database connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}