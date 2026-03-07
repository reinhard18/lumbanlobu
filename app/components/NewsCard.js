import Link from 'next/link';
import { Calendar, User, ArrowRight, Image } from 'lucide-react';

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function NewsCard({ news }) {
    return (
        <Link href={`/berita/${news.slug}`} style={{ textDecoration: 'none' }}>
            <article className="news-card">
                <div className="news-card-image">
                    {news.image_url ? (
                        <img src={news.image_url} alt={news.title} className="news-card-img" />
                    ) : (
                        <div className="news-card-image-placeholder">
                            <Image size={48} strokeWidth={1.5} />
                        </div>
                    )}
                </div>

                <div className="news-card-body">
                    <span className="news-card-date">
                        <Calendar size={13} />
                        {formatDate(news.created_at)}
                    </span>

                    <h3 className="news-card-title">{news.title}</h3>

                    <p className="news-card-excerpt">{news.excerpt}</p>

                    <div className="news-card-footer">
                        <span className="news-card-author">
                            <User size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                            {news.author}
                        </span>
                        <span className="news-card-link">
                            Baca selengkapnya
                            <ArrowRight size={14} />
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
