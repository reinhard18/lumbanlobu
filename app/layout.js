import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';

export const metadata = {
  title: 'Desa Lumban Lobu - Website Resmi Pemerintah Desa',
  description:
    'Website resmi Pemerintah Desa Lumban Lobu. Menyajikan informasi terkini tentang kegiatan, pembangunan, dan layanan desa untuk masyarakat.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
