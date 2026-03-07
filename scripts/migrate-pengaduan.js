const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function setup() {
    const client = await pool.connect();
    try {
        console.log('Adding pengaduan table...');

        await client.query(`
            CREATE TABLE IF NOT EXISTS pengaduan (
                id SERIAL PRIMARY KEY,
                deskripsi TEXT NOT NULL,
                nama_pengadu TEXT DEFAULT 'Anonymous',
                kategori TEXT NOT NULL CHECK (kategori IN ('Infrastruktur', 'bansos', 'keamanan')),
                foto_url TEXT,
                lokasi TEXT,
                status TEXT DEFAULT 'Menunggu' CHECK (status IN ('Menunggu', 'Diproses', 'Selesai')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Pengaduan table created or exists.');

        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Error during migration:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

setup();
