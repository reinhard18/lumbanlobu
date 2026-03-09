import Link from 'next/link';
import {
    MapPin,
    Phone,
    Mail,
    Home,
    Newspaper,
    Settings,
    FileText,
    Users,
    MessageSquare,
} from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div>
                    <div className="footer-brand-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 28, height: 28 }}>
                            <img src="/images/Toba.svg" alt="Toba Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <span>Desa Lumban Lobu</span>
                    </div>
                    <p className="footer-brand-desc">
                        Website resmi Pemerintah Desa Lumban Lobu. Menyajikan informasi
                        terkini tentang kegiatan, pembangunan, dan layanan desa untuk
                        masyarakat.
                    </p>
                </div>

                <div>
                    <h4 className="footer-column-title">Navigasi</h4>
                    <Link href="/" className="footer-link">
                        <Home size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        Beranda
                    </Link>
                    <Link href="/berita" className="footer-link">
                        <Newspaper size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        Berita
                    </Link>
                    <Link href="/dana-desa" className="footer-link">
                        <FileText size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        Dana Desa
                    </Link>
                    <Link href="/pengaduan" className="footer-link">
                        <MessageSquare size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        Pengaduan
                    </Link>
                </div>

                <div>
                    <h4 className="footer-column-title">Layanan</h4>
                    <span className="footer-link">
                        <Users size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        Data Penduduk
                    </span>
                </div>

                <div>
                    <h4 className="footer-column-title">Kontak</h4>
                    <span className="footer-link">
                        <MapPin size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        Jl. Lintas Sumatera Pasar Lumban Lobu
                    </span>
                    <span className="footer-link">Kec. Bonatua Lunasi, Kab. Toba</span>
                    <span className="footer-link">
                        <Phone size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        (021) 123-4567
                    </span>
                    <span className="footer-link">
                        <Mail size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                        desa@lumbanlobu.id
                    </span>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    © {new Date().getFullYear()} Pemerintah Desa Lumban Lobu. Hak cipta
                    dilindungi undang-undang.
                </p>
            </div>
        </footer>
    );
}
