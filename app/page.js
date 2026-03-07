import Link from 'next/link';
import NewsCard from './components/NewsCard';
import { query } from '@/lib/db';
import {
  Newspaper,
  Info,
  Users,
  MapPin,
  Landmark,
  Wheat,
  BookOpen,
  HeartPulse,
  ChevronRight,
  Activity,
  UserCheck,
} from 'lucide-react';

async function getLatestNews() {
  try {
    const res = await query(
      'SELECT * FROM news WHERE is_published = 1 ORDER BY created_at DESC LIMIT 6'
    );
    return res.rows;
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }
}

async function getSettings() {
  try {
    const res = await query('SELECT key, value FROM settings');
    const settings = {};
    for (const row of res.rows) {
      settings[row.key] = row.value;
    }
    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
}

async function getOfficials() {
  try {
    const res = await query('SELECT * FROM village_officials ORDER BY order_index ASC, created_at DESC');
    return res.rows;
  } catch (error) {
    console.error('Error fetching officials:', error);
    return [];
  }
}

export default async function HomePage() {
  const [news, settings, officials] = await Promise.all([
    getLatestNews(),
    getSettings(),
    getOfficials()
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div 
          className="hero-bg"
          style={settings.hero_background_image ? {
            backgroundImage: `url(${settings.hero_background_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : {}}
        >
          <div className="hero-bg-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Website Resmi Pemerintah Desa
          </div>

          <h1 className="hero-title">
            Selamat Datang di{' '}
            <span className="hero-title-accent">Desa Lumban Lobu</span>
          </h1>

          <p className="hero-description">
            Membangun desa yang maju, mandiri, dan sejahtera melalui
            transparansi informasi dan pelayanan publik yang prima untuk
            seluruh masyarakat.
          </p>

          <div className="hero-actions">
            <Link href="/berita" className="btn btn-primary btn-lg">
              <Newspaper size={18} />
              Baca Berita
            </Link>
            <a href="#tentang" className="btn btn-outline btn-lg">
              <Info size={18} />
              Tentang Desa
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-number">
                <Users size={22} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                {settings.jumlah_penduduk || '0'}
              </div>
              <div className="hero-stat-label">Jumlah Penduduk</div>
            </div>
            <div>
              <div className="hero-stat-number">
                <Landmark size={22} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                {settings.kepala_keluarga || '0'}
              </div>
              <div className="hero-stat-label">Kepala Keluarga</div>
            </div>
            <div>
              <div className="hero-stat-number">
                <MapPin size={22} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                {settings.jumlah_dusun || '0'}
              </div>
              <div className="hero-stat-label">Dusun</div>
            </div>
            <div>
              <div className="hero-stat-number">
                <Activity size={22} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                {settings.luas_wilayah || '0'}
              </div>
              <div className="hero-stat-label">Luas Wilayah</div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="section" id="berita">
        <div className="container">
          <div className="section-header">
            <span className="section-label">
              <Newspaper size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              Berita Terkini
            </span>
            <h2 className="section-title">Kabar Desa Terbaru</h2>
            <p className="section-subtitle">
              Informasi terkini tentang kegiatan, pembangunan, dan berbagai
              program desa untuk masyarakat
            </p>
          </div>

          <div className="news-grid">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>

          {news.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link href="/berita" className="btn btn-outline-dark">
                Lihat Semua Berita
                <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Officials Section */}
      {officials.length > 0 && (
        <section className="section" id="perangkat" style={{ background: 'var(--color-bg)', overflow: 'hidden' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-label">
                <UserCheck size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                Perangkat Desa
              </span>
              <h2 className="section-title">Kenali Pemimpin Kami</h2>
              <p className="section-subtitle">
                Dedikasi dan pelayanan perangkat Desa Sejahtera untuk kemajuan bersama
              </p>
            </div>

            <div className="carousel-container">
              <div className="carousel-track">
                {officials.map((off) => (
                  <div key={off.id} className="official-card">
                    <div className="official-image-wrapper">
                      {off.image_url ? (
                        <img src={off.image_url} alt={off.name} className="official-image" />
                      ) : (
                        <div className="official-image-placeholder">
                          <Users size={48} strokeWidth={1.2} />
                        </div>
                      )}
                    </div>
                    <div className="official-info">
                      <h3 className="official-name">{off.name}</h3>
                      <p className="official-role">{off.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section
        className="section"
        id="tentang"
        style={{ background: 'var(--color-bg-alt)' }}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-label">
              <Info size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              Tentang Desa
            </span>
            <h2 className="section-title">Profil Desa Sejahtera</h2>
            <p className="section-subtitle">
              Desa Sejahtera terletak di Kecamatan Makmur, Kabupaten Sentosa.
              Berdiri sejak tahun 1945, desa ini terus berkembang menuju
              kemajuan.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--space-xl)',
            }}
          >
            {[
              {
                icon: <Landmark size={36} strokeWidth={1.5} />,
                title: 'Pemerintahan',
                desc: 'Pemerintah desa yang transparan dan akuntabel dalam melayani masyarakat',
              },
              {
                icon: <Wheat size={36} strokeWidth={1.5} />,
                title: 'Pertanian',
                desc: 'Sektor pertanian sebagai tulang punggung perekonomian desa',
              },
              {
                icon: <BookOpen size={36} strokeWidth={1.5} />,
                title: 'Pendidikan',
                desc: 'Fasilitas pendidikan yang memadai dari PAUD hingga SMP',
              },
              {
                icon: <HeartPulse size={36} strokeWidth={1.5} />,
                title: 'Kesehatan',
                desc: 'Puskesmas pembantu dan Posyandu aktif untuk kesehatan warga',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--color-bg)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-xl)',
                  border: '1px solid var(--color-border-light)',
                  transition: 'all 0.25s ease',
                  cursor: 'default',
                }}
              >
                <div
                  style={{
                    marginBottom: 'var(--space-md)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 700,
                    marginBottom: 'var(--space-sm)',
                    color: 'var(--color-text)',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
