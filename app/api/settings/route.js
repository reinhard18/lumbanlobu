import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// GET /api/settings - Fetch all settings (public)
export async function GET() {
    try {
        const result = await query('SELECT key, value FROM settings');
        const settings = {};
        for (const row of result.rows) {
            settings[row.key] = row.value;
        }
        return NextResponse.json({ data: settings });
    } catch (error) {
        console.error('GET /api/settings error:', error);
        return NextResponse.json(
            { error: 'Gagal mengambil pengaturan' },
            { status: 500 }
        );
    }
}

// PUT /api/settings - Update settings (protected, admin only)
export async function PUT(request) {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
        return NextResponse.json(
            { error: 'Akses ditolak' },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();
        const allowedKeys = ['jumlah_penduduk', 'kepala_keluarga', 'jumlah_dusun', 'luas_wilayah', 'hero_background_image'];

        for (const [key, value] of Object.entries(body)) {
            if (allowedKeys.includes(key)) {
                await query(
                    `INSERT INTO settings (key, value, updated_at) 
                     VALUES ($1, $2, CURRENT_TIMESTAMP)
                     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
                    [key, String(value)]
                );
            }
        }

        // Revalidate public pages
        revalidatePath('/');

        // Return updated settings
        const result = await query('SELECT key, value FROM settings');
        const settings = {};
        for (const row of result.rows) {
            settings[row.key] = row.value;
        }

        return NextResponse.json({ data: settings });
    } catch (error) {
        console.error('PUT /api/settings error:', error);
        return NextResponse.json(
            { error: 'Gagal memperbarui pengaturan' },
            { status: 500 }
        );
    }
}
