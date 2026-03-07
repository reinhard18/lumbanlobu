import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, hashPassword } from '@/lib/auth';

// GET /api/users - List all users (admin only)
export async function GET(request) {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
        return NextResponse.json(
            { error: 'Akses ditolak' },
            { status: 403 }
        );
    }

    try {
        const result = await query(
            'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
        );

        return NextResponse.json({ data: result.rows });
    } catch (error) {
        console.error('GET /api/users error:', error);
        return NextResponse.json(
            { error: 'Gagal mengambil data pengguna' },
            { status: 500 }
        );
    }
}

// POST /api/users - Create new user (admin only)
export async function POST(request) {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
        return NextResponse.json(
            { error: 'Akses ditolak' },
            { status: 403 }
        );
    }

    try {
        const { name, email, password, role } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Nama, email, dan password wajib diisi' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const checkRes = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (checkRes.rows.length > 0) {
            return NextResponse.json(
                { error: 'Email sudah terdaftar' },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);
        const userRole = role === 'admin' ? 'admin' : 'editor';

        const insertRes = await query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
            [name, email, hashedPassword, userRole]
        );

        return NextResponse.json({ data: insertRes.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('POST /api/users error:', error);
        return NextResponse.json(
            { error: 'Gagal membuat pengguna baru' },
            { status: 500 }
        );
    }
}
