import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET /api/news - Fetch all news
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 20;
        const offset = parseInt(searchParams.get('offset')) || 0;

        const newsResult = await query(
            'SELECT * FROM news WHERE is_published = 1 ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        const countResult = await query('SELECT COUNT(*) as count FROM news WHERE is_published = 1');
        const total = parseInt(countResult.rows[0].count);

        return NextResponse.json({
            data: newsResult.rows,
            total,
            limit,
            offset,
        });
    } catch (error) {
        console.error('GET /api/news error:', error);
        return NextResponse.json(
            { error: 'Gagal mengambil data berita' },
            { status: 500 }
        );
    }
}

// POST /api/news - Create new news (protected)
export async function POST(request) {
    const auth = verifyAuth(request);
    if (!auth) {
        return NextResponse.json(
            { error: 'Tidak terautentikasi' },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { title, content, excerpt, image_url, author } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Judul dan konten wajib diisi' },
                { status: 400 }
            );
        }

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        // Make slug unique
        const checkRes = await query('SELECT id FROM news WHERE slug = $1', [slug]);
        const finalSlug = checkRes.rows.length > 0 ? `${slug}-${Date.now()}` : slug;

        const result = await query(
            `INSERT INTO news (title, slug, content, excerpt, image_url, author) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                title,
                finalSlug,
                content,
                excerpt || content.substring(0, 200).replace(/<[^>]*>/g, ''),
                image_url || '',
                author || 'Admin Desa'
            ]
        );

        return NextResponse.json({ data: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('POST /api/news error:', error);
        return NextResponse.json(
            { error: 'Gagal membuat berita baru' },
            { status: 500 }
        );
    }
}
