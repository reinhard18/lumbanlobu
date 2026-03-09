'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Home, Newspaper, Settings, Menu, X, LogIn, LogOut, MessageSquare, FileText } from 'lucide-react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const navLinks = [
        { href: '/', label: 'Beranda', icon: <Home size={16} /> },
        { href: '/berita', label: 'Berita', icon: <Newspaper size={16} /> },
        { href: '/dana-desa', label: 'Dana Desa', icon: <FileText size={16} /> },
        { href: '/pengaduan', label: 'Pengaduan', icon: <MessageSquare size={16} /> },
    ];

    if (user) {
        navLinks.push({ href: '/admin', label: 'Admin', icon: <Settings size={16} /> });
    }

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-inner">
                <Link href="/" className="header-logo">
                    <div className="header-logo-icon">
                        <img src="/images/Toba.svg" alt="Toba Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <span>Desa Lumban Lobu</span>
                </Link>

                <nav className={`header-nav ${isMobileOpen ? 'open' : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`header-nav-link ${pathname === link.href ? 'active' : ''
                                }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}

                    {user ? (
                        <button
                            className="header-nav-link"
                            onClick={logout}
                            style={{ background: 'none', cursor: 'pointer' }}
                        >
                            <LogOut size={16} />
                            Keluar
                        </button>
                    ) : (
                        <Link href="/login" className={`header-nav-link ${pathname === '/login' ? 'active' : ''}`}>
                            <LogIn size={16} />
                            Masuk
                        </Link>
                    )}
                </nav>

                <button
                    className="header-mobile-toggle"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>
        </header>
    );
}
