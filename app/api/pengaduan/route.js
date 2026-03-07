import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

// POST /api/pengaduan - Public submission
export async function POST(request) {
    try {
        const body = await request.json();
        const { deskripsi, nama_pengadu, kategori, foto_url, lokasi } = body;

        if (!deskripsi || !kategori) {
            return NextResponse.json(
                { error: 'Deskripsi and Kategori are required' },
                { status: 400 }
            );
        }

        const res = await query(
            'INSERT INTO pengaduan (deskripsi, nama_pengadu, kategori, foto_url, lokasi) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [deskripsi, nama_pengadu || 'Anonymous', kategori, foto_url || null, lokasi || null]
        );

        const newPengaduan = res.rows[0];

        // Send WhatsApp Notification to Admin
        const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
        if (adminNumber) {
            const message = `🚨 *Pengaduan Baru!* 🚨\n\n` +
                `*Nama:* ${newPengaduan.nama_pengadu}\n` +
                `*Kategori:* ${newPengaduan.kategori}\n` +
                `*Deskripsi:* ${newPengaduan.deskripsi}\n` +
                `*Lokasi:* ${newPengaduan.lokasi || 'Tidak disertakan'}\n\n` +
                `Silakan cek dashboard admin untuk detail selengkapnya.`;

            await sendWhatsAppMessage(adminNumber, message);
        }

        return NextResponse.json(newPengaduan, { status: 201 });
    } catch (error) {
        console.error('Error submitting pengaduan:', error);
        return NextResponse.json(
            { error: 'Failed to submit pengaduan' },
            { status: 500 }
        );
    }
}

// GET /api/pengaduan - Admin listing
export async function GET(request) {
    const user = verifyAuth(request);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const res = await query('SELECT * FROM pengaduan ORDER BY created_at DESC');
        return NextResponse.json(res.rows);
    } catch (error) {
        console.error('Error fetching pengaduan:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pengaduan' },
            { status: 500 }
        );
    }
}
