import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { verifyAuth } from '@/lib/auth';

export async function POST(request) {
    const auth = verifyAuth(request);
    if (!auth) {
        return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            console.log('Upload target: No file found');
            return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
        }

        console.log('Uploading file to Vercel Blob:', {
            name: file.name,
            type: file.type,
            size: file.size,
        });

        // Upload to Vercel Blob with explicit token
        const blob = await put(file.name, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
            addRandomSuffix: true,
        });

        console.log('Vercel Blob Upload Success:', blob.url);
        return NextResponse.json({ secure_url: blob.url });
    } catch (error) {
        console.error('Vercel Blob Upload Error Details:', {
            message: error.message,
            stack: error.stack,
        });

        // Return a more descriptive error if it's a known blob error
        const errorMessage = error.message?.includes('token')
            ? 'Konfigurasi storage tidak valid (Token Error)'
            : 'Gagal mengunggah file ke Vercel Blob';

        return NextResponse.json(
            { error: errorMessage, details: error.message },
            { status: 500 }
        );
    }
}
