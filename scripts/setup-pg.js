const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function setup() {
    const client = await pool.connect();
    try {
        console.log('Starting PostgreSQL setup...');

        // Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'editor' CHECK(role IN ('admin', 'editor')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Users table created or exists.');

        // News Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS news (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                content TEXT NOT NULL,
                excerpt TEXT,
                image_url TEXT,
                author TEXT DEFAULT 'Admin Desa',
                is_published INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('News table created or exists.');

        // Settings Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Settings table created or exists.');

        // Village Officials Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS village_officials (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                image_url TEXT,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Village officials table created or exists.');

        // Seed settings
        const seedSettings = [
            ['jumlah_penduduk', '5.234'],
            ['kepala_keluarga', '1.280'],
            ['jumlah_dusun', '4'],
            ['luas_wilayah', '850 Ha'],
        ];

        for (const [key, value] of seedSettings) {
            await client.query(
                'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
                [key, value]
            );
        }
        console.log('Default settings seeded.');

        console.log('PostgreSQL setup completed successfully!');
    } catch (err) {
        console.error('Error during setup:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

setup();
