import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';

export async function DELETE(request, { params }) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        const user = verifyToken(token);

        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resolvedParams = await Promise.resolve(params);
        const { id } = resolvedParams;

        if (!id) {
            return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 });
        }

        await query('DELETE FROM dana_desa WHERE id = $1', [id]);

        return NextResponse.json(
            { message: 'Data dana desa berhasil dihapus' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting dana_desa:', error);
        return NextResponse.json(
            { error: 'Gagal menghapus data dana desa' },
            { status: 500 }
        );
    }
}
