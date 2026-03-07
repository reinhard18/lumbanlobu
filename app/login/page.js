'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email dan password wajib diisi');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            router.push('/admin');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">
                        <img src="/images/Toba.svg" alt="Toba Logo" />
                    </div>
                    <h1 className="login-title">Masuk ke Admin</h1>
                    <p className="login-subtitle">
                        Masukkan kredensial Anda untuk mengakses panel admin
                    </p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            <Mail size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="Masukkan email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            <Lock size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="Masukkan password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: 'var(--space-sm)' }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="spinning" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <LogIn size={16} />
                                Masuk
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
