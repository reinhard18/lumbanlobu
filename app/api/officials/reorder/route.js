import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// PUT /api/officials/reorder - Bulk reorder officials (protected, admin only)
export async function PUT(request) {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
        return NextResponse.json(
            { error: 'Akses ditolak' },
            { status: 403 }
        );
    }

    try {
        const body = await request.json(); // Array of official IDs in new order

        if (!Array.isArray(body)) {
            return NextResponse.json(
                { error: 'Format data tidak valid' },
                { status: 400 }
            );
        }

        // Simple loop of updates (PostgreSQL handles this efficiently)
        for (let i = 0; i < body.length; i++) {
            await query('UPDATE village_officials SET order_index = $1 WHERE id = $2', [i, body[i]]);
        }

        return NextResponse.json({ message: 'Urutan berhasil diperbarui' });
    } catch (error) {
        console.error('PUT /api/officials/reorder error:', error);
        return NextResponse.json(
            { error: 'Gagal memperbarui urutan' },
            { status: 500 }
        );
    }
}
