import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
        }

        // Upload to Vercel Blob - Public access for complaints
        const blob = await put(`pengaduan/${Date.now()}-${file.name}`, file, {
            access: 'public',
        });

        return NextResponse.json({ secure_url: blob.url });
    } catch (error) {
        console.error('Public Vercel Blob Upload Error:', error);
        return NextResponse.json(
            { error: 'Gagal mengunggah file' },
            { status: 500 }
        );
    }
}
