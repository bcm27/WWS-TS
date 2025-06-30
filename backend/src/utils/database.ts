import { Pool, PoolConfig } from 'pg';
import { EnvConfig } from '../types';

let pool: Pool;

export const initializeDatabase = async (config: EnvConfig): Promise<Pool> => {
  const poolConfig: PoolConfig = {
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    ssl: config.DB_SSL ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Increased timeout
  };

  console.log('Creating PostgreSQL connection pool...');
  pool = new Pool(poolConfig);

  // Handle pool errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  // Retry logic for database connection
  const maxRetries = 10;
  const retryDelay = 2000; // 2 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Database connection attempt ${attempt}/${maxRetries}...`);
      
      const result = await pool.query('SELECT NOW(), version()');
      const serverTime = result.rows[0]?.now;
      const version = result.rows[0]?.version;
      
      console.log('Database connected successfully!');
      console.log(`   Server Time: ${serverTime}`);
      console.log(`   PostgreSQL Version: ${version}`);
      
      // Test that our tables exist
      const tableCheck = await pool.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_name = 'wood_species'
      `);
      
      const tableExists = parseInt(tableCheck.rows[0]?.count) > 0;
      if (!tableExists) {
        console.warn('Warning: wood_species table not found. Database may not be initialized.');
      } else {
        const speciesCount = await pool.query('SELECT COUNT(*) as count FROM wood_species');
        console.log(`Found ${speciesCount.rows[0]?.count} wood species in database`);
      }
      
      return pool;
    } catch (err) {
      console.error(`Database connection attempt ${attempt} failed:`, err instanceof Error ? err.message : err);
      
      if (attempt === maxRetries) {
        console.error('All database connection attempts failed!');
        throw new Error(`Failed to connect to database after ${maxRetries} attempts: ${err}`);
      }
      
      console.log(`Waiting ${retryDelay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  throw new Error('Should not reach here');
};

export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return pool;
};

export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    console.log('🔌 Database connection closed.');
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Graceful shutdown...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Graceful shutdown...');
  await closeDatabase();
  process.exit(0);
});