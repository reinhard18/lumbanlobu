import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
    const user = verifyAuth(request);

    if (!user) {
        return NextResponse.json(
            { error: 'Tidak terautentikasi' },
            { status: 401 }
        );
    }

    return NextResponse.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
}
