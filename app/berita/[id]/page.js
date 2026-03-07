import Link from 'next/link';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User, Image } from 'lucide-react';

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

async function getNewsDetail(slug) {
    try {
        const res = await query('SELECT * FROM news WHERE slug = $1', [slug]);
        return res.rows[0];
    } catch (error) {
        console.error('Error fetching news detail:', error);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const news = await getNewsDetail(id);
    if (!news) return { title: 'Berita Tidak Ditemukan' };
    return {
        title: `${news.title} - Desa Lumban Lobu`,
        description: news.excerpt,
    };
}

export default async function BeritaDetailPage({ params }) {
    const { id } = await params;
    const news = await getNewsDetail(id);

    if (!news) {
        notFound();
    }

    return (
        <article className="news-detail">
            <Link href="/berita" className="news-detail-back">
                <ArrowLeft size={16} />
                Kembali ke Berita
            </Link>

            <div className="news-detail-meta">
                <span className="news-detail-date">
                    <Calendar size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                    {formatDate(news.created_at)}
                </span>
                <span style={{ color: 'var(--color-border)' }}>•</span>
                <span className="news-detail-author">
                    <User size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                    {news.author}
                </span>
            </div>

            <h1 className="news-detail-title">{news.title}</h1>

            <div className="news-detail-image">
                {news.image_url ? (
                    <img src={news.image_url} alt={news.title} className="news-detail-img" />
                ) : (
                    <div className="news-detail-image-placeholder">
                        <Image size={64} strokeWidth={1.5} />
                    </div>
                )}
            </div>

            <div
                className="news-detail-content"
                dangerouslySetInnerHTML={{ __html: news.content }}
            />
        </article>
    );
}
