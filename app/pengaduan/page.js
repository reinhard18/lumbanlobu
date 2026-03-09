"use client";
import { useState, useEffect, useCallback } from 'react';
import { Send, MapPin, Camera, User, FileText, CheckCircle2, ChevronRight, Upload, X, Loader2, ClipboardList } from 'lucide-react';

export default function PengaduanPage() {
    const [activeTab, setActiveTab] = useState('form');
    const [pengaduans, setPengaduans] = useState([]);
    const [isLoadingPengaduans, setIsLoadingPengaduans] = useState(false);
    const [formData, setFormData] = useState({
        deskripsi: '',
        nama_pengadu: '',
        kategori: 'Infrastruktur',
        lokasi: '',
        foto_url: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const fetchPengaduans = useCallback(async () => {
        setIsLoadingPengaduans(true);
        try {
            const res = await fetch('/api/pengaduan');
            if (res.ok) {
                const data = await res.json();
                setPengaduans(data);
            }
        } catch (err) {
            console.error('Failed to fetch pengaduans:', err);
        } finally {
            setIsLoadingPengaduans(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'table') {
            fetchPengaduans();
        }
    }, [activeTab, fetchPengaduans]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/api/pengaduan/upload', {
                method: 'POST',
                body: uploadData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, foto_url: data.secure_url }));
            } else {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Gagal mengunggah foto');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/pengaduan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Gagal mengirim pengaduan. Silakan coba lagi.');
            }

            setIsSubmitted(true);
            setFormData({
                deskripsi: '',
                nama_pengadu: '',
                kategori: 'Infrastruktur',
                lokasi: '',
                foto_url: ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '80vh' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ padding: '20px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', color: '#22c55e' }}>
                            <CheckCircle2 size={64} />
                        </div>
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '16px' }}>Terima Kasih!</h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '32px' }}>
                        Laporan pengaduan Anda telah kami terima dan akan segera diproses oleh pihak desa.
                    </p>
                    <button
                        onClick={() => setIsSubmitted(false)}
                        className="btn btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', fontSize: '1.1rem', fontWeight: '700' }}
                    >
                        Buat Pengaduan Lain
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>Layanan Pengaduan</h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '32px' }}>
                        Sampaikan keluhan, saran, atau masukan Anda untuk pembangunan desa yang lebih baik.
                    </p>

                    <div className="admin-tabs" style={{ justifyContent: 'center' }}>
                        <button
                            onClick={() => setActiveTab('form')}
                            className={`admin-tab ${activeTab === 'form' ? 'active' : ''}`}
                        >
                            <FileText size={18} /> Lapor Pengaduan
                        </button>
                        <button
                            onClick={() => setActiveTab('table')}
                            className={`admin-tab ${activeTab === 'table' ? 'active' : ''}`}
                        >
                            <ClipboardList size={18} /> Data Pengaduan
                        </button>
                    </div>
                </div>

                {activeTab === 'form' ? (
                    <>
                        <div className="card" style={{ padding: '32px' }}>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                    <div className="form-group">
                                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FileText size={16} /> Kategori Pengaduan
                                        </label>
                                        <select
                                            name="kategori"
                                            className="form-input"
                                            value={formData.kategori}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Infrastruktur">Infrastruktur</option>
                                            <option value="bansos">Bantuan Sosial (Bansos)</option>
                                            <option value="keamanan">Keamanan</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <User size={16} /> Nama Pengadu (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            name="nama_pengadu"
                                            className="form-input"
                                            placeholder="Biarkan kosong untuk anonim"
                                            value={formData.nama_pengadu}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '24px' }}>
                                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={16} /> Deskripsi Laporan
                                    </label>
                                    <textarea
                                        name="deskripsi"
                                        className="form-input"
                                        rows="5"
                                        placeholder="Jelaskan detail pengaduan Anda..."
                                        value={formData.deskripsi}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                                    <div className="form-group">
                                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={16} /> Lokasi (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            name="lokasi"
                                            className="form-input"
                                            placeholder="Contoh: Dusun III, Dekat Masjid"
                                            value={formData.lokasi}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Camera size={16} /> Foto (Opsional)
                                        </label>
                                        <div className="image-upload-area" style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                                            {formData.foto_url ? (
                                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                                    <img src={formData.foto_url} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, foto_url: '' }))}
                                                        style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                        {isUploading ? (
                                                            <><Loader2 size={24} className="spinning" /> <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Mengunggah...</span></>
                                                        ) : (
                                                            <>
                                                                <Upload size={24} color="#64748b" />
                                                                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Klik untuk upload foto</span>
                                                            </>
                                                        )}
                                                    </label>
                                                    <input
                                                        id="file-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileUpload}
                                                        disabled={isUploading}
                                                        style={{ display: 'none' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div style={{ marginBottom: '24px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.9rem' }}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '16px', fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>

                        <div style={{ marginTop: '40px', padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle2 size={18} color="#22c55e" /> Informasi Laporan
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                Setiap laporan yang masuk akan ditinjau oleh admin desa. Anda dapat memilih untuk tetap anonim dengan mengosongkan kolom nama. Pastikan deskripsi laporan jelas untuk mempermudah proses tindak lanjut.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <tr>
                                        <th style={{ padding: '16px', fontWeight: '700', fontSize: '0.9rem' }}>Tanggal</th>
                                        <th style={{ padding: '16px', fontWeight: '700', fontSize: '0.9rem' }}>Nama</th>
                                        <th style={{ padding: '16px', fontWeight: '700', fontSize: '0.9rem' }}>Kategori</th>
                                        <th style={{ padding: '16px', fontWeight: '700', fontSize: '0.9rem' }}>Deskripsi</th>
                                        <th style={{ padding: '16px', fontWeight: '700', fontSize: '0.9rem' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoadingPengaduans ? (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Loader2 size={24} className="spinning" />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : pengaduans.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                                                Belum ada data pengaduan.
                                            </td>
                                        </tr>
                                    ) : (
                                        pengaduans.map((item) => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '16px', fontSize: '0.9rem' }}>
                                                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: '500' }}>
                                                    {item.nama_pengadu || 'Anonim'}
                                                </td>
                                                <td style={{ padding: '16px', fontSize: '0.9rem' }}>
                                                    <span style={{ padding: '4px 8px', background: '#f1f5f9', borderRadius: '4px', fontSize: '0.8rem' }}>
                                                        {item.kategori}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px', fontSize: '0.9rem', color: '#64748b', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {item.deskripsi}
                                                </td>
                                                <td style={{ padding: '16px', fontSize: '0.9rem' }}>
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        background: item.status === 'Selesai' ? '#dcfce7' : item.status === 'Proses' ? '#fef9c3' : '#f1f5f9',
                                                        color: item.status === 'Selesai' ? '#166534' : item.status === 'Proses' ? '#854d0e' : '#64748b'
                                                    }}>
                                                        {item.status || 'Baru'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
