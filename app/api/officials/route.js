import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET /api/officials - Fetch all officials
export async function GET() {
    try {
        const result = await query(
            'SELECT * FROM village_officials ORDER BY order_index ASC, created_at DESC'
        );
        return NextResponse.json({ data: result.rows });
    } catch (error) {
        console.error('GET /api/officials error:', error);
        return NextResponse.json(
            { error: 'Gagal mengambil data perangkat desa' },
            { status: 500 }
        );
    }
}

// POST /api/officials - Add new official (protected, admin only)
export async function POST(request) {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
        return NextResponse.json(
            { error: 'Akses ditolak' },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();
        const { name, role, image_url } = body;

        if (!name || !role) {
            return NextResponse.json(
                { error: 'Nama dan jabatan wajib diisi' },
                { status: 400 }
            );
        }

        // Get max order_index to put new official at the end
        const maxResult = await query('SELECT MAX(order_index) as max_order FROM village_officials');
        const maxOrder = maxResult.rows[0].max_order;
        const nextOrderIndex = (maxOrder !== null ? maxOrder : -1) + 1;

        const insertResult = await query(
            'INSERT INTO village_officials (name, role, image_url, order_index) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, role, image_url || '', nextOrderIndex]
        );

        return NextResponse.json({ data: insertResult.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('POST /api/officials error:', error);
        return NextResponse.json(
            { error: 'Gagal menambahkan perangkat desa' },
            { status: 500 }
        );
    }
}
