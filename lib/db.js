import { Pool } from 'pg';

let pool;

if (!pool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false // Set to true if your database requires SSL
  });
}

/**
 * Executes a query using the connection pool.
 * @param {string} text - SQL query text with $1, $2... placeholders
 * @param {Array} params - Array of parameters for the query
 * @returns {Promise<Object>} - The result of the query
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Returns the pool instance for transactions or advanced usage.
 */
export function getPool() {
  return pool;
}
