import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET /api/news/:id - Fetch single news
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        let res;
        if (isNaN(id)) {
            res = await query('SELECT * FROM news WHERE slug = $1', [id]);
        } else {
            res = await query('SELECT * FROM news WHERE id = $1', [parseInt(id)]);
        }

        if (res.rows.length === 0) {
            return NextResponse.json(
                { error: 'Berita tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json({ data: res.rows[0] });
    } catch (error) {
        console.error('GET /api/news/[id] error:', error);
        return NextResponse.json(
            { error: 'Gagal mengambil data berita' },
            { status: 500 }
        );
    }
}

// PUT /api/news/:id - Update news (protected)
export async function PUT(request, { params }) {
    const auth = verifyAuth(request);
    if (!auth) {
        return NextResponse.json(
            { error: 'Tidak terautentikasi' },
            { status: 401 }
        );
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { title, content, excerpt, image_url, author, is_published } = body;

        const checkRes = await query('SELECT * FROM news WHERE id = $1', [parseInt(id)]);
        if (checkRes.rows.length === 0) {
            return NextResponse.json(
                { error: 'Berita tidak ditemukan' },
                { status: 404 }
            );
        }

        const newsId = parseInt(id);
        const updateRes = await query(
            `UPDATE news SET 
                title = COALESCE($1, title),
                content = COALESCE($2, content),
                excerpt = COALESCE($3, excerpt),
                image_url = COALESCE($4, image_url),
                author = COALESCE($5, author),
                is_published = COALESCE($6, is_published),
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 RETURNING *`,
            [
                title || null,
                content || null,
                excerpt || null,
                image_url || null,
                author || null,
                is_published !== undefined ? is_published : null,
                newsId
            ]
        );

        return NextResponse.json({ data: updateRes.rows[0] });
    } catch (error) {
        console.error('PUT /api/news/[id] error:', error);
        return NextResponse.json(
            { error: 'Gagal memperbarui berita' },
            { status: 500 }
        );
    }
}

// DELETE /api/news/:id - Delete news (protected)
export async function DELETE(request, { params }) {
    const auth = verifyAuth(request);
    if (!auth) {
        return NextResponse.json(
            { error: 'Tidak terautentikasi' },
            { status: 401 }
        );
    }

    try {
        const { id } = await params;
        const newsId = parseInt(id);

        const deleteRes = await query('DELETE FROM news WHERE id = $1 RETURNING id', [newsId]);

        if (deleteRes.rowCount === 0) {
            return NextResponse.json(
                { error: 'Berita tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Berita berhasil dihapus' });
    } catch (error) {
        console.error('DELETE /api/news/[id] error:', error);
        return NextResponse.json(
            { error: 'Gagal menghapus berita' },
            { status: 500 }
        );
    }
}
