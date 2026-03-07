import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// PATCH /api/pengaduan/[id] - Update status (Admin only)
export async function PATCH(request, props) {
    const params = await props.params;
    const { id } = params;
    const user = verifyAuth(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { status } = body;

        if (!status || !['Menunggu', 'Diproses', 'Selesai'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const res = await query(
            'UPDATE pengaduan SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (res.rowCount === 0) {
            return NextResponse.json({ error: 'Pengaduan not found' }, { status: 404 });
        }

        return NextResponse.json(res.rows[0]);
    } catch (error) {
        console.error('Error updating pengaduan status:', error);
        return NextResponse.json(
            { error: 'Failed to update pengaduan status' },
            { status: 500 }
        );
    }
}
