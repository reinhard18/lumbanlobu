const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function createUser(name, email, password, role = 'admin') {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const res = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role]
        );

        console.log('User created successfully:');
        console.table(res.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            console.error('Error: Email already exists.');
        } else {
            console.error('Error creating user:', error);
        }
    } finally {
        await pool.end();
    }
}

// Get arguments from command line
const [, , name, email, password, role] = process.argv;

if (!name || !email || !password) {
    console.log('Usage: node scripts/add-user.js "<name>" <email> <password> [role]');
    console.log('Example: node scripts/add-user.js "Admin Desa" admin@desa.go.id admin123 admin');
    process.exit(1);
}

createUser(name, email, password, role || 'admin');
