const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function setup() {
    const client = await pool.connect();
    try {
        console.log('Creating dana_desa table...');

        await client.query(`
            CREATE TABLE IF NOT EXISTS dana_desa (
                id SERIAL PRIMARY KEY,
                year TEXT NOT NULL,
                image_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('dana_desa table created or exists.');

    } catch (err) {
        console.error('Error during setup:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

setup();
