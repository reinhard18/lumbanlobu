import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// PUT /api/officials/[id] - Update official (protected, admin only)
export async function PUT(request, { params }) {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
        return NextResponse.json(
            { error: 'Akses ditolak' },
            { status: 403 }
        );
    }

    const { id } = await params;

    try {
        const body = await request.json();
        const { name, role, image_url, order_index } = body;

        if (!name || !role) {
            return NextResponse.json(
                { error: 'Nama dan jabatan wajib diisi' },
                { status: 400 }
            );
        }

        const result = await query(
            'UPDATE village_officials SET name = $1, role = $2, image_url = $3, order_index = $4 WHERE id = $5 RETURNING *',
            [name, role, image_url || '', order_index || 0, id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: 'Perangkat desa tidak ditemukan' },
                { status: 404 }
            );
        }

        // Revalidate public pages
        revalidatePath('/');

        return NextResponse.json({ data: result.rows[0] });
    } catch (error) {
        console.error('PUT /api/officials/[id] error:', error);
        return NextResponse.json(
            { error: 'Gagal memperbarui perangkat desa' },
            { status: 500 }
        );
    }
}

// DELETE /api/officials/[id] - Delete official (protected, admin only)
export async function DELETE(request, { params }) {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
        return NextResponse.json(
            { error: 'Akses ditolak' },
            { status: 403 }
        );
    }

    const { id } = await params;

    try {
        const result = await query('DELETE FROM village_officials WHERE id = $1 RETURNING id', [id]);

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: 'Perangkat desa tidak ditemukan' },
                { status: 404 }
            );
        }

        // Revalidate public pages
        revalidatePath('/');

        return NextResponse.json({ message: 'Perangkat desa berhasil dihapus' });
    } catch (error) {
        console.error('DELETE /api/officials/[id] error:', error);
        return NextResponse.json(
            { error: 'Gagal menghapus perangkat desa' },
            { status: 500 }
        );
    }
}
