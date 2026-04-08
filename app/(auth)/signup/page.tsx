'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    const { error } = await signUp({
      email: form.email,
      password: form.password,
      full_name: form.full_name,
      phone: form.phone || undefined,
    });
    if (error) setError(error);
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .auth-bg {
          background: #0B0B0B;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 7rem 1rem 5rem;
        }
        .auth-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 60%);
          pointer-events: none;
        }
        .auth-grain {
          position: absolute;
          inset: 0;
          opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
        }
        .auth-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px) saturate(150%);
          -webkit-backdrop-filter: blur(24px) saturate(150%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), 0 24px 64px rgba(0,0,0,0.55);
          border-radius: 24px;
          padding: 2.5rem;
        }
        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 0.8rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
          transition: border-color 0.25s ease, background 0.25s ease;
          box-sizing: border-box;
        }
        .auth-input::placeholder { color: rgba(255,255,255,0.25); }
        .auth-input:focus {
          border-color: rgba(201,168,76,0.45);
          background: rgba(255,255,255,0.06);
        }
        .auth-btn {
          width: 100%;
          padding: 0.875rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #0B0B0B;
          background: linear-gradient(135deg, #C9A84C 0%, #E5C76B 55%, #C9A84C 100%);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .auth-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0.5rem;
        }
        .auth-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.8rem;
          color: rgba(239,68,68,0.9);
        }
        .auth-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          margin: 1.5rem 0;
        }
        .password-strength {
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.08);
          margin-top: 0.5rem;
          overflow: hidden;
        }
        .password-strength-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease, background 0.3s ease;
        }
      `}</style>

      <div className="flex flex-col min-h-screen bg-brand-black">
        <Navbar />
        <div className="auth-bg flex-1">
        <div className="auth-glow" />
        <div className="auth-grain" />

        <div className="auth-card">
          {/* Logo */}
          <div className="text-center mb-7">
            <img
              src="https://res.cloudinary.com/dqiuwzvfb/image/upload/v1775629677/69007823-DC7E-42E1-AF8E-E57E11810549-Photoroom_nluyul.png"
              alt="AthloCode"
              className="h-12 w-auto object-contain mx-auto mb-5"
            />
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1.5">{t('signup.title')}</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.38)' }}>
              {t('signup.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="auth-error">{error}</div>}

            <div>
              <label className="auth-label">{t('signup.fullName')}</label>
              <input
                className="auth-input"
                type="text"
                placeholder={t('signup.fullNamePlaceholder')}
                value={form.full_name}
                onChange={update('full_name')}
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label className="auth-label">{t('signup.email')}</label>
              <input
                className="auth-input"
                type="email"
                placeholder={t('signup.emailPlaceholder')}
                value={form.email}
                onChange={update('email')}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="auth-label">
                Phone Number{' '}
                <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400, letterSpacing: 0 }}>
                  (optional)
                </span>
              </label>
              <input
                className="auth-input"
                type="tel"
                placeholder="+966 5x xxx xxxx"
                value={form.phone}
                onChange={update('phone')}
                autoComplete="tel"
              />
            </div>

            <div>
              <label className="auth-label">{t('signup.password')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={update('password')}
                  required
                  autoComplete="new-password"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute', right: '0.875rem', top: '50%',
                    transform: 'translateY(-50%)', background: 'none', border: 'none',
                    cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0,
                  }}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Password strength bar */}
              {form.password && (
                <div className="password-strength">
                  <div
                    className="password-strength-fill"
                    style={{
                      width: form.password.length < 6 ? '25%' : form.password.length < 10 ? '60%' : '100%',
                      background: form.password.length < 6
                        ? 'rgba(239,68,68,0.7)'
                        : form.password.length < 10
                        ? 'rgba(234,179,8,0.7)'
                        : 'rgba(34,197,94,0.7)',
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="auth-label">{t('signup.confirmPassword')}</label>
              <input
                className="auth-input"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('signup.confirmPlaceholder')}
                value={form.confirm}
                onChange={update('confirm')}
                required
                autoComplete="new-password"
                style={{
                  borderColor: form.confirm && form.confirm !== form.password
                    ? 'rgba(239,68,68,0.5)'
                    : undefined,
                }}
              />
            </div>

            <div className="pt-1">
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? t('signup.creating') : t('signup.createAccount')}
              </button>
            </div>

            <p className="text-center text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.22)' }}>
              By creating an account you agree to our{' '}
              <Link href="/terms" style={{ color: 'rgba(201,168,76,0.5)' }}>Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" style={{ color: 'rgba(201,168,76,0.5)' }}>Privacy Policy</Link>.
            </p>
          </form>

          <div className="auth-divider" />

          <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {t('signup.haveAccount')}{' '}
            <Link href="/login" style={{ color: '#C9A84C' }} className="font-semibold hover:opacity-80 transition-opacity">
              {t('signup.signIn')}
            </Link>
          </p>
        </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
