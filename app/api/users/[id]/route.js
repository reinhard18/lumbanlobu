import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// DELETE /api/users/:id - Delete user (admin only, cannot delete self)
export async function DELETE(request, { params }) {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
        return NextResponse.json(
            { error: 'Akses ditolak' },
            { status: 403 }
        );
    }

    try {
        const { id } = await params;
        const userId = parseInt(id);

        if (userId === auth.id) {
            return NextResponse.json(
                { error: 'Tidak dapat menghapus akun sendiri' },
                { status: 400 }
            );
        }

        const deleteRes = await query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);

        if (deleteRes.rowCount === 0) {
            return NextResponse.json(
                { error: 'Pengguna tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Pengguna berhasil dihapus' });
    } catch (error) {
        console.error('DELETE /api/users/[id] error:', error);
        return NextResponse.json(
            { error: 'Gagal menghapus pengguna' },
            { status: 500 }
        );
    }
}
