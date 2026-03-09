'use client';

import { useState, useEffect } from 'react';
import { Loader2, FileText, Image as ImageIcon } from 'lucide-react';

export default function DanaDesaPage() {
    const [danaDesa, setDanaDesa] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDanaDesa = async () => {
            try {
                const res = await fetch('/api/dana-desa');
                const json = await res.json();
                if (res.ok) {
                    setDanaDesa(json.data || []);
                }
            } catch (err) {
                console.error('Failed to fetch dana desa:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDanaDesa();
    }, []);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>


            <main style={{ flex: 1 }}>
                {/* Hero Section */}
                <section
                    style={{
                        padding: '120px 24px 60px',
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, #1e40af 100%)',
                        color: 'white',
                        textAlign: 'center',
                    }}
                >
                    <div className="container" style={{ maxWidth: 800 }}>
                        <h1 style={{ fontSize: '3rem', marginBottom: '16px', fontWeight: 700 }}>
                            Dana Desa
                        </h1>
                        <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6 }}>
                            Informasi dan transparansi pengelolaan Dana Desa Lumban Lobu dari tahun ke tahun.
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section style={{ padding: '60px 24px', backgroundColor: 'var(--color-bg)' }}>
                    <div className="container">
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                <Loader2 size={32} className="spinning" style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
                                <p style={{ marginTop: '16px', color: 'var(--color-text-muted)' }}>Memuat data...</p>
                            </div>
                        ) : danaDesa.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '32px'
                            }}>
                                {danaDesa.map((item) => (
                                    <div key={item.id} style={{
                                        backgroundColor: 'var(--color-surface)',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                                        transition: 'transform 0.2s',
                                        border: '1px solid var(--color-border)'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
                                    >
                                        <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: 'var(--color-bg-alt)', position: 'relative' }}>
                                            {item.image_url ? (
                                                <img 
                                                    src={item.image_url} 
                                                    alt={`Dana Desa Tahun ${item.year}`} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                />
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                                   <ImageIcon size={48} style={{ color: 'var(--color-text-muted)' }} />
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', marginBottom: '8px' }}>
                                                <FileText size={20} />
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Tahun {item.year}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                <div style={{ 
                                    width: 80, 
                                    height: 80, 
                                    borderRadius: '50%', 
                                    backgroundColor: 'var(--color-bg-alt)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    margin: '0 auto 24px' 
                                }}>
                                    <FileText size={32} style={{ color: 'var(--color-text-muted)' }} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Belum Ada Data</h3>
                                <p style={{ color: 'var(--color-text-muted)' }}>
                                    Data informasi Dana Desa belum tersedia saat ini.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
