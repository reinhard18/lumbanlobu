import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const result = await query(
            'SELECT * FROM dana_desa ORDER BY year DESC, created_at DESC'
        );
        return NextResponse.json({ data: result.rows });
    } catch (error) {
        console.error('Error fetching dana_desa:', error);
        return NextResponse.json(
            { error: 'Gagal mengambil data dana desa' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        const user = verifyToken(token);

        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { year, image_url } = body;

        if (!year || !image_url) {
            return NextResponse.json({ error: 'Tahun dan gambar wajib diisi' }, { status: 400 });
        }

        const result = await query(
            'INSERT INTO dana_desa (year, image_url) VALUES ($1, $2) RETURNING *',
            [year, image_url]
        );

        // Revalidate public page
        revalidatePath('/dana-desa');

        return NextResponse.json(
            { message: 'Data dana desa berhasil ditambahkan', data: result.rows[0] },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding dana_desa:', error);
        return NextResponse.json(
            { error: 'Gagal menambahkan data dana desa' },
            { status: 500 }
        );
    }
}
