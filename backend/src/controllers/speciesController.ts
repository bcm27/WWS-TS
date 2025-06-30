import { Request, Response, NextFunction } from 'express';
import { SpeciesService } from '../services/speciesService';
import { WoodType, GetSpeciesResponse } from '../types';

export class SpeciesController {
  private speciesService: SpeciesService;

  constructor() {
    this.speciesService = new SpeciesService();
  }

  /**
   * Get domestic wood species
   */
  getDomesticSpecies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const species = await this.speciesService.getSpeciesByType('domestic');
      const count = species.length;

      const response: GetSpeciesResponse = {
        success: true,
        data: species,
        count,
        message: count > 0 ? `Found ${count} domestic wood species` : 'No domestic wood species found',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get exotic wood species
   */
  getExoticSpecies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const species = await this.speciesService.getSpeciesByType('exotic');
      const count = species.length;

      const response: GetSpeciesResponse = {
        success: true,
        data: species,
        count,
        message: count > 0 ? `Found ${count} exotic wood species` : 'No exotic wood species found',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get plywood species
   */
  getPlywoodSpecies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const species = await this.speciesService.getSpeciesByType('plywood');
      const count = species.length;

      const response: GetSpeciesResponse = {
        success: true,
        data: species,
        count,
        message: count > 0 ? `Found ${count} plywood species` : 'No plywood species found',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get species by wood type (generic endpoint)
   */
getSpeciesByType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const woodType = req.params.type as WoodType;
    
    if (!await this.speciesService.validateWoodType(woodType)) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid wood type. Must be one of: domestic, exotic, plywood',
        statusCode: 400,
      });
      return; // Add explicit return
    }

    const species = await this.speciesService.getSpeciesByType(woodType);
    const count = species.length;

    const response: GetSpeciesResponse = {
      success: true,
      data: species,
      count,
      message: count > 0 ? `Found ${count} ${woodType} wood species` : `No ${woodType} wood species found`,
    };

    res.json(response);
    return; // Add explicit return
  } catch (error) {
    next(error);
    return; // Add explicit return
  }
};

  /**
   * Search species
   */
  searchSpecies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q: searchTerm, type: woodType } = req.query;

    if (!searchTerm || typeof searchTerm !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Search term (q) is required',
        statusCode: 400,
      });
      return; // Add explicit return
    }

    if (searchTerm.length < 2) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Search term must be at least 2 characters long',
        statusCode: 400,
      });
      return; // Add explicit return
    }

    // Validate wood type if provided
    if (woodType && !await this.speciesService.validateWoodType(woodType as string)) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid wood type. Must be one of: domestic, exotic, plywood',
        statusCode: 400,
      });
      return; // Add explicit return
    }

    const species = await this.speciesService.searchSpecies(
      searchTerm,
      woodType as WoodType | undefined
    );
    const count = species.length;

    const response: GetSpeciesResponse = {
      success: true,
      data: species,
      count,
      message: count > 0 
        ? `Found ${count} species matching "${searchTerm}"` 
        : `No species found matching "${searchTerm}"`,
    };

    res.json(response);
    return; // Add explicit return
  } catch (error) {
    next(error);
    return; // Add explicit return
  }
};

  /**
   * Get available wood types with counts
   */
  getWoodTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const woodTypes = await this.speciesService.getAvailableWoodTypes();

      res.json({
        success: true,
        data: woodTypes,
        message: `Found ${woodTypes.length} wood types`,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Health check endpoint
   */
  healthCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isHealthy = await this.speciesService.healthCheck();
    
    if (!isHealthy) {
      res.status(503).json({
        success: false,
        error: 'Service Unavailable',
        message: 'Database connection failed',
        statusCode: 503,
      });
      return; // Add explicit return
    }

    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      message: 'Service is healthy',
    });
    return; // Add explicit return
  } catch (error) {
    next(error);
    return; // Add explicit return
  }
};
}