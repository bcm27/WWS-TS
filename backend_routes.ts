import { Router } from 'express';
import { SpeciesController } from '../controllers/speciesController';
import { validateWoodType } from '../middleware';

const router = Router();
const speciesController = new SpeciesController();

/**
 * Health check endpoint
 */
router.get('/health', speciesController.healthCheck);

/**
 * Get available wood types
 */
router.get('/wood-types', speciesController.getWoodTypes);

/**
 * Search species across all types or within a specific type
 * Query parameters:
 *   - q: search term (required, min 2 characters)
 *   - type: wood type to filter by (optional)
 */
router.get('/search', speciesController.searchSpecies);

/**
 * Specific wood type endpoints (as per requirements)
 */
router.get('/domestic', speciesController.getDomesticSpecies);
router.get('/exotic', speciesController.getExoticSpecies);
router.get('/plywood', speciesController.getPlywoodSpecies);

/**
 * Generic wood type endpoint
 */
router.get('/species/:type', validateWoodType, speciesController.getSpeciesByType);

/**
 * API information endpoint
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Hardwood Species Selector API',
      version: '1.0.0',
      endpoints: {
        health: 'GET /api/health',
        woodTypes: 'GET /api/wood-types',
        search: 'GET /api/search?q=term&type=optional',
        domestic: 'GET /api/domestic',
        exotic: 'GET /api/exotic',
        plywood: 'GET /api/plywood',
        byType: 'GET /api/species/:type',
      },
      documentation: 'See README.md for detailed API documentation',
    },
    message: 'Hardwood Species Selector API is running',
  });
});

export default router;