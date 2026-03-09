'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    ClipboardList,
    Loader2,
    Shield,
    LogOut,
    Newspaper,
    Activity,
    UserCheck,
    Users,
    Type,
    ImageIcon,
    Upload,
    FileText,
    AlignLeft,
    UserPen,
    Save,
    UserPlus,
    Mail,
    Lock,
    GripVertical,
    MessageSquare,
    X,
    Trash2,
} from 'lucide-react';

function SortableOfficialItem({ off, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: off.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 1,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`admin-news-item ${isDragging ? 'dragging' : ''}`}
        >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                <div
                    {...attributes}
                    {...listeners}
                    style={{ cursor: 'grab', padding: '4px', color: 'var(--color-text-muted)' }}
                >
                    <GripVertical size={18} />
                </div>
                <div className="admin-news-item-thumb" style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: 'var(--color-bg-alt)', flexShrink: 0 }}>
                    {off.image_url ? (
                        <img src={off.image_url} alt={off.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <Users size={18} style={{ margin: 13, color: 'var(--color-text-muted)' }} />
                    )}
                </div>
                <div className="admin-news-item-info">
                    <h3 style={{ fontSize: '1rem' }}>{off.name}</h3>
                    <p style={{ fontSize: '0.85rem' }}>{off.role}</p>
                </div>
            </div>
            <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(off.id)}
                style={{ padding: '6px' }}
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function AdminPage() {
    const { user, token, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('news');
    const [news, setNews] = useState([]);
    const [users, setUsers] = useState([]);
    const [officials, setOfficials] = useState([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingOfficials, setLoadingOfficials] = useState(false);
    const [alert, setAlert] = useState(null);
    const [settings, setSettings] = useState({
        jumlah_penduduk: '',
        kepala_keluarga: '',
        jumlah_dusun: '',
        luas_wilayah: '',
        hero_background_image: '',
    });
    const [loadingSettings, setLoadingSettings] = useState(false);
    const [submittingSettings, setSubmittingSettings] = useState(false);
    const [uploadingHeroImage, setUploadingHeroImage] = useState(false);

    // Pengaduan state
    const [pengaduan, setPengaduan] = useState([]);
    const [loadingPengaduan, setLoadingPengaduan] = useState(false);

    // Dana Desa state
    const [danaDesa, setDanaDesa] = useState([]);
    const [loadingDanaDesa, setLoadingDanaDesa] = useState(false);
    const [danaDesaForm, setDanaDesaForm] = useState({
        year: '',
        image_url: '',
    });
    const [submittingDanaDesa, setSubmittingDanaDesa] = useState(false);
    const [uploadingDanaDesaImage, setUploadingDanaDesaImage] = useState(false);


    // News form
    const [newsForm, setNewsForm] = useState({
        title: '',
        content: '',
        excerpt: '',
        author: 'Admin Desa',
        image_url: '',
    });
    const [submittingNews, setSubmittingNews] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // User form
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'editor',
    });
    const [submittingUser, setSubmittingUser] = useState(false);

    // Official form
    const [officialForm, setOfficialForm] = useState({
        name: '',
        role: '',
        image_url: '',
    });
    const [submittingOfficial, setSubmittingOfficial] = useState(false);
    const [uploadingOfficialImage, setUploadingOfficialImage] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    const authHeaders = useCallback(() => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }), [token]);

    // Fetch news
    const fetchNews = useCallback(async () => {
        try {
            const res = await fetch('/api/news');
            const json = await res.json();
            setNews(json.data || []);
        } catch (err) {
            console.error('Failed to fetch news:', err);
        } finally {
            setLoadingNews(false);
        }
    }, []);

    // Fetch users
    const fetchUsers = useCallback(async () => {
        if (!token) return;
        setLoadingUsers(true);
        try {
            const res = await fetch('/api/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const json = await res.json();
                setUsers(json.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoadingUsers(false);
        }
    }, [token]);

    const fetchSettings = useCallback(async () => {
        setLoadingSettings(true);
        try {
            const res = await fetch('/api/settings');
            const json = await res.json();
            if (res.ok) {
                setSettings(json.data);
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoadingSettings(false);
        }
    }, []);

    const fetchOfficials = useCallback(async () => {
        setLoadingOfficials(true);
        try {
            const res = await fetch('/api/officials');
            const json = await res.json();
            if (res.ok) {
                setOfficials(json.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch officials:', err);
        } finally {
            setLoadingOfficials(false);
        }
    }, []);

    const fetchPengaduan = useCallback(async () => {
        if (!token) return;
        setLoadingPengaduan(true);
        try {
            const res = await fetch('/api/pengaduan', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setPengaduan(data);
            }
        } catch (err) {
            console.error('Failed to fetch pengaduan:', err);
        } finally {
            setLoadingPengaduan(false);
        }
    }, [token]);

    const fetchDanaDesa = useCallback(async () => {
        setLoadingDanaDesa(true);
        try {
            const res = await fetch('/api/dana-desa');
            const json = await res.json();
            if (res.ok) {
                setDanaDesa(json.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch dana desa:', err);
        } finally {
            setLoadingDanaDesa(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchNews();
        }
    }, [user, fetchNews]);

    useEffect(() => {
        if (user && activeTab === 'users') {
            fetchUsers();
        }
    }, [user, activeTab, fetchUsers]);

    useEffect(() => {
        if (user && activeTab === 'stats') {
            fetchSettings();
        }
    }, [user, activeTab, fetchSettings]);

    useEffect(() => {
        if (user && activeTab === 'officials') {
            fetchOfficials();
        }
    }, [user, activeTab, fetchOfficials]);

    useEffect(() => {
        if (user && activeTab === 'pengaduan') {
            fetchPengaduan();
        }
    }, [user, activeTab, fetchPengaduan]);

    useEffect(() => {
        if (user && activeTab === 'dana-desa') {
            fetchDanaDesa();
        }
    }, [user, activeTab, fetchDanaDesa]);

    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 4000);
    };

    // --- News handlers ---
    const handleSubmitNews = async (e) => {
        e.preventDefault();
        if (!newsForm.title.trim() || !newsForm.content.trim()) {
            showAlert('error', 'Judul dan konten wajib diisi!');
            return;
        }

        setSubmittingNews(true);
        try {
            const res = await fetch('/api/news', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({
                    ...newsForm,
                    content: `<p>${newsForm.content.split('\n').filter(Boolean).join('</p><p>')}</p>`,
                }),
            });

            if (res.ok) {
                showAlert('success', 'Berita berhasil ditambahkan!');
                setNewsForm({ title: '', content: '', excerpt: '', author: 'Admin Desa', image_url: '' });
                fetchNews();
            } else {
                const json = await res.json();
                showAlert('error', json.error || 'Gagal membuat berita');
            }
        } catch (err) {
            showAlert('error', 'Terjadi kesalahan jaringan');
        } finally {
            setSubmittingNews(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 4.5 * 1024 * 1024) {
            showAlert('error', 'Ukuran file terlalu besar (maks 4.5MB)');
            return;
        }

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setNewsForm({ ...newsForm, image_url: data.secure_url });
                showAlert('success', 'Gambar berhasil diunggah!');
            } else {
                console.error('Upload error details:', data.details);
                showAlert('error', data.error || 'Gagal mengunggah gambar');
            }
        } catch (err) {
            console.error('Network or unexpected error during upload:', err);
            showAlert('error', 'Terjadi kesalahan saat mengunggah gambar');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDeleteNews = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
        try {
            const res = await fetch(`/api/news/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                showAlert('success', 'Berita berhasil dihapus');
                fetchNews();
            } else {
                showAlert('error', 'Gagal menghapus berita');
            }
        } catch (err) {
            showAlert('error', 'Terjadi kesalahan jaringan');
        }
    };

    // --- User handlers ---
    const handleSubmitUser = async (e) => {
        e.preventDefault();
        if (!userForm.name.trim() || !userForm.email.trim() || !userForm.password.trim()) {
            showAlert('error', 'Nama, email, dan password wajib diisi!');
            return;
        }

        setSubmittingUser(true);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(userForm),
            });

            if (res.ok) {
                showAlert('success', 'Pengguna berhasil ditambahkan!');
                setUserForm({ name: '', email: '', password: '', role: 'editor' });
                fetchUsers();
            } else {
                const json = await res.json();
                showAlert('error', json.error || 'Gagal membuat pengguna');
            }
        } catch (err) {
            showAlert('error', 'Terjadi kesalahan jaringan');
        } finally {
            setSubmittingUser(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                showAlert('success', 'Pengguna berhasil dihapus');
                fetchUsers();
            } else {
                const json = await res.json();
                showAlert('error', json.error || 'Gagal menghapus pengguna');
            }
        } catch (err) {
            showAlert('error', 'Terjadi kesalahan jaringan');
        }
    };

    // --- Official handlers ---
    const handleSubmitOfficial = async (e) => {
        e.preventDefault();
        if (!officialForm.name.trim() || !officialForm.role.trim()) {
            showAlert('error', 'Nama dan jabatan wajib diisi!');
            return;
        }

        setSubmittingOfficial(true);
        try {
            const res = await fetch('/api/officials', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(officialForm),
            });

            if (res.ok) {
                showAlert('success', 'Perangkat desa berhasil ditambahkan!');
                setOfficialForm({ name: '', role: '', image_url: '' });
                fetchOfficials();
            } else {
                const json = await res.json();
                showAlert('error', json.error || 'Gagal menambahkan perangkat desa');
            }
        } catch (err) {
            showAlert('error', 'Terjadi kesalahan jaringan');
        } finally {
            setSubmittingOfficial(false);
        }
    };

    const handleOfficialImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 4.5 * 1024 * 1024) {
            showAlert('error', 'Ukuran file terlalu besar (maks 4.5MB)');
            return;
        }

        setUploadingOfficialImage(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setOfficialForm({ ...officialForm, image_url: data.secure_url });
                showAlert('success', 'Foto berhasil diunggah!');
            } else {
                console.error('Upload error details:', data.details);
                showAlert('error', data.error || 'Gagal mengunggah foto');
            }
        } catch (err) {
            console.error('Network or unexpected error during upload:', err);
            showAlert('error', 'Terjadi kesalahan saat mengunggah foto');
        } finally {
            setUploadingOfficialImage(false);
        }
    };

    const handleDeleteOfficial = async (id) => {
        if (!confirm('Hapus perangkat desa ini?')) return;
        try {
            const res = await fetch(`/api/officials/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                showAlert('success', 'Berhasil dihapus');
                fetchOfficials();
            } else {
                showAlert('error', 'Gagal menghapus');
            }
        } catch (err) {
            showAlert('error', 'Kesalahan jaringan');
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setOfficials((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Call API to save new order
                Promise.resolve().then(async () => {
                    try {
                        await fetch('/api/officials/reorder', {
                            method: 'PUT',
                            headers: authHeaders(),
                            body: JSON.stringify(newItems.map(i => i.id)),
                        });
                    } catch (err) {
                        console.error('Failed to save order:', err);
                        showAlert('error', 'Gagal menyimpan urutan ke server');
                    }
                });

                return newItems;
            });
        }
    };

    // --- Settings handlers ---
    const handleSubmitSettings = async (e) => {
        e.preventDefault();
        setSubmittingSettings(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                showAlert('success', 'Statistik desa berhasil diperbarui!');
                fetchSettings();
            } else {
                const json = await res.json();
                showAlert('error', json.error || 'Gagal memperbarui statistik');
            }
        } catch (err) {
            showAlert('error', 'Terjadi kesalahan jaringan');
        } finally {
            setSubmittingSettings(false);
        }
    };

    const handleUpdatePengaduanStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/pengaduan/${id}`, {
                method: 'PATCH',
                headers: authHeaders(),
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                showAlert('success', 'Status pengaduan diperbarui!');
                fetchPengaduan();
            } else {
                showAlert('error', 'Gagal memperbarui status');
            }
        } catch (err) {
            showAlert('error', 'Terjadi kesalahan jaringan');
        }
    };

    const handleHeroImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 4.5 * 1024 * 1024) {
            showAlert('error', 'Ukuran file terlalu besar (maks 4.5MB)');
            return;
        }

        setUploadingHeroImage(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setSettings({ ...settings, hero_background_image: data.secure_url });
                showAlert('success', 'Gambar hero berhasil diunggah!');
            } else {
                console.error('Upload error details:', data.details);
                showAlert('error', data.error || 'Gagal mengunggah gambar');
            }
        } catch (err) {
            console.error('Network or unexpected error during upload:', err);
            showAlert('error', 'Terjadi kesalahan saat mengunggah gambar');
        } finally {
            setUploadingHeroImage(false);
        }
    };

    // --- Dana Desa handlers ---
    const handleSubmitDanaDesa = async (e) => {
        e.preventDefault();
        if (!danaDesaForm.year.trim()) {
            showAlert('error', 'Tahun wajib diisi!');
            return;
        }
        if (!danaDesaForm.image_url) {
            showAlert('error', 'Gambar wajib diunggah!');
            return;
        }

        setSubmittingDanaDesa(true);
        try {
            const res = await fetch('/api/dana-desa', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(danaDesaForm),
            });

            if (res.ok) {
                showAlert('success', 'Data Dana Desa berhasil ditambahkan!');
                setDanaDesaForm({ year: '', image_url: '' });
                fetchDanaDesa();
            } else {
                const json = await res.json();
                showAlert('error', json.error || 'Gagal menambahkan data Dana Desa');
            }
        } catch (err) {
            showAlert('error', 'Terjadi kesalahan jaringan');
        } finally {
            setSubmittingDanaDesa(false);
        }
    };

    const handleDanaDesaImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 4.5 * 1024 * 1024) {
            showAlert('error', 'Ukuran file terlalu besar (maks 4.5MB)');
            return;
        }

        setUploadingDanaDesaImage(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setDanaDesaForm({ ...danaDesaForm, image_url: data.secure_url });
                showAlert('success', 'Gambar berhasil diunggah!');
            } else {
                console.error('Upload error details:', data.details);
                showAlert('error', data.error || 'Gagal mengunggah gambar');
            }
        } catch (err) {
            console.error('Network or unexpected error during upload:', err);
            showAlert('error', 'Terjadi kesalahan saat mengunggah gambar');
        } finally {
            setUploadingDanaDesaImage(false);
        }
    };

    const handleDeleteDanaDesa = async (id) => {
        if (!confirm('Hapus data Dana Desa ini?')) return;
        try {
            const res = await fetch(`/api/dana-desa/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                showAlert('success', 'Data Dana Desa berhasil dihapus');
                fetchDanaDesa();
            } else {
                showAlert('error', 'Gagal menghapus data Dana Desa');
            }
        } catch (err) {
            showAlert('error', 'Kesalahan jaringan');
        }
    };

    // Loading state
    if (authLoading) {
        return (
            <div className="admin-page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <Loader2 size={32} className="spinning" style={{ color: 'var(--color-primary)' }} />
                <p style={{ marginTop: 'var(--space-md)', color: 'var(--color-text-muted)' }}>
                    Memuat...
                </p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1 className="admin-title">
                    <ClipboardList size={24} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                    Panel Admin
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        <Shield size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                        {user.name} ({user.role})
                    </span>
                    <button className="btn btn-outline-dark btn-sm" onClick={logout}>
                        <LogOut size={14} />
                        Keluar
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'news' ? 'active' : ''}`}
                    onClick={() => setActiveTab('news')}
                >
                    <Newspaper size={16} />
                    Kelola Berita
                </button>
                <button
                    className={`admin-tab ${activeTab === 'pengaduan' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pengaduan')}
                >
                    <MessageSquare size={16} />
                    Pengaduan
                </button>
                <button
                    className={`admin-tab ${activeTab === 'dana-desa' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dana-desa')}
                >
                    <FileText size={16} />
                    Dana Desa
                </button>
                {user.role === 'admin' && (
                    <>
                        <button
                            className={`admin-tab ${activeTab === 'stats' ? 'active' : ''}`}
                            onClick={() => setActiveTab('stats')}
                        >
                            <Activity size={16} />
                            Statistik Desa
                        </button>
                        <button
                            className={`admin-tab ${activeTab === 'officials' ? 'active' : ''}`}
                            onClick={() => setActiveTab('officials')}
                        >
                            <UserCheck size={16} />
                            Perangkat Desa
                        </button>
                        <button
                            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            <Users size={16} />
                            Kelola Pengguna
                        </button>
                    </>
                )}
            </div>

            {alert && (
                <div className={`alert alert-${alert.type}`}>{alert.message}</div>
            )}

            {/* News Tab */}
            {activeTab === 'news' && (
                <div className="admin-grid">
                    <div className="admin-form-card">
                        <h2 className="admin-form-title">Tambah Berita Baru</h2>
                        <form onSubmit={handleSubmitNews}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="news-title">
                                    <Type size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                    Judul Berita *
                                </label>
                                <input
                                    id="news-title"
                                    type="text"
                                    className="form-input"
                                    placeholder="Masukkan judul berita..."
                                    value={newsForm.title}
                                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="news-image">
                                    <ImageIcon size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                    Thumbnail Berita
                                </label>
                                <div className="image-upload-area">
                                    {newsForm.image_url ? (
                                        <div className="image-preview-container">
                                            <img src={newsForm.image_url} alt="Preview" className="image-preview" />
                                            <button
                                                type="button"
                                                className="btn-remove-image"
                                                onClick={() => setNewsForm({ ...newsForm, image_url: '' })}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="image-upload-label-wrapper">
                                            <label className="image-upload-label" htmlFor="news-image">
                                                {uploadingImage ? (
                                                    <><Loader2 size={24} className="spinning" /> Mengunggah...</>
                                                ) : (
                                                    <>
                                                        <Upload size={24} />
                                                        <span>Klik untuk upload gambar</span>
                                                    </>
                                                )}
                                            </label>
                                            <input
                                                type="file"
                                                id="news-image"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploadingImage}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="news-excerpt">
                                    <FileText size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                    Ringkasan
                                </label>
                                <input
                                    id="news-excerpt"
                                    type="text"
                                    className="form-input"
                                    placeholder="Ringkasan singkat berita..."
                                    value={newsForm.excerpt}
                                    onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="news-content">
                                    <AlignLeft size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                    Konten Berita *
                                </label>
                                <textarea
                                    id="news-content"
                                    className="form-textarea"
                                    placeholder="Tulis konten berita di sini..."
                                    value={newsForm.content}
                                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                                    rows={8}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="news-author">
                                    <UserPen size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                    Penulis
                                </label>
                                <input
                                    id="news-author"
                                    type="text"
                                    className="form-input"
                                    placeholder="Nama penulis..."
                                    value={newsForm.author}
                                    onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submittingNews}
                                style={{ width: '100%', marginTop: 'var(--space-sm)' }}
                            >
                                {submittingNews ? (
                                    <><Loader2 size={16} className="spinning" /> Menyimpan...</>
                                ) : (
                                    <><Save size={16} /> Simpan Berita</>
                                )}
                            </button>
                        </form>
                    </div>

                    <div>
                        <h2 className="admin-form-title" style={{ marginBottom: 'var(--space-lg)' }}>
                            Daftar Berita ({news.length})
                        </h2>
                        {loadingNews ? (
                            <div>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="skeleton" style={{ height: 72, marginBottom: 12 }} />
                                ))}
                            </div>
                        ) : news.length === 0 ? (
                            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                                Belum ada berita
                            </p>
                        ) : (
                            <div className="admin-news-list">
                                {news.map((item) => (
                                    <div key={item.id} className="admin-news-item">
                                        <div className="admin-news-item-info">
                                            <h3>{item.title}</h3>
                                            <p>{formatDate(item.created_at)} · {item.author}</p>
                                        </div>
                                        <div className="admin-news-item-actions">
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteNews(item.id)}>
                                                <Trash2 size={14} /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && user.role === 'admin' && (
                <div className="admin-grid">
                    <div className="admin-form-card">
                        <h2 className="admin-form-title">
                            <UserPlus size={18} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                            Tambah Pengguna Baru
                        </h2>
                        <form onSubmit={handleSubmitUser}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="user-name">
                                    <UserPen size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                    Nama *
                                </label>
                                <input
                                    id="user-name"
                                    type="text"
                                    className="form-input"
                                    placeholder="Nama lengkap..."
                                    value={userForm.name}
                                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="user-email">
                                    <Mail size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                    Email *
                                </label>
                                <input
                                    id="user-email"
                                    type="email"
                                    className="form-input"
                                    placeholder="email@desa.go.id"
                                    value={userForm.email}
                                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="user-password">
                                    <Lock size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                    Password *
                                </label>
                                <input
                                    id="user-password"
                                    type="password"
                                    className="form-input"
                                    placeholder="Minimal 6 karakter..."
                                    value={userForm.password}
                                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="user-role">
                                    <Shield size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                    Role
                                </label>
                                <select
                                    id="user-role"
                                    className="form-input"
                                    value={userForm.role}
                                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                >
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submittingUser}
                                style={{ width: '100%', marginTop: 'var(--space-sm)' }}
                            >
                                {submittingUser ? (
                                    <><Loader2 size={16} className="spinning" /> Menyimpan...</>
                                ) : (
                                    <><UserPlus size={16} /> Tambah Pengguna</>
                                )}
                            </button>
                        </form>
                    </div>

                    <div>
                        <h2 className="admin-form-title" style={{ marginBottom: 'var(--space-lg)' }}>
                            Daftar Pengguna ({users.length})
                        </h2>
                        {loadingUsers ? (
                            <div>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="skeleton" style={{ height: 72, marginBottom: 12 }} />
                                ))}
                            </div>
                        ) : users.length === 0 ? (
                            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                                Belum ada pengguna
                            </p>
                        ) : (
                            <div className="admin-news-list">
                                {users.map((u) => (
                                    <div key={u.id} className="admin-news-item">
                                        <div className="admin-news-item-info">
                                            <h3>
                                                {u.name}
                                                <span
                                                    className={`role-badge role-badge-${u.role}`}
                                                    style={{ marginLeft: 8 }}
                                                >
                                                    {u.role}
                                                </span>
                                            </h3>
                                            <p>{u.email} · {formatDate(u.created_at)}</p>
                                        </div>
                                        <div className="admin-news-item-actions">
                                            {u.id !== user.id && (
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)}>
                                                    <Trash2 size={14} /> Hapus
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && user.role === 'admin' && (
                <div className="admin-grid" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="admin-form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h2 className="admin-form-title">
                            <Activity size={18} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                            Edit Statistik Desa
                        </h2>
                        {loadingSettings ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <Loader2 size={24} className="spinning" />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitSettings}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="stat-penduduk">
                                        <Users size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                        Jumlah Penduduk
                                    </label>
                                    <input
                                        id="stat-penduduk"
                                        type="text"
                                        className="form-input"
                                        value={settings.jumlah_penduduk}
                                        onChange={(e) => setSettings({ ...settings, jumlah_penduduk: e.target.value })}
                                        placeholder="Contoh: 5.234"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="stat-kk">
                                        Kepala Keluarga
                                    </label>
                                    <input
                                        id="stat-kk"
                                        type="text"
                                        className="form-input"
                                        value={settings.kepala_keluarga}
                                        onChange={(e) => setSettings({ ...settings, kepala_keluarga: e.target.value })}
                                        placeholder="Contoh: 1.280"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="stat-dusun">
                                        Jumlah Dusun
                                    </label>
                                    <input
                                        id="stat-dusun"
                                        type="text"
                                        className="form-input"
                                        value={settings.jumlah_dusun}
                                        onChange={(e) => setSettings({ ...settings, jumlah_dusun: e.target.value })}
                                        placeholder="Contoh: 4"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="stat-luas">
                                        Luas Wilayah
                                    </label>
                                    <input
                                        id="stat-luas"
                                        type="text"
                                        className="form-input"
                                        value={settings.luas_wilayah}
                                        onChange={(e) => setSettings({ ...settings, luas_wilayah: e.target.value })}
                                        placeholder="Contoh: 850 Ha"
                                    />
                                </div>
                                <div className="form-group" style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-xl)', borderTop: '1px solid var(--color-border-light)' }}>
                                    <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--space-md)' }}>Pengaturan Visual</h3>
                                    <label className="form-label" htmlFor="hero-bg-image">
                                        <ImageIcon size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                        Background Hero (Landing Page)
                                    </label>
                                    <div className="image-upload-area">
                                        {settings.hero_background_image ? (
                                            <div className="image-preview-container">
                                                <img src={settings.hero_background_image} alt="Hero Background Preview" className="image-preview" />
                                                <button
                                                    type="button"
                                                    className="btn-remove-image"
                                                    onClick={() => setSettings({ ...settings, hero_background_image: '' })}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="image-upload-label-wrapper">
                                                <label className="image-upload-label" htmlFor="hero-bg-image">
                                                    {uploadingHeroImage ? (
                                                        <><Loader2 size={24} className="spinning" /> Mengunggah...</>
                                                    ) : (
                                                        <>
                                                            <Upload size={24} />
                                                            <span>Klik untuk upload gambar hero</span>
                                                        </>
                                                    )}
                                                </label>
                                                <input
                                                    type="file"
                                                    id="hero-bg-image"
                                                    accept="image/*"
                                                    onChange={handleHeroImageUpload}
                                                    disabled={uploadingHeroImage}
                                                    style={{ display: 'none' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-xs)' }}>
                                        Ukuran yang disarankan: 1920x1080 (rasio 16:9). Gambar akan otomatis menyesuaikan layar.
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submittingSettings}
                                    style={{ width: '100%', marginTop: 'var(--space-sm)' }}
                                >
                                    {submittingSettings ? (
                                        <><Loader2 size={16} className="spinning" /> Memperbarui...</>
                                    ) : (
                                        <><Save size={16} /> Simpan Perubahan</>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
            {/* Officials Tab */}
            {activeTab === 'officials' && user.role === 'admin' && (
                <div className="admin-grid">
                    <div className="admin-form-card">
                        <h2 className="admin-form-title">
                            <UserCheck size={18} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                            Tambah Perangkat Desa
                        </h2>
                        <form onSubmit={handleSubmitOfficial}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="off-name">Nama Lengkap *</label>
                                <input
                                    id="off-name"
                                    type="text"
                                    className="form-input"
                                    value={officialForm.name}
                                    onChange={(e) => setOfficialForm({ ...officialForm, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="off-role">Jabatan *</label>
                                <input
                                    id="off-role"
                                    type="text"
                                    className="form-input"
                                    value={officialForm.role}
                                    onChange={(e) => setOfficialForm({ ...officialForm, role: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Foto Perangkat</label>
                                <div className="image-upload-area">
                                    {officialForm.image_url ? (
                                        <div className="image-preview-container">
                                            <img src={officialForm.image_url} alt="Preview" className="image-preview" />
                                            <button
                                                type="button"
                                                className="btn-remove-image"
                                                onClick={() => setOfficialForm({ ...officialForm, image_url: '' })}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="image-upload-label-wrapper">
                                            <label className="image-upload-label" htmlFor="off-image">
                                                {uploadingOfficialImage ? (
                                                    <><Loader2 size={24} className="spinning" /> Mengunggah...</>
                                                ) : (
                                                    <>
                                                        <Upload size={24} />
                                                        <span>Klik untuk upload foto</span>
                                                    </>
                                                )}
                                            </label>
                                            <input
                                                type="file"
                                                id="off-image"
                                                accept="image/*"
                                                onChange={handleOfficialImageUpload}
                                                disabled={uploadingOfficialImage}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submittingOfficial}>
                                {submittingOfficial ? <Loader2 size={16} className="spinning" /> : 'Simpan Perangkat Desa'}
                            </button>
                        </form>
                    </div>

                    <div>
                        <h2 className="admin-form-title">Daftar Perangkat Desa ({officials.length})</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                            Geser ikon grip untuk mengatur urutan tampilan.
                        </p>
                        {loadingOfficials ? (
                            <div className="skeleton" style={{ height: 300 }}></div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={officials.map(o => o.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="admin-news-list">
                                        {officials.map((off) => (
                                            <SortableOfficialItem
                                                key={off.id}
                                                off={off}
                                                onDelete={handleDeleteOfficial}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                </div>
            )}

            {/* Pengaduan Tab */}
            {activeTab === 'pengaduan' && (
                <div className="admin-grid" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="admin-form-card" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h2 className="admin-form-title" style={{ marginBottom: 0 }}>
                                Daftar Pengaduan Warga
                            </h2>
                        </div>

                        {loadingPengaduan ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <Loader2 size={32} className="spinning" color="var(--color-primary)" />
                            </div>
                        ) : pengaduan.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>
                                Belum ada pengaduan yang masuk.
                            </p>
                        ) : (
                            <div className="admin-news-list">
                                {pengaduan.map((item) => (
                                    <div key={item.id} className="admin-news-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '16px', padding: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                                    <span className="role-badge" style={{ background: '#f1f5f9', color: '#475569', fontSize: '10px' }}>
                                                        {item.kategori}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '10px',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        background: item.status === 'Selesai' ? '#dcfce7' : item.status === 'Diproses' ? '#fef9c3' : '#fee2e2',
                                                        color: item.status === 'Selesai' ? '#166534' : item.status === 'Diproses' ? '#854d0e' : '#991b1b'
                                                    }}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{item.nama_pengadu}</h3>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                                    {formatDate(item.created_at)} {item.lokasi && ` · ${item.lokasi}`}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleUpdatePengaduanStatus(item.id, e.target.value)}
                                                    className="form-input"
                                                    style={{ padding: '4px 8px', fontSize: '0.85rem', width: 'auto' }}
                                                >
                                                    <option value="Menunggu">Menunggu</option>
                                                    <option value="Diproses">Diproses</option>
                                                    <option value="Selesai">Selesai</option>
                                                </select>
                                            </div>
                                        </div>

                                        <p style={{ lineHeight: '1.6', color: 'var(--color-text-main)' }}>
                                            {item.deskripsi}
                                        </p>

                                        {item.foto_url && (
                                            <div style={{ marginTop: '8px' }}>
                                                <a href={item.foto_url} target="_blank" rel="noopener noreferrer">
                                                    <img
                                                        src={item.foto_url}
                                                        alt="Lampiran Pengaduan"
                                                        style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                                                    />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Dana Desa Tab */}
            {activeTab === 'dana-desa' && (
                <div className="admin-grid">
                    <div className="admin-form-card">
                        <h2 className="admin-form-title">Tambah Data Dana Desa</h2>
                        <form onSubmit={handleSubmitDanaDesa}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="dana-desa-year">
                                    <Type size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                    Tahun *
                                </label>
                                <input
                                    id="dana-desa-year"
                                    type="text"
                                    className="form-input"
                                    placeholder="Contoh: 2024"
                                    value={danaDesaForm.year}
                                    onChange={(e) => setDanaDesaForm({ ...danaDesaForm, year: e.target.value })}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">
                                    <ImageIcon size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                                    Gambar Dana Desa *
                                </label>
                                <div className="image-upload-area">
                                    {danaDesaForm.image_url ? (
                                        <div className="image-preview-container">
                                            <img src={danaDesaForm.image_url} alt="Preview" className="image-preview" />
                                            <button
                                                type="button"
                                                className="btn-remove-image"
                                                onClick={() => setDanaDesaForm({ ...danaDesaForm, image_url: '' })}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="image-upload-label-wrapper">
                                            <label className="image-upload-label" htmlFor="dana-desa-image">
                                                {uploadingDanaDesaImage ? (
                                                    <><Loader2 size={24} className="spinning" /> Mengunggah...</>
                                                ) : (
                                                    <>
                                                        <Upload size={24} />
                                                        <span>Klik untuk upload gambar</span>
                                                    </>
                                                )}
                                            </label>
                                            <input
                                                type="file"
                                                id="dana-desa-image"
                                                accept="image/*"
                                                onChange={handleDanaDesaImageUpload}
                                                disabled={uploadingDanaDesaImage}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '1rem' }}
                                disabled={submittingDanaDesa || uploadingDanaDesaImage}
                            >
                                {submittingDanaDesa ? (
                                    <><Loader2 size={16} className="spinning" /> Menyimpan...</>
                                ) : (
                                    <><Save size={16} /> Simpan Data Dana Desa</>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="admin-list-card">
                        <h2 className="admin-form-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={18} />
                            Daftar Dana Desa
                        </h2>

                        {loadingDanaDesa ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <Loader2 size={24} className="spinning" style={{ color: 'var(--color-primary)', margin: '0 auto' }} />
                                <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>Memuat data dana desa...</p>
                            </div>
                        ) : danaDesa.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)' }}>
                                Belum ada data dana desa.
                            </p>
                        ) : (
                            <div className="admin-news-list">
                                {danaDesa.map((item) => (
                                    <div key={item.id} className="admin-news-item">
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                                            <div className="admin-news-item-thumb" style={{ width: 80, height: 60, borderRadius: '8px', overflow: 'hidden', background: 'var(--color-bg-alt)', flexShrink: 0 }}>
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={`Dana Desa ${item.year}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <ImageIcon size={24} style={{ margin: 18, color: 'var(--color-text-muted)' }} />
                                                )}
                                            </div>
                                            <div className="admin-news-item-info">
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Tahun: {item.year}</h3>
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            title="Hapus"
                                            onClick={() => handleDeleteDanaDesa(item.id)}
                                            style={{ padding: '8px' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
