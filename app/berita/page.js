import NewsCard from '../components/NewsCard';
import { query } from '@/lib/db';
import { Newspaper } from 'lucide-react';

export const metadata = {
    title: 'Berita Desa - Desa Lumban Lobu',
    description: 'Kumpulan berita dan informasi terkini dari Desa Lumban Lobu',
};

async function getAllNews() {
    try {
        const res = await query(
            'SELECT * FROM news WHERE is_published = 1 ORDER BY created_at DESC'
        );
        return res.rows;
    } catch (error) {
        console.error('Error fetching all news:', error);
        return [];
    }
}

export default async function BeritaPage() {
    const news = await getAllNews();

    return (
        <div className="section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">
                        <Newspaper size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                        Berita
                    </span>
                    <h1 className="section-title">Semua Berita Desa</h1>
                    <p className="section-subtitle">
                        Kumpulan berita dan informasi terbaru dari Pemerintah Desa
                        Lumban Lobu
                    </p>
                </div>

                {news.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <p
                            style={{
                                fontSize: 'var(--font-size-lg)',
                                color: 'var(--color-text-muted)',
                            }}
                        >
                            Belum ada berita yang dipublikasikan.
                        </p>
                    </div>
                ) : (
                    <div className="news-grid">
                        {news.map((item) => (
                            <NewsCard key={item.id} news={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
